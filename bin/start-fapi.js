#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
let port = 3000;

// Check for port argument
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' || args[i] === '-p') {
    port = args[i + 1];
    break;
  }
}

// Validate port
if (isNaN(port) || port < 1 || port > 65535) {
  console.error('Error: Invalid port number. Please provide a valid port between 1 and 65535.');
  console.error('Usage: npx start-fapi --port <port_number>');
  process.exit(1);
}

// Get the package directory (where FAPI is installed)
const packageDir = path.join(__dirname, '..');

// Read package version
const packageJson = require(path.join(packageDir, 'package.json'));
const version = packageJson.version;

// Check if .next directory exists, if not, show error
const nextDir = path.join(packageDir, '.next');
if (!fs.existsSync(nextDir)) {
  console.error('Error: Application build not found. This package may be corrupted.');
  console.error('Please try reinstalling or clearing npx cache.');
  process.exit(1);
}

console.log('');
console.log('\x1b[36m%s\x1b[0m', '  ______   _____   ______  ______ ');
console.log('\x1b[36m%s\x1b[0m', ' |  ____| |  _  | |  ___ | |_  _|');
console.log('\x1b[36m%s\x1b[0m', ' | |__    | |_| | | |__| |   ||  ');
console.log('\x1b[36m%s\x1b[0m', ' |  __|   |  _  | |  ____/   ||  ');
console.log('\x1b[36m%s\x1b[0m', ' | |      | | | | | |        ||  ');
console.log('\x1b[36m%s\x1b[0m', ' |_|      |_| |_| |_|       |__| ');
console.log('');
console.log('\x1b[90m%s\x1b[0m', ' Create & simulate Fake APIs (FAPIs) within seconds,');
console.log('\x1b[90m%s\x1b[0m', ' for rapid & independent frontend development');
console.log('');
console.log('\x1b[36m%s\x1b[0m', '+---------------------------------------+');
console.log('\x1b[36m%s\x1b[0m', '|                                       |');
console.log('\x1b[36m%s\x1b[0m', '|       Starting FAPI Server...         |');
console.log('\x1b[36m%s\x1b[0m', '|                                       |');
console.log('\x1b[36m%s\x1b[0m', '+---------------------------------------+');
console.log('');
console.log('\x1b[90m%s\x1b[0m', `FAPI Version:           ${version}`);
console.log('\x1b[90m%s\x1b[0m', `FAPI starting on PORT:  ${port}`);
console.log('');

// IMPORTANT: We pass the user's current directory as FAPI_USER_DIR
// so that .fapi-storage is created where the user runs the command
const userDir = process.cwd();

// Check for storage consent BEFORE starting the server
const consentCheck = spawn('node', [path.join(__dirname, 'check-storage-consent.js')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
    FAPI_USER_DIR: userDir
  }
});

consentCheck.on('exit', (code) => {
  if (code !== 0) {
    console.log('FAPI startup cancelled.');
    process.exit(1);
  }

  // Consent given, now start the Next.js server
  console.log('\x1b[32m%s\x1b[0m', `FAPI started on PORT:   ${port}`);
  console.log('\x1b[33m%s\x1b[0m', 'Press Ctrl+C to stop the server');
  console.log('');

  const child = spawn('npx', ['next', 'start', '-p', port], {
    cwd: packageDir,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PORT: port,
      FAPI_USER_DIR: userDir
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\nStopping FAPI server...');
    child.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(0);
  });

  child.on('error', (error) => {
    console.error('Failed to start FAPI server:', error);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\nFAPI server exited with code ${code}`);
      process.exit(code);
    }
  });
});
