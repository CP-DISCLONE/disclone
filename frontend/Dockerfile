FROM node:latest AS builder

WORKDIR /disclone/frontend

COPY package.json /disclone/frontend/

RUN npm install vite -g

RUN npm install

COPY . /disclone/frontend/

CMD [ "npm", "run", "dev" ]
# nginx config coming later