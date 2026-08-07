module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Bundles the generated .sql migrations into the app, so they ship with the
    // JS instead of having to be read off disk at runtime.
    plugins: [["inline-import", { extensions: [".sql"] }]],
  };
};
