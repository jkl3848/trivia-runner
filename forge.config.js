const { VitePlugin } = require("@electron-forge/plugin-vite");
const path = require("path");

module.exports = {
  packagerConfig: {
    asar: true,
    // Don't ignore node_modules that are needed
    ignore: [/^\/\.git/, /^\/node_modules\/\.cache/, /^\/\.github/, /^\/out/],
    // Copy themes to resources (outside asar)
    extraResource: ["themes"],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "win32"],
    },
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/main.js",
          config: "vite.main.config.js",
        },
        {
          entry: "src/preload.js",
          config: "vite.preload.config.js",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.js",
        },
      ],
    }),
  ],
};
