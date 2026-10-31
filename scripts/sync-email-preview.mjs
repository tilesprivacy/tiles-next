#!/usr/bin/env node

import { readFileSync, writeFileSync, watch } from "node:fs";
import ts from "typescript";

const templateFile = new URL("../emails/template.ts", import.meta.url);
const fundingFile = new URL("../emails/mozilla-funding-newsletter.ts", import.meta.url);
const previewFile = new URL("../email-preview.html", import.meta.url);

function moduleUrl(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}

async function syncPreview() {
  // Load the same renderer as the preview route; no second HTML source to maintain.
  const templateUrl = moduleUrl(readFileSync(templateFile, "utf8"));
  const fundingSource = readFileSync(fundingFile, "utf8").replace(
    'from "./template"',
    `from "${templateUrl}"`,
  );
  const { buildFundingNewsletter } = await import(moduleUrl(fundingSource));
  writeFileSync(previewFile, `${buildFundingNewsletter().trim()}\n`);
  console.log("Updated email-preview.html from the funding newsletter.");
}

try {
  await syncPreview();
  if (process.argv.includes("--watch") || process.argv.includes("-w")) {
    let pending;
    for (const file of [templateFile, fundingFile]) {
      watch(file, () => {
        clearTimeout(pending);
        pending = setTimeout(() => syncPreview().catch(console.error), 100);
      });
    }
    console.log("Watching the shared template and funding newsletter.");
  }
} catch (error) {
  console.error("Could not generate the funding newsletter preview:", error);
  process.exitCode = 1;
}
