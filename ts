#!/usr/bin/env bash

set -e

script="typescript/day_$1.ts"

if [[ -n $2 ]]; then
  while true; do
    yarn run ts-node $script
    echo
    sleep $2
  done
else
  yarn run ts-node $script
fi
