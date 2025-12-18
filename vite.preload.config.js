const { defineConfig } = require("vite");

// https://vitejs.dev/config
module.exports = defineConfig({
  resolve: {
    browserField: false,
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
});
