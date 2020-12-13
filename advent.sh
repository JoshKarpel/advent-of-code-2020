#!/usr/bin/env bash

set -e

yarn run tsc

if [[ "${1}" == "all" ]]; then
  for script in dist/day_*.js; do
    node "${script}"
    echo
  done
else
  node "dist/day_${1}.js"
fi
