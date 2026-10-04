const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5500/frontend", // o el puerto donde abras tu index.html
    supportFile: false,
  },
});
