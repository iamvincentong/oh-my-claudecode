#!/usr/bin/env node
import { mkdir, writeFile } from 'fs/promises';

await mkdir('bridge', { recursive: true });

const cliContent = `#!/usr/bin/env node
'use strict';
const { join } = require('path');
const { pathToFileURL } = require('url');

(async () => {
  await import(pathToFileURL(join(__dirname, '..', 'dist', 'cli', 'index.js')).href);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;

const teamContent = `export * from '../dist/cli/team.js';
`;

await writeFile('bridge/cli.cjs', cliContent, 'utf8');
console.log('Built bridge/cli.cjs');

await writeFile('bridge/team.js', teamContent, 'utf8');
console.log('Built bridge/team.js');
