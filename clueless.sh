#!/bin/bash

set +e

if ! command -v docker &> /dev/null
then
  if command -v podman &> /dev/null
  then
    function docker() {
      podman $@
    }
  else
    echo "Neither docker nor podman found!!!"
    exit 1
  fi
fi

export DOCKER_COMPOSE_COMMAND="docker compose"
${DOCKER_COMPOSE_COMMAND} version &> /dev/null
if [ "$?" -ne 0 ]; then
  export DOCKER_COMPOSE_COMMAND="docker-compose"
fi

set -e

usage() {
  echo "Usage: $1 [start, stop, build, run, dev]" >&2
  echo "*  start: build and run" >&2
  echo "*  stop: stop the containers (compose stop)" >&2
  echo "*  build: build the containers (compose build)" >&2
  echo "*  run: run the containers (compose up)" >&2
  echo "*  dev: run using compose-dev" >&2
  exit 1
}

if [ "$#" -eq 0 ]; then
  usage $0
fi


case $1 in
  start )
    ./clueless.sh build
    ./clueless.sh run
    ;;
  stop )
    ${DOCKER_COMPOSE_COMMAND} -f compose.yaml down -t 30
    ;;
  build )
    ${DOCKER_COMPOSE_COMMAND} -f compose.yaml -f compose-build.yaml build
    ;;
  run )
    ${DOCKER_COMPOSE_COMMAND} -f compose.yaml up -d
    ;;
  dev )
    ${DOCKER_COMPOSE_COMMAND} -f compose.yaml -f compose-dev.yaml up -d
    ;;
  * )
    usage $0
    ;;
esac