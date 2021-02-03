FROM node:latest

WORKDIR /usr/src/bot
#need to install these for canvasjs to work
RUN apt-get update \
    && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev

COPY ["package.json","package-lock.json", "./"]
RUN npm install

COPY . .
RUN npx tsc
CMD ["node", "dist/index.js"]
