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
console.log('\x1b[36m%s\x1b[0m', '┌─────────────────────────────────────┐');
console.log('\x1b[36m%s\x1b[0m', '│                                     │');
console.log('\x1b[36m%s\x1b[0m', '│     🚀 Starting FAPI Server...      │');
console.log('\x1b[36m%s\x1b[0m', '│                                     │');
console.log('\x1b[36m%s\x1b[0m', '└─────────────────────────────────────┘');
console.log('');
console.log('\x1b[90m%s\x1b[0m', `Version: ${version}`);
console.log('\x1b[32m%s\x1b[0m', `Port: ${port}`);
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

  // Cleanup function to ensure child process is terminated
  const cleanup = (signal) => {
    console.log(`\n\nStopping FAPI server... (${signal})`);

    if (process.platform === 'win32') {
      // On Windows, use taskkill to ensure all child processes are killed
      spawn('taskkill', ['/pid', child.pid, '/f', '/t'], { shell: true });
    } else {
      // On Unix, kill the process group
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        child.kill('SIGTERM');
      }
    }

    // Force exit after a short delay if child doesn't exit
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  };

  // Handle various termination signals
  process.on('SIGINT', () => cleanup('SIGINT'));   // Ctrl+C
  process.on('SIGTERM', () => cleanup('SIGTERM')); // kill command
  process.on('SIGHUP', () => cleanup('SIGHUP'));   // Terminal closed

  // Handle parent process exit (covers most terminal close scenarios)
  process.on('exit', () => {
    if (child && !child.killed) {
      child.kill();
    }
  });

  // Handle uncaught errors
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    cleanup('uncaughtException');
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
    process.exit(0);
  });
});
