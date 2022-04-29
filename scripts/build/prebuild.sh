#!/bin/bash

# Exit when any command fails:
set -e

if [ "${NODE_ENV}" != 'production' ] || [ -z "${CI}" ]; then
  exit 0
fi

# Load .env file
if [ "${NODE_ENV}" != 'production' ]; then
  export $(egrep -v '^#' ./.env | xargs) > /dev/null
fi

yarn prisma generate
yarn db:migrate
