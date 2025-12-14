#!/usr/bin/env node
/**
 * Scan client/.tsx files for identifiers that exist in @linguardian/shared
 * but are not imported from it. This avoids running a full Next.js build
 * just to discover missing imports.
 */

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const repoRoot = path.resolve(__dirname, "..");
const sharedDist = path.join(repoRoot, "packages", "shared", "dist");
const clientRoot = path.join(repoRoot, "client");

function getSharedExports() {
  const exportNames = new Set();
  const dtsFiles = listFiles(sharedDist, (p) => p.endsWith(".d.ts"));

  dtsFiles.forEach((file) => {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true
    );

    source.statements.forEach((stmt) => {
      if (stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
        if ("name" in stmt && stmt.name?.text) exportNames.add(stmt.name.text);
      }

      if (ts.isExportDeclaration(stmt) && stmt.exportClause) {
        if (ts.isNamedExports(stmt.exportClause)) {
          stmt.exportClause.elements.forEach((el) =>
            exportNames.add(el.name.text)
          );
        }
      }
    });
  });

  return exportNames;
}

function listFiles(dir, predicate) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function scanClientFiles(sharedExports) {
  const tsxFiles = listFiles(clientRoot, (p) => p.endsWith(".tsx"));
  const results = [];

  tsxFiles.forEach((file) => {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true
    );

    const imported = new Set();
    const declared = new Set();
    const identifiers = new Set();

    function visit(node) {
      if (ts.isImportDeclaration(node) && node.importClause) {
        const moduleName = node.moduleSpecifier.getText(source).replace(/['"]/g, "");
        if (moduleName.startsWith("@linguardian/shared")) {
          const { name, namedBindings } = node.importClause;
          if (name) imported.add(name.text);
          if (namedBindings) {
            if (ts.isNamedImports(namedBindings)) {
              namedBindings.elements.forEach((el) => imported.add(el.name.text));
            } else if (ts.isNamespaceImport(namedBindings)) {
              imported.add(namedBindings.name.text);
            }
          }
        }
      }

      if (
        ts.isVariableDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isEnumDeclaration(node)
      ) {
        if (node.name?.kind === ts.SyntaxKind.Identifier) {
          declared.add(node.name.text);
        }
      }

      if (ts.isParameter(node) && node.name?.kind === ts.SyntaxKind.Identifier) {
        declared.add(node.name.text);
      }

      if (ts.isIdentifier(node)) {
        identifiers.add(node.text);
      }

      ts.forEachChild(node, visit);
    }

    visit(source);

    const missing = [...identifiers].filter(
      (id) =>
        sharedExports.has(id) &&
        !imported.has(id) &&
        !declared.has(id)
    );

    if (missing.length > 0) {
      results.push({ file: path.relative(repoRoot, file), missing });
    }
  });

  return results;
}

function main() {
  if (!fs.existsSync(sharedDist)) {
    console.error("Shared dist not found. Run `npm run build` in packages/shared first.");
    process.exit(1);
  }

  const sharedExports = getSharedExports();
  const findings = scanClientFiles(sharedExports);

  if (findings.length === 0) {
    console.log("No missing shared imports detected in client/.tsx files.");
    return;
  }

  console.log("Potential missing imports from @linguardian/shared:");
  findings.forEach(({ file, missing }) => {
    console.log(`- ${file}`);
    console.log(`  ${missing.join(", ")}`);
  });
}

main();
