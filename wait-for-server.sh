#!/bin/bash

# wait-for-server.sh
#
# Waits for the development server to be ready.

HOST="localhost"
PORT="5173"
TIMEOUT=1
MAX_ATTEMPTS=60
ATTEMPT=0

echo "Waiting for server at http://${HOST}:${PORT}..."

while [ ${ATTEMPT} -lt ${MAX_ATTEMPTS} ]; do
  # Use curl to check if the server is up
  if curl -s "http://${HOST}:${PORT}" > /dev/null; then
    echo "Server is up!"
    exit 0
  fi

  ATTEMPT=$((ATTEMPT + 1))
  sleep ${TIMEOUT}
done

echo "Server did not come up after ${MAX_ATTEMPTS} attempts."
exit 1
