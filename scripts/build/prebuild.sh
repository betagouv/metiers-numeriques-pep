#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
export $(egrep -v '^#' ./.env | xargs) > /dev/null

if [ "${NODE_ENV}" != 'production' ] || [ -z "${CI}" ]; then
  exit 0
fi

yarn prisma generate
yarn db:migrate
