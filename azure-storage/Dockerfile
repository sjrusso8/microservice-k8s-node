FROM node:15.11.0-alpine3.10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production 

COPY ./src ./src
CMD [ "npm", "start" ]