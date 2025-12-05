#!/usr/bin/env node

/**
 * Script to create empty-module.js for @expo/metro-runtime
 * This file is required for Expo Router SSR but is missing from the package
 */

const fs = require('fs');
const path = require('path');

const emptyModulePath = path.resolve(
  __dirname,
  '../node_modules/@expo/metro-runtime/src/modules/empty-module.js'
);

const modulesDir = path.dirname(emptyModulePath);

// Create modules directory if it doesn't exist
if (!fs.existsSync(modulesDir)) {
  fs.mkdirSync(modulesDir, { recursive: true });
}

// Create empty-module.js file
const emptyModuleContent = 'module.exports = {};\n';

try {
  fs.writeFileSync(emptyModulePath, emptyModuleContent, 'utf8');
  console.log('✓ Created empty-module.js for @expo/metro-runtime');
} catch (error) {
  console.error('✗ Failed to create empty-module.js:', error.message);
  process.exit(1);
}

