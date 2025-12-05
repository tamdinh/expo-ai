// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

// Resolve empty-module.js for SSR
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "metro-runtime/src/modules/empty-module.js") {
    return {
      filePath: path.resolve(__dirname, "node_modules/@expo/metro-runtime/src/modules/empty-module.js"),
      type: "sourceFile",
    };
  }
  // Fall back to the default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
