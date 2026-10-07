import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { openApiSpec } from "./openapi.js";

const outPath = resolve(process.cwd(), "openapi.json");

writeFileSync(outPath, `${JSON.stringify(openApiSpec, null, 2)}\n`);

console.log(`OpenAPI spec written to ${outPath}`);
