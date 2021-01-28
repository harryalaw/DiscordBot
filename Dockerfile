FROM node:latest

#need to install these for canvasjs to work
RUN apt-get update \
    && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package*.json ./ 
RUN npm install

COPY . . 

CMD ["node", "index.js"]
