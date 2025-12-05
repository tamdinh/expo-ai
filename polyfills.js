/**
 * Polyfills for React Native/Metro environment
 * These are needed because react-server-dom-webpack expects webpack-specific globals
 */

// Polyfill for __webpack_get_script_filename__
// This function is used by react-server-dom-webpack to resolve module chunks
// In Metro, we return a simple function that returns the module ID
if (typeof global.__webpack_get_script_filename__ === 'undefined') {
  global.__webpack_get_script_filename__ = function (chunkId) {
    // In Metro, we don't have webpack's chunk system
    // Return a simple identifier that can be used for module resolution
    return chunkId || '';
  };
}

// Also set it on globalThis for web compatibility
if (typeof globalThis !== 'undefined' && typeof globalThis.__webpack_get_script_filename__ === 'undefined') {
  globalThis.__webpack_get_script_filename__ = global.__webpack_get_script_filename__;
}

