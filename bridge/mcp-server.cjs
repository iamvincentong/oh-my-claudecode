#!/usr/bin/env node
// Resolve global npm modules for native package imports
try {
  var _cp = require('child_process');
  var _Module = require('module');
  var _globalRoot = _cp.execSync('npm root -g', { encoding: 'utf8', timeout: 5000 }).trim();
  if (_globalRoot) {
    var _sep = process.platform === 'win32' ? ';' : ':';
    process.env.NODE_PATH = _globalRoot + (process.env.NODE_PATH ? _sep + process.env.NODE_PATH : '');
    _Module._initPaths();
  }
} catch (_e) { /* npm not available - native modules will gracefully degrade */ }

'use strict';
const { join } = require('path');
const { pathToFileURL } = require('url');

(async () => {
  await import(pathToFileURL(join(__dirname, '..', 'dist', 'mcp', 'standalone-server.js')).href);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
