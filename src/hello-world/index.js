const fs = require("fs");
const loader = require("@assemblyscript/loader");
const width = 1280;
const height = 1280;
const arraySize = (width * height * 4) >>> 0;
const nPages = ((arraySize + 0xffff) & ~0xffff) >>> 16;
const memory = new WebAssembly.Memory({initial: nPages});
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"),
  {
    env: {memory}
  });
module.exports = wasmModule.exports;
