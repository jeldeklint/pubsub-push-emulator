#!/bin/bash

setup() {
  echo "Waiting"
  while ! timeout 1 bash -c "echo > /dev/tcp/localhost/8681"; do   
    sleep 1
    echo "Waiting"
  done
  echo "Setting up"
  node setup.js
}

setup &> /dev/stdout &
gcloud beta emulators pubsub start --host-port=0.0.0.0:8681 "$@"