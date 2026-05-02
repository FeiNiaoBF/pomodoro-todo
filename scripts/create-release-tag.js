#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const appConfig = require(path.join(rootDir, 'app.json'));
const packageConfig = require(path.join(rootDir, 'package.json'));

const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function parseArgs(argv) {
  const args = {
    allowDirty: false,
    dryRun: false,
    push: false,
    message: undefined,
    version: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--allow-dirty') {
      args.allowDirty = true;
      continue;
    }

    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (arg === '--push') {
      args.push = true;
      continue;
    }

    if (arg === '--message' || arg === '-m') {
      args.message = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--version' || arg === '-v') {
      args.version = normalizeVersion(argv[index + 1]);
      index += 1;
      continue;
    }

    if (!arg.startsWith('-') && !args.version) {
      args.version = normalizeVersion(arg);
      continue;
    }

    fail(`Unknown argument: ${arg}`);
  }

  return args;
}

function normalizeVersion(version) {
  return version ? version.replace(/^v/, '') : version;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
  });

  if (result.status !== 0) {
    if (options.capture && result.stderr) {
      process.stderr.write(result.stderr);
    }

    fail(`Command failed: ${command} ${args.join(' ')}`);
  }

  return options.capture ? result.stdout.trim() : '';
}

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const version = args.version ?? appConfig.expo.version;
const tagName = `v${version}`;
const message = args.message ?? `Release ${tagName}`;

if (!SEMVER_PATTERN.test(version)) {
  fail(`Version must be valid SemVer. Received: ${version}`);
}

if (packageConfig.version !== appConfig.expo.version) {
  console.warn(
    `Warning: package.json version (${packageConfig.version}) differs from app.json Expo version (${appConfig.expo.version}).`
  );
  console.warn('Using app.json Expo version unless --version is provided.\n');
}

console.log(`Tag: ${tagName}`);
console.log(`Message: ${message}`);

if (args.dryRun) {
  console.log('Dry run complete. No Git command was run and no tag was created.');
  console.log(`Would run: git tag -a ${tagName} -m "${message}"`);
  if (args.push) {
    console.log(`Would run: git push origin ${tagName}`);
  }
  process.exit(0);
}

run('git', ['rev-parse', '--is-inside-work-tree'], { capture: true });

const status = run('git', ['status', '--porcelain'], { capture: true });

if (status && !args.allowDirty) {
  fail(
    'Working tree is not clean. Commit or stash changes first, or pass --allow-dirty for a local-only tag.'
  );
}

const existingTag = spawnSync('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tagName}`], {
  cwd: rootDir,
  encoding: 'utf8',
  stdio: 'ignore',
});

if (existingTag.status === 0) {
  fail(`Tag already exists: ${tagName}`);
}

run('git', ['tag', '-a', tagName, '-m', message]);

if (args.push) {
  run('git', ['push', 'origin', tagName]);
}

console.log(`Created annotated tag ${tagName}.`);
