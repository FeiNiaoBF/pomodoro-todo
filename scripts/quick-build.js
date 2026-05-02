#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const appConfig = require(path.join(rootDir, 'app.json'));
const localBins = {
  eas: path.join(rootDir, 'node_modules', 'eas-cli', 'bin', 'run'),
  jest: path.join(rootDir, 'node_modules', 'jest', 'bin', 'jest.js'),
  tsc: path.join(rootDir, 'node_modules', 'typescript', 'bin', 'tsc'),
};

const VALID_PLATFORMS = new Set(['android', 'ios', 'all']);
const VALID_PROFILES = new Set(['development', 'preview', 'production']);

function parseArgs(argv) {
  const args = {
    platform: 'android',
    profile: 'preview',
    skipChecks: false,
    nonInteractive: true,
    local: false,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--platform' || arg === '-p') {
      args.platform = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--profile' || arg === '-e') {
      args.profile = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--skip-checks') {
      args.skipChecks = true;
      continue;
    }

    if (arg === '--interactive') {
      args.nonInteractive = false;
      continue;
    }

    if (arg === '--local') {
      args.local = true;
      continue;
    }

    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (!arg.startsWith('-') && VALID_PROFILES.has(arg)) {
      args.profile = arg;
      continue;
    }

    if (!arg.startsWith('-') && VALID_PLATFORMS.has(arg)) {
      args.platform = arg;
      continue;
    }

    fail(`Unknown argument: ${arg}`);
  }

  return args;
}

function run(label, command, args) {
  console.log(`\n> ${label}`);
  const invocation = resolveInvocation(command, args);
  const result = spawnSync(invocation.command, invocation.args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if (result.error) {
    fail(`${label} failed to start: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`${label} failed.`);
  }
}

function resolveInvocation(command, args) {
  if (command === 'tsc') {
    return { command: process.execPath, args: [localBins.tsc, ...args] };
  }

  if (command === 'jest') {
    return { command: process.execPath, args: [localBins.jest, ...args] };
  }

  if (command === 'eas' && fileExists(localBins.eas)) {
    return { command: process.execPath, args: [localBins.eas, ...args] };
  }

  if (command === 'eas') {
    return resolveInvocation('npx', ['eas-cli', ...args]);
  }

  if (process.platform === 'win32' && (command === 'npm' || command === 'npx')) {
    return { command: `${command}.cmd`, args };
  }

  return { command, args };
}

function fileExists(filePath) {
  try {
    return require('node:fs').existsSync(filePath);
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));

if (!VALID_PLATFORMS.has(args.platform)) {
  fail(`Invalid platform: ${args.platform}. Use android, ios, or all.`);
}

if (!VALID_PROFILES.has(args.profile)) {
  fail(`Invalid profile: ${args.profile}. Use development, preview, or production.`);
}

console.log(`One Tomato ${appConfig.expo.version}`);
console.log(`Build profile: ${args.profile}`);
console.log(`Platform: ${args.platform}`);

if (!args.skipChecks) {
  run('TypeScript check', 'tsc', ['--noEmit']);
  run('Jest tests', 'jest', ['--runInBand']);
  run('Git whitespace check', 'git', ['diff', '--check']);
}

const easArgs = [
  'build',
  '--platform',
  args.platform,
  '--profile',
  args.profile,
];

if (args.nonInteractive) {
  easArgs.push('--non-interactive');
}

if (args.local) {
  easArgs.push('--local');
}

if (args.dryRun) {
  console.log('\nDry run complete. EAS build was not started.');
  console.log(`Would run: eas ${easArgs.join(' ')}`);
  process.exit(0);
}

run('EAS build', 'eas', easArgs);
