FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

COPY ./config /config

ENV NODE_CONFIG_DIR /config
ENV NODE_ENV=production

EXPOSE 3000
CMD [ "npm", "run", "start" ]