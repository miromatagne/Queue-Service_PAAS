FROM node

WORKDIR /usr/src/app

COPY package.json ./
COPY *.js ./
COPY init.sh ./
RUN npm install
RUN apt update
RUN apt install -y dnsutils

CMD [ "bash", "init.sh"]
