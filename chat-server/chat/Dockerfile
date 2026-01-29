FROM node:24-alpine

WORKDIR /usr/src/app

RUN rm -rf node_modules

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8082

CMD [ "npm", "start" ]
