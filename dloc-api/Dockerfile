FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@9.8.1

RUN npm install

ENV TZ=Europe/Madrid
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./.env .
COPY ./build .

EXPOSE 8080

CMD [ "node", "server.js" ]