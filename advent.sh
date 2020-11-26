#!/usr/bin/env bash

set -e

yarn run tsc
node "dist/day_${1}.js"
