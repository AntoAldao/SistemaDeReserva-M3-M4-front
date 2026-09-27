const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 's8oz48',
  e2e: {
    baseUrl: "http://localhost:5500/frontend", // o el puerto donde abras tu index.html
    supportFile: false,
  },
});