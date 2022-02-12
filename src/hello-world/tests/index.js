const {
  isPinTooClose,
  getPointListOnLine,
  __pin,
  __unpin,
  __newArray,
  __getArray,
  Uint16Array_ID,
  Float32Array_ID
} = require("..");

function getRand() {
  return Math.random() * 100 + 50;
}

function randInt() {
  return ~~getRand();
}

// const ptr = __pin(__newArray(Uint16Array_ID, [1, 2, 3, 4, 100, 29, 10]));
// console.log(sumArr(ptr, 6000, 5005));
// __unpin(ptr);

// const arrPtr = __pin(generatePinList(200, 600, 600));
// const array = __getArray(arrPtr);
// console.log(array);
// __unpin(arrPtr);

// const ogArray = getPointListOnLineOG([0, 0], [600, 600]);
const arrPtr = __pin(getPointListOnLine(0, 400, 600, 600));
const wasmArray = __getArray(arrPtr);
console.log(wasmArray);
__unpin(arrPtr);

// const rand = [...Array(200)].map(Math.random);
// const ogArr = [...Array(100)].map(Math.random);
// const fArrPtr = __pin(__newArray(Float32Array_ID, rand))
// for (let i = 0; i < 50; i++) {
//   const start = randInt();
//   const end = randInt();
//   console.log(isPinTooCloseOG(ogArr, start, end), isPinTooClose(fArrPtr, start, end));
// }
// __unpin(fArrPtr);