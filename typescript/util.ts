import fs = require('fs');

export function readFileLines (path: string): string[] {
  return fs.readFileSync(path, 'utf8').split('\n')
}
