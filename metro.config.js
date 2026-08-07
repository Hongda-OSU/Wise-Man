const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Lets babel-plugin-inline-import resolve the generated migration files.
config.resolver.sourceExts.push("sql");

module.exports = config;
