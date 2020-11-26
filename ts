#!/usr/bin/env bash


run="ts-node --pretty typescript/day_$1.ts"

if [[ -n $2 ]]; then
  while true; do
    date
    $run
    echo
    sleep $2
  done
else
  set -e
  $run
fi
