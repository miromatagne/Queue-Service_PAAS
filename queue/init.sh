#!/bin/sh

sleep 30s

while [ -z "$(dig coordination.$KUMORI_ROLE_SUBDOMAIN +short)" ]; do
  echo "Getting IP addresses..." >> log.log
done

echo "$(dig coordination.$KUMORI_ROLE_SUBDOMAIN +short)" >> log.log

IPS=$(dig coordination.$KUMORI_ROLE_SUBDOMAIN +short | sed "s/$/:6222/" | sed "s/^/nats-route:\/\/ruser:T0pS3cr3t@/")
IPS=$(echo $IPS | sed "s/ /, /g")

echo "$IPS" >> log.log

sed "s|routes = \[\]|routes = [$IPS]|" /etc/nats/nats-server.conf > /etc/nats/nats-server2.conf

nats-server --config /etc/nats/nats-server2.conf
