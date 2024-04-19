#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

export PGPASSWORD='postgres'

until psql -h "$host" -U "postgres" -c '\d'; do
    >&2 echo "Postgres is unavailable - sleeping"
    sleep 1
done

>&2 echo "Postgres is up - executing command"

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000