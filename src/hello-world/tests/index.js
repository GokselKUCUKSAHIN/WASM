const assert = require("assert");
const myModule = require("..");
assert.strictEqual(myModule.add(1, 2), 3);
console.log("add ok");
assert.strictEqual(myModule.mul(2, 3), 6);
console.log("mul ok");

Uint8Array