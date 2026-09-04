import fs from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const ignored = new Set([".git", "node_modules", "target", "dist", "out", ".cache"]);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (ignored.has(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : /\.md$/.test(file) ? [file] : [];
  });
}
const errors = [];
const files = walk(root);
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, "").split("#")[0];
    if (!target || /^(https?:|mailto:)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), decodeURIComponent(target)))) {
      errors.push(path.relative(root, file) + ": missing " + target);
    }
  }
}
const phases = fs.readdirSync(path.join(root, "plans", "phases")).filter(name => /^\d\d-.*\.md$/.test(name)).sort();
if (phases.length !== 13 || phases.some((name, index) => Number(name.slice(0, 2)) !== index + 1)) errors.push("Expected consecutive phases 01 through 13.");
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log("Checked " + files.length + " Markdown files and 13 phase numbers.");
