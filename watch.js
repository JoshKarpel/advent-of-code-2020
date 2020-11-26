#!/usr/bin/env node

const concurrently = require('concurrently')

concurrently(
  [
    { command: 'tsc -w --preserveWatchOutput', prefixColor: 'blue', name: 'tsc' },
    { command: `nodemon -L dist/day_${process.argv[2]}.js`, prefixColor: 'magenta', name: 'advent' }
  ]
)
