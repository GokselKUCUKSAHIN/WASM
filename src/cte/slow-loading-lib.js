const {sleep} = require("@jellybeanci/sleep");
const readyPromise = async function () {
  await sleep(2000);
  return Promise.resolve();
}
module.exports.ready = readyPromise();