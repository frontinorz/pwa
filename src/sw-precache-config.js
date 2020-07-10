module.exports = {
  staticFileGlobs: [
    "./index.html",
    "./manifest.json",
    "./style/style.css",
    "./assets/images/**.*",
  ],
  runtimeCaching: [
    {
      urlPattern: /this\\.is\\.a\\.regex/,
      handler: "networkFirst",
    },
  ],
  swFile: "sw-generated.js",
};
