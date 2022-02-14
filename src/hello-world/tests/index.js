const {
  imageToGrayScale,
  grayScale,
  createArray,
  doubleArray,
  binarize,
  __pin,
  __unpin,
  __newArray,
  __getArray,
  Uint8Array_ID
} = require("..");

const jimp = require('jimp');

async function imageToArray(image) {
  // I'll return a result, I Promise!
  let row = [];
  try {
    // Factory Pattern
    image.rgba(false)
    for (let y = 0; y < image.bitmap.height; y++) {
      for (let x = 0; x < image.bitmap.width; x++) {
        const pix = jimp.intToRGBA(image.getPixelColor(x, y));
        row.push(pix.r, pix.g, pix.b, pix.a);
      }
    }
    return Promise.resolve(row);
  } catch (err) {
    return Promise.reject(err);
  }
}

function getImageData(imageData, i) {
  return [imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]];
}

async function editImage(image, imgData) {
  try {
    let index = 0;
    for (let y = 0; y < image.bitmap.height; y++) {
      for (let x = 0; x < image.bitmap.width; x++, index += 4) {
        const hex = jimp.rgbaToInt(...getImageData(imgData, index));
        image.setPixelColor(hex, x, y);
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
}


(async _ => {
  const image = await jimp.read("./baboon.jpeg");
  const imgArray = await imageToArray(image);
  const imgPtr = __pin(__newArray(Uint8Array_ID, [...imgArray]));
  const grayImgPtr = imageToGrayScale(imgPtr);
  const binarizeImgPtr = binarize(grayImgPtr);
  const grayImage = __getArray(binarizeImgPtr);
  await editImage(image, grayImage);
  image.write("ibobin.jpeg")
  __unpin(imgPtr);
})();


// function getRand() {
//   return Math.random() * 100 + 50;
// }
//
// function randInt() {
//   return ~~getRand();
// }

// const ptr = __pin(__newArray(Uint16Array_ID, [1, 2, 3, 4, 100, 29, 10]));
// console.log(sumArr(ptr, 6000, 5005));
// __unpin(ptr);

// const arrPtr = __pin(generatePinList(200, 600, 600));
// const array = __getArray(arrPtr);
// console.log(array);
// __unpin(arrPtr);

// const ogArray = getPointListOnLineOG([0, 0], [600, 600]);
// const arrPtr = __pin(getPointListOnLine(0, 400, 600, 600));
// const wasmArray = __getArray(arrPtr);
// console.log(wasmArray);
// __unpin(arrPtr);

// const rand = [...Array(200)].map(Math.random);
// const ogArr = [...Array(100)].map(Math.random);
// const fArrPtr = __pin(__newArray(Float32Array_ID, rand))
// for (let i = 0; i < 50; i++) {
//   const start = randInt();
//   const end = randInt();
//   console.log(isPinTooCloseOG(ogArr, start, end), isPinTooClose(fArrPtr, start, end));
// }
// __unpin(fArrPtr);