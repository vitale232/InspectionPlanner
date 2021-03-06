import os
import sys


env_variables = [
    'RDS_DB_NAME', 'RDS_USERNAME', 'RDS_HOSTNAME',
    'RDS_PASSWORD', 'RDS_PORT', 'SECRET_KEY', 'DEBUG', 'ALLOWED_HOSTS',
    'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'LAMBDA_NAME',
]

if all([var in os.environ for var in env_variables]):
    print('import from docker env')
    database_name = os.environ.get('RDS_DB_NAME')
    database_user = os.environ.get('RDS_USERNAME')
    database_host = os.environ.get('RDS_HOSTNAME')
    database_password = os.environ.get('RDS_PASSWORD')
    database_port = os.environ.get('RDS_PORT')
    secret_key = os.environ.get('SECRET_KEY')
    debug = os.environ.get('DEBUG', 'FALSE')
    allowed_hosts = os.environ.get('ALLOWED_HOSTS')
    ALLOWED_HOSTS = allowed_hosts.split(';')
    aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    LAMBDA_NAME = os.environ.get('LAMBDA_NAME')

    if debug == 'TRUE':
        DEBUG = True
    else:
        DEBUG = False
    
else:
    print('import from secrets.py')
    from .secrets import (
        database_host, database_name, database_port,
        database_password, database_user, secret_key,
        ALLOWED_HOSTS, aws_access_key_id, aws_secret_access_key,
        LAMBDA_NAME
    )

    DEBUG = True



# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = secret_key

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',

    'django_extensions',
    'rest_framework',
    'rest_framework_gis',
    'django_filters',
    'django_q',

    'inspection_planner',
    'routing',
    'bridges',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'inspection_planner.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'inspection_planner.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': database_name,
        'HOST': database_host,
        'PORT': database_port,
        'USER': database_user,
        'PASSWORD': database_password,

    }
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'angular-app', 'dist', 'angular-app')
]


# Django Rest Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 1000,
}

# Have Django enforce some security headers on browsers that support it
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
if DEBUG == False:
    # SECURE_SSL_REDIRECT = True
    # SECURE_HSTS_SECONDS = 60
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    

# Extra logging from django server or green unicorn
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'stream': sys.stdout,
        }
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO'
    }
}

Q_CLUSTER = {
    'name': 'ipa-queue-2',
    'workers': 1,
    'timeout': 600,
    'retry': 180,
    'queue_limit': 100,
    'bulk': 5,
    'sqs': {
        'aws_region': 'us-east-1',
        'aws_access_key_id': aws_access_key_id,
        'aws_secret_access_key': aws_secret_access_key,
    }
}

print(f'Here are your allowed hosts: {ALLOWED_HOSTS}')
print(f'Debug={DEBUG}')
