
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const extensions = [".png"];
const ignoredDirs = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
]);

async function convertDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        await convertDirectory(fullPath);
      }
      continue;
    }

    if (!extensions.includes(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    const outputPath =
      fullPath.slice(0, -path.extname(fullPath).length) + ".webp";

    try {
      await sharp(fullPath)
        .webp({ quality: 82 })
        .toFile(outputPath);

      console.log(`Converti : ${fullPath} → ${outputPath}`);
    } catch (error) {
      console.error(`Erreur : ${fullPath}`, error.message);
    }
  }
}

await convertDirectory(".");
console.log("Conversion terminée.");
