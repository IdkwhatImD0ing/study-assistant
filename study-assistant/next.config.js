const path = require("path");

module.exports = {
  webpack: (config) => {
    // Configure aliases to point to the correct PDF.js files
    config.resolve.alias["pdfjs-dist/build/pdf"] = "pdfjs";
    config.resolve.alias["pdfjs-dist/build/pdf.worker"] = path.resolve(
      __dirname,
      "pdfjs/pdf.worker.js"
    );

    return config;
  },
};
