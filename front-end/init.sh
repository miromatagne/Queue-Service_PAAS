#!/bin/bash

sleep 1m

echo "$(dig 0.queueclient +search +short)" >> log.log
echo "$(dig 0.queueclient +search +short | tr "\n" " ")" >> log.log

node index.js $(dig 0.queueclient +search +short | tr "\n" " ")