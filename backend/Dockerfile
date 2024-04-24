FROM python:3.12.3-bullseye

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /disclone/backend

COPY . /disclone/backend/

RUN python3 -m venv .venv

ENV VIRTUAL_ENV=/disclone/backend/.venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# RUN pip install -r requirements.txt
RUN /disclone/backend/.venv/bin/pip install --no-cache-dir -r requirements.txt