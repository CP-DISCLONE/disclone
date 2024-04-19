FROM python:3.12.3-bullseye

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /disclone/backend

COPY requirements.txt /disclone/backend/

RUN pip install -r requirements.txt

COPY . /disclone/backend/

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
# CMD gunicorn --bind 0.0.0.0:8000 --workers 3 disclone_proj.wsgi:application