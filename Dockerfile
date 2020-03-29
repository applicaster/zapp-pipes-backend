
FROM node:10

WORKDIR /app

ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN:-none}

RUN npm install nodemon -g

COPY package.json package-lock.json .npmrc /app/

RUN npm install

COPY . /app

EXPOSE 8080

CMD npm start
