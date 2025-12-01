const fs = require("fs");
const path = require("path");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src", "generated");
const destDir = path.join(root, "dist", "generated");

try {
  copyRecursive(srcDir, destDir);
  console.log("copied generated folder to dist/generated");
} catch (err) {
  console.error("failed to copy generated folder:", err);
  process.exit(1);
}
