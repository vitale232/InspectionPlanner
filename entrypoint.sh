#!/bin/sh

if [ "$DATABASE" = "rds" ]
then
    echo "Waiting for postgres..."
    while ! nc -z $RDS_HOSTNAME $RDS_PORT; do
      sleep 0.1
    done

    echo "RDS DB connection started"
fi

python manage.py makemigrations --no-input
python manage.py migrate --no-input
python manage.py collectstatic --no-input
python manage.py check --deploy

exec "$@"
