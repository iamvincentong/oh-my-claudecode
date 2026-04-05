#!/usr/bin/env node
'use strict';
const { join } = require('path');
const { pathToFileURL } = require('url');

(async () => {
  await import(pathToFileURL(join(__dirname, '..', 'dist', 'cli', 'index.js')).href);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
