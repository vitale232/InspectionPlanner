import datetime
import os
import subprocess
import sys
import time

from tqdm import tqdm


def print_and_check_call(cmd):
    print('  {command}'.format(command=' '.join(cmd)))
    subprocess.check_call(cmd)

cli_args = sys.argv[1:]

require_input = True
use_cache = True
for arg in cli_args:
    if arg == '--no-input':
        require_input = False
    if arg == '--no-cache':
        use_cache = False


start_time = datetime.datetime.now()
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

print(f'Running script    : {os.path.abspath(__file__)}')
print(f'Working directory : {BASE_DIR}')
print(f'Begin script at   : {start_time}')

try:
    # Read secrets from an env file formatted VAR=VALUE
    env_filepath = os.path.join(
        BASE_DIR,
        '.envs/prod/launch_script'
    )
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
    print_and_check_call([
        'ng', 'build', '--prod',
    ])

print('\nBuilding Docker images')
# Allow a little time to scan console output
time.sleep(2)
os.chdir(BASE_DIR)
docker_build_command = [
    'docker-compose', '-f', 'docker-compose.ecs-local.yml', 'build',
]
if not use_cache:
    docker_build_command += ['--no-cache']
print_and_check_call(docker_build_command)

print('\nTagging Docker images')
time.sleep(2)
print_and_check_call([
    'docker', 'tag', 'inspection_planner_django:latest', env['DJANGO_ECR_REPOSITORY']
])
print_and_check_call([
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
print_and_check_call([
    'docker', 'push', env['DJANGO_ECR_REPOSITORY']
])
print_and_check_call([
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
        'service in 10 seconds... (ctrl+c to cancel)'
    )
    os.chdir(BASE_DIR)

    for i in tqdm(range(10)):
        time.sleep(1)

    print('')
    print_and_check_call([
        'ecs-cli', 'compose',
        '--file', 'docker-compose.ecs.yml',
        '--ecs-params', 'ecs-params.yml',
            'service', 'up',
        '--create-log-groups',
        '--cluster-config', 'ipa-config-small',
        '--ecs-profile', 'ipa-profile',
    ])

end_time = datetime.datetime.now()
print(f'\nScript completed at: {end_time}')
print(f'Time to complete:               {end_time-start_time}')
