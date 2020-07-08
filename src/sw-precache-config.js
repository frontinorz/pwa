module.exports = {
  staticFileGlobs: ["index.html", "style/style.css", "assets/images/**.*"],
  runtimeCaching: [
    {
      urlPattern: /this\\.is\\.a\\.regex/,
      handler: "networkFirst",
    },
  ],
  swFile: "sw-generated.js",
};
