const { defineConfig } = require("vite");
const path = require("path");

// https://vitejs.dev/config
module.exports = defineConfig({
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ["module", "jsnext:main", "jsnext"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
