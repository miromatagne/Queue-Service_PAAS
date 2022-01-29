FROM nats:2.7.1-alpine3.15
COPY init.sh ./
RUN apk update
RUN apk add bind-tools
CMD ["sh", "init.sh"]