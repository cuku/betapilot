#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./cli/index.js");
async function main() {
    try {
        const args = process.argv.slice(2);
        await (0, index_js_1.runCLI)(args);
    }
    catch (error) {
        console.error('Fatal error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map