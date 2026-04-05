#!/usr/bin/env node
import { mkdir, writeFile } from 'fs/promises';

const outfile = 'bridge/team-mcp.cjs';
await mkdir('bridge', { recursive: true });

const content = `#!/usr/bin/env node
'use strict';
const { join } = require('path');
const { pathToFileURL } = require('url');

(async () => {
  await import(pathToFileURL(join(__dirname, '..', 'dist', 'mcp', 'team-server.js')).href);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;

await writeFile(outfile, content, 'utf8');
console.log(`Built ${outfile}`);
