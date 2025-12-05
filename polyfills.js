/**
 * Polyfills for React Native/Metro environment
 * These are needed for AI SDK and react-server-dom-webpack
 */

import { Platform } from 'react-native';
import structuredClone from '@ungap/structured-clone';

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

// Polyfills for AI SDK (from https://ai-sdk.dev/docs/getting-started/expo)
if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import(
      'react-native/Libraries/Utilities/PolyfillFunctions'
    );

    const { TextEncoderStream, TextDecoderStream } = await import(
      '@stardazed/streams-text-encoding'
    );

    if (!('structuredClone' in global)) {
      polyfillGlobal('structuredClone', () => structuredClone);
    }

    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};

