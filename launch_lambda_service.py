import datetime
import os
import shutil
import subprocess
import sys
import time


def print_and_check_call(cmd):
    print('  {command}\n'.format(command=' '.join(cmd)))
    subprocess.check_call(cmd)

start_time = datetime.datetime.now()
BASE_DIR = os.path.join(
    os.path.abspath(os.path.dirname(__file__)),
    'lambda-drive-time-polygons'
)

print(f'Running script    : {os.path.abspath(__file__)}')
print(f'Working directory : {BASE_DIR}')
print(f'Begin script at   : {start_time}')

os.chdir(BASE_DIR)

print('\nCopying .lambda-env file to working directory')
time.sleep(2)
src_file = os.path.abspath(os.path.join(
    '..',
    '.envs',
    'prod',
    'lambda'
))
shutil.copyfile(src_file, os.path.join(BASE_DIR, '.lambda-env'))

print('\nUpdating environment variables')
try:
    # Read secrets from an env file formatted VAR=VALUE
    env_filepath = os.path.join(
        BASE_DIR,
        '.lambda-env'
    )
    with open(env_filepath, 'r') as env_file:
        lines = env_file.readlines()

    keys_values = [line.split('=') for line in lines]
    env = {key_value[0]: key_value[1].strip('\n') for key_value in keys_values}

except Exception as exc:
    print(f'\nERROR: Does the env file exist? : {env_filepath}\n\n')
    raise exc

serverless_yml_format_path = os.path.join(BASE_DIR, 'serverless-format.yml')
with open(serverless_yml_format_path, 'r') as in_yaml:
    format_yml = in_yaml.read()

print(f'\nGenerating new serverless.yml from template:\n {serverless_yml_format_path}')
output_yml = format_yml.format(
    security_group=env['security_group'],
    subnet_a=env['subnet_a'],
    subnet_b=env['subnet_b'],
)

with open(os.path.join(BASE_DIR, 'serverless.yml'), 'w') as out_yaml:
    out_yaml.write(output_yml)

print('\nDeploying the lambda function')
print_and_check_call(['serverless', 'deploy'])

end_time = datetime.datetime.now()
print(f'\nScript completed at: {end_time}')
print(f'Time to complete:               {end_time-start_time}')
