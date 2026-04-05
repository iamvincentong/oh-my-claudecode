import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');

const CJS_BRIDGE_TARGETS = [
  ['bridge/cli.cjs', "join(__dirname, '..', 'dist', 'cli', 'index.js')", false],
  ['bridge/mcp-server.cjs', "join(__dirname, '..', 'dist', 'mcp', 'standalone-server.js')", true],
  ['bridge/team-mcp.cjs', "join(__dirname, '..', 'dist', 'mcp', 'team-server.js')", false],
] as const;

describe('bridge wrapper contract', () => {
  it.each(CJS_BRIDGE_TARGETS)('%s delegates to %s', (bridgePath, target, needsNodePathBootstrap) => {
    const source = readFileSync(join(REPO_ROOT, bridgePath), 'utf-8');

    expect(source).toContain('#!/usr/bin/env node');
    expect(source).toContain('pathToFileURL');
    expect(source).toContain(target);

    if (needsNodePathBootstrap) {
      expect(source).toContain("process.platform === 'win32' ? ';' : ':'");
      expect(source).toContain('_Module._initPaths()');
    }
  });

  it('bridge/team.js re-exports the dist team module', () => {
    const source = readFileSync(join(REPO_ROOT, 'bridge/team.js'), 'utf-8');

    expect(source).toContain("export * from '../dist/cli/team.js'");
  });
});

describe('bridge build scripts emit wrapper targets', () => {
  it('build-cli script targets dist CLI wrappers', () => {
    const source = readFileSync(join(REPO_ROOT, 'scripts/build-cli.mjs'), 'utf-8');

    expect(source).toContain("join(__dirname, '..', 'dist', 'cli', 'index.js')");
    expect(source).toContain("../dist/cli/team.js");
  });

  it('build-mcp-server script targets dist standalone server', () => {
    const source = readFileSync(join(REPO_ROOT, 'scripts/build-mcp-server.mjs'), 'utf-8');

    expect(source).toContain("join(__dirname, '..', 'dist', 'mcp', 'standalone-server.js')");
  });

  it('build-team-server script targets dist team server', () => {
    const source = readFileSync(join(REPO_ROOT, 'scripts/build-team-server.mjs'), 'utf-8');

    expect(source).toContain("join(__dirname, '..', 'dist', 'mcp', 'team-server.js')");
  });

});
