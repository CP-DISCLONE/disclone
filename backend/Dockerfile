FROM python:3.12.3-bullseye

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /disclone/backend

COPY . /disclone/backend/

RUN pip install -r requirements.txt