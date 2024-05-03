FROM node:alpine AS builder

WORKDIR /disclone/frontend

RUN apk add --no-cache python3 make g++ \
    && ln -sf python3 /usr/bin/python

COPY package*.json /disclone/frontend/

RUN npm install

COPY . /disclone/frontend/

CMD [ "npm", "run", "dev" ]

# PRODUCTION
# FROM node:alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Production stage
# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# CMD ["nginx", "-g", "daemon off;"]
