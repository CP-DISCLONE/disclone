FROM python:3.12.3-bullseye

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /disclone/backend

COPY requirements.txt /disclone/backend/

RUN pip install -r requirements.txt

COPY . /disclone/backend/

RUN chmod +x wait-for-postgres.sh

CMD "./wait-for-postgres.sh" "db"
# CMD gunicorn --bind 0.0.0.0:8000 --workers 3 disclone_proj.wsgi:application