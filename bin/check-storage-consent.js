#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const FAPI_STORAGE_FOLDER_NAME = '.fapi-storage';
const DYNAMIC_STORAGE_PATH = (port) => `fapi-endpoints-${port}.json`;

const getStorageDirectory = (userDir) => {
  const cwd = userDir || process.cwd();
  return path.join(cwd, FAPI_STORAGE_FOLDER_NAME);
};

const getFapiStorageFilePathPerPort = (fapiStorageDirectory, port) => {
  return path.join(fapiStorageDirectory, DYNAMIC_STORAGE_PATH(port));
};

const checkAndRequestConsent = async (port, userDir) => {
  const fapiStorageDirectory = getStorageDirectory(userDir);
  const fapiStorageFilePath = getFapiStorageFilePathPerPort(
    fapiStorageDirectory,
    port
  );

  try {
    await fs.access(fapiStorageFilePath);
    return true;
  } catch {
    console.log('\n');
    console.log('⚠️  FAPI Storage Consent Required');
    console.log('━'.repeat(60));
    console.log(
      'FAPI needs to create a local storage folder in your current directory'
    );
    console.log('to save mock API endpoints.');
    console.log('');
    console.log(`📍 Full Path: ${fapiStorageFilePath}`);
    console.log('');
    console.log(
      'This folder will contain JSON files with your endpoint configurations.'
    );
    console.log('━'.repeat(60));
    console.log('');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('Do you consent to creating this storage? (Y/n): ', (answer) => {
        rl.close();

        const normalizedAnswer = answer.trim().toLowerCase();

        if (
          normalizedAnswer === '' ||
          normalizedAnswer === 'y' ||
          normalizedAnswer === 'yes'
        ) {
          console.log('✅ Consent granted. Starting FAPI...\n');
          resolve(true);
        } else {
          console.log('\n❌ Consent denied. FAPI cannot run without storage.');
          console.log('Exiting...\n');
          resolve(false);
        }
      });
    });
  }
};

const main = async () => {
  const port = process.env.PORT || '3000';
  const userDir = process.env.FAPI_USER_DIR || process.cwd();

  const consentGiven = await checkAndRequestConsent(port, userDir);

  if (!consentGiven) {
    process.exit(1);
  }

  process.exit(0);
};

main().catch((err) => {
  console.error('Error checking consent:', err);
  process.exit(1);
});
