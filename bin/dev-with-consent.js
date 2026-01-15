#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || '3000';

// Clean up stale Next.js lock file
const lockFile = path.join(process.cwd(), '.next', 'dev', 'lock');
try {
  if (fs.existsSync(lockFile)) {
    fs.unlinkSync(lockFile);
  }
} catch (err) {
  // Ignore errors if lock file doesn't exist or can't be deleted
}

console.log('\n🔍 Checking storage consent...\n');

const consentCheck = spawn('node', [path.join(__dirname, 'check-storage-consent.js')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
    FAPI_USER_DIR: process.env.FAPI_USER_DIR || process.cwd()
  }
});

consentCheck.on('exit', (code) => {
  if (code !== 0) {
    console.log('Development server startup cancelled.');
    process.exit(1);
  }

  console.log('Starting Next.js development server...\n');

  const devServer = spawn('next', ['dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: port
    }
  });

  process.on('SIGINT', () => {
    console.log('\n\nStopping development server...');
    devServer.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    devServer.kill('SIGTERM');
    process.exit(0);
  });

  devServer.on('error', (error) => {
    console.error('Failed to start development server:', error);
    process.exit(1);
  });

  devServer.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\nDevelopment server exited with code ${code}`);
      process.exit(code);
    }
  });
});
