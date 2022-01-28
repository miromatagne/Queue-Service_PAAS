#!/bin/bash

node index.js $(dig 0.queueclient +search +short | tr "\n" " ")