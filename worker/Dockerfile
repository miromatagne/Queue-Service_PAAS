FROM node

WORKDIR /usr/src/app

COPY package.json ./
COPY *.js ./
RUN npm install
RUN apt update
RUN apt install -y dnsutils

CMD [ "bash", "init.sh"]
