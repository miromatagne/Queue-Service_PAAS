FROM node

WORKDIR /usr/src/app

COPY *.json ./
COPY *.js ./
RUN npm install

CMD [ "node", "index.js"]
