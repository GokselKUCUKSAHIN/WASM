const lib = require("./slow-loading-lib")
lib.ready.then(_=>{
  console.log("ready!!!");
})