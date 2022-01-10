#!/bin/bash

export QUEUE_ADDR=$(dig 0.queue +search +short)
node index.js