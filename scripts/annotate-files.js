// File: annotate-files.js
const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
// Folders to ignore
const ignoreDirs = ["node_modules", ".git", ".next", "dist", "public"];
// Supported file extensions
const supportedExtensions = [".ts", ".tsx", ".js", ".jsx", ".css"];

function annotateFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        annotateFiles(filePath);
      }
    } else if (supportedExtensions.includes(path.extname(file))) {
      const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");
      const content = fs.readFileSync(filePath, "utf8");

      const header = ` ${relativePath}\n`;

      // Prevent duplicate headers if you run the script twice
      if (!content.startsWith("")) {
        const newContent = header + content;
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(`✅ Annotated: ${relativePath}`);
      } else {
        console.log(`--- Skipped: ${relativePath} (Already annotated)`);
      }
    }
  });
}

console.log("🚀 Starting file annotation...");
annotateFiles(rootDir);
console.log("✨ All files processed.");
