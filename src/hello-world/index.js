const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = {
  index: {
    log: console.log,
    formatLog: i32 => console.log(`result: ${i32}`)
  },
  external: {
    printer: i32 => console.log("Printer function:", i32)
  }
};
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports);
module.exports = wasmModule.exports;
