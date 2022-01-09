const fs = require("fs");
const loader = require("@assemblyscript/loader");

const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), {/* no imports */});
console.log(wasmModule);
module.exports = wasmModule.exports;