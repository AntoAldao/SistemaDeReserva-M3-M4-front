// Build del frontend estático: verifica que index.html no referencie archivos
// inexistentes y copia lo publicable a dist/ (sin tests).
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "frontend");
const OUT = path.join(__dirname, "..", "dist");

const html = fs.readFileSync(path.join(SRC, "index.html"), "utf8");
const refs = [...html.matchAll(/(?:src|href)="([^"#?]+)"/g)]
  .map((m) => m[1])
  .filter((r) => !/^(https?:)?\/\//.test(r));

const faltantes = refs.filter((r) => !fs.existsSync(path.join(SRC, r)));
if (faltantes.length > 0) {
  console.error("Build fallido. index.html referencia archivos inexistentes:", faltantes);
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, {
  recursive: true,
  filter: (p) => !p.includes(`${path.sep}tests`),
});
console.log(`Build OK: ${refs.length} referencias verificadas, salida en dist/`);
