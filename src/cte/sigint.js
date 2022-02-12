const {sleep} = require("@jellybeanci/sleep");
const int = setInterval(_ => {
  console.log("tick")
}, 250);

let shouldIExit = false;
setTimeout(_ => {
  console.log("5 sec pass");
  shouldIExit = true;
}, 5000);

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  if (shouldIExit)
    process.exit();
});

process.on("beforeExit", _ => {
  console.log("before exit called")
});

process.on("exit", _ => {
  console.log("Exit called")
});

console.log("some code that takes some time");
sleep(6000).then(v => clearInterval(int));