import datetime
import os
import subprocess
import sys
import time


cli_arg = sys.argv[-1]

require_input = True
if cli_arg == '--no-input':
    require_input = False

start_time = datetime.datetime.now()
BASE_DIR = os.getcwd()

print(f'Running script    : {os.path.abspath(__file__)}')
print(f'Working directory : {BASE_DIR}')
print(f'Begin script at   : {start_time}')

try:
    # Read secrets from an env file formatted VAR=VALUE
    env_filepath = '.envs/prod/launch_script'
    with open(env_filepath, 'r') as env_file:
        lines = env_file.readlines()

    keys_values = [line.split('=') for line in lines]
    env = {key_value[0]: key_value[1].strip('\n') for key_value in keys_values}

except Exception as exc:
    print(f'\nERROR: Does the env file exist? : {env_filepath}\n\n')
    raise exc

if not require_input:
    build_angular = True
else:
    build_angular = input('\nBuild Angular application? [Y/n] ')
    if build_angular == '':
        build_angular = 'y'

    if build_angular.lower() in ['y', 'yes', 'yeah', 'yep', 'ok', 'okay', 'sure']:
        build_angular = True
    else:
        print(f' Skipping ng build due to user input: "{build_angular}"')
        build_angular = False

if build_angular:
    print('\nBuilding angular app with production flag')
    os.chdir(os.path.join(BASE_DIR, 'angular-app'))
    subprocess.check_call([
        'ng', 'build', '--prod',
    ])

print('\nBuilding Docker images')
# Allow a little time to scan console output
time.sleep(2)
os.chdir(BASE_DIR)
subprocess.check_call([
    'docker-compose', '-f', 'docker-compose.ecs-local.yml', 'build',
])

print('\nTagging Docker images')
time.sleep(2)
subprocess.check_call([
    'docker', 'tag', 'inspection_planner_django:latest', env['DJANGO_ECR_REPOSITORY']
])
subprocess.check_call([
    'docker', 'tag', 'inspection_planner_nginx:latest', env['NGINX_ECR_REPOSITORY']
])

print('\nLogging in to ECR')
time.sleep(2)
ecr_output = subprocess.run(
    [
        'aws', 'ecr', 'get-login',
        '--registry-ids', env['REGISTRY_ID'],
        '--no-include-email'
    ],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)
# The bash output is saved to a CompletedProcess object.
#  CompletedProcess.stdout is a byte string for some reason,
#  so convert it to a python string then strip formatting characters
#  from the bash output
stdout = str(ecr_output.stdout)
docker_login = stdout.split(' ')
docker_login[0] = docker_login[0].replace("b'", "")
docker_login[-1] = docker_login[-1].replace("\\n'", "")

# Run the output of aws ecr get-login command
subprocess.run(docker_login)

print('\nPushing Docker images')
time.sleep(2)
subprocess.check_call([
    'docker', 'push', env['DJANGO_ECR_REPOSITORY']
])
subprocess.check_call([
    'docker', 'push', env['NGINX_ECR_REPOSITORY']
])

if not require_input:
    launch_ecs = True
else:
    launch_ecs = input(
        '\nLaunch the ECS service? This will result in downtime. [N/y] ')
    if launch_ecs == '':
        launch_ecs = 'n'

    if launch_ecs.lower() in ['y', 'yes', 'yeah', 'yep', 'ok', 'okay', 'sure']:
        launch_ecs = True
    else:
        print(f' Launch aborted due to user input: "{launch_ecs}"')
        launch_ecs = False

if launch_ecs:
    print(
        '\n[!!DOWNTIME WARNING!!] Launching the ECS ' +
        'service in 5 seconds... (ctrl+c to cancel)'
    )
    os.chdir(BASE_DIR)
    time.sleep(5)
    subprocess.check_call([
        'ecs-cli', 'compose',
        '--file', 'docker-compose.ecs.yml',
        '--ecs-params', 'ecs-params.yml',
            'service', 'up',
        '--create-log-groups', '--cluster-config', 'ipa-config',
        '--ecs-profile', 'ipa-profile',
    ])

end_time = datetime.datetime.now()
print(f'\nScript completed at: {end_time}')
print(f'Time to complete:               {end_time-start_time}')
