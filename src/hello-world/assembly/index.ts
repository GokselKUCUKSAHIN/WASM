// The entry file of your WebAssembly module.

export const Uint16Array_ID = idof<Uint16Array>();
export const Uint8Array_ID = idof<Uint8Array>();
export const Float32Array_ID = idof<Float32Array>();

const HALF: f32 = 0.5;
const QUARTER: f32 = 0.25;

const PI: f32 = <f32>Mathf.PI;
const TWO_PI: f32 = PI * 2;
const HALF_PI: f32 = PI * HALF;


export function abs(num: i16): i16 {
  return num >= 0 ? num : -num;
}

export function generatePinList(length: i16, width: i16, height: i16): Int16Array {
  const centerX: f32 = width * HALF;
  const centerY: f32 = height * HALF;
  const radius: f32 = centerX;
  const angleUnit: f32 = TWO_PI / length;
  const pins = new Int16Array(2 * length);
  for (let i: i16 = 0; i < length; i++) {
    const angle: f32 = angleUnit * <f32>i - HALF_PI;
    let x = Mathf.round(centerX + radius * Mathf.cos(angle));
    let y = Mathf.round(centerY + radius * Mathf.sin(angle));
    if (x === width) x--;
    if (y === height) y--;
    unchecked(pins[2 * i] = <i16>x)
    unchecked(pins[2 * i + 1] = <i16>y)
  }
  return pins;
}

export function isDotOnLine(dotX: f32, dotY: f32, startX: f32, startY: f32, endX: f32, endY: f32): bool {
  if (endX - startX === 0) return dotX === endX;
  const slope: f32 = (endY - startY) / (endX - startX);
  const intercept: f32 = startY - slope * startX;
  const blockTopY: f32 = dotY + 0.5;
  const blockBottomY: f32 = dotY - 0.5;
  const blockLeftY: f32 = slope * (dotX - 0.5) + intercept;
  const blockRightY: f32 = slope * (dotX + 0.5) + intercept;
  if (Mathf.abs(slope) <= 1) {
    return (blockLeftY >= blockBottomY && blockLeftY <= blockTopY) ||
        (blockRightY >= blockBottomY && blockRightY <= blockTopY);
  } else if (slope > 0) {
    return !(blockLeftY > blockTopY || blockRightY < blockBottomY);
  } else {
    return !(blockRightY > blockTopY || blockLeftY < blockBottomY);
  }
}

export function getPointListOnLineInt16(startX: i16, startY: i16, endX: i16, endY: i16, limit: i32 = 1000): Int16Array {
  const pointList = new Int16Array(limit * 2 + 2);
  const movementX: i16 = endX > startX ? 1 : -1;
  const movementY: i16 = endY > startY ? 1 : -1;
  let currentX: i16 = startX;
  let currentY: i16 = startY;
  for (let i: i16 = 0; (currentX !== endX || currentY !== endY) && i < limit; i++) {
    unchecked(pointList[2 * i] = currentX);     // X
    unchecked(pointList[2 * i + 1] = currentY); // Y
    if (isDotOnLine(currentX + movementX, currentY, startX, startY, endX, endY)) {
      currentX += movementX;
    } else {
      currentY += movementY;
    }
  }
  unchecked(pointList[2 * limit] = endX);       // X
  unchecked(pointList[2 * limit + 1] = endY);   // Y
  return pointList;
}

function Uint8ArraySum(array: Uint8Array): i32 {
  let sum: i32 = 0;
  for (let i: i16 = 0; i < array.length; i++) {
    sum += unchecked(array[i]);
  }
  return sum;
}

function calcIndex(width: i16, x: i16, y: i16): i16 {
  return y * width + x;
}

export function getImageData(imgData: Uint8Array, imgWidth: i16, x: i16, y: i16): u8 {
  const index = calcIndex(imgWidth, x, y);
  return unchecked(imgData[index]);
}

export function setImageData(imgData: Uint8Array, imgWidth: i16, x: i16, y: i16, value: u8): void {
  const index = calcIndex(imgWidth, x, y);
  unchecked(imgData[index] = value);
}

export function getLineScore(imgData: Uint8Array, imgWidth: i16, startX: i16, startY: i16, endX: i16, endY: i16, limit: i32): u8 {
  const dotList: Int16Array = getPointListOnLineInt16(startX, startY, endX, endY, limit);
  const dotListLen = dotList.length;
  const dotScoreList = new Uint8Array(dotListLen);
  for (let i: i16 = 0; i < dotListLen; i++) {
    const dotX: i16 = unchecked(dotList[2 * i]);
    const dotY: i16 = unchecked(dotList[2 * i + 1]);
    const shade: u8 = getImageData(imgData, imgWidth, dotX, dotY);
    unchecked(dotScoreList[i] = shade);
  }
  const sum = Uint8ArraySum(dotScoreList);
  return <u8>(sum / dotListLen);
}

export function reduceImageData(imgData: Uint8Array, imgWidth: i16, startX: i16, startY: i16, endX: i16, endY: i16, limit: i32): void {
  const dotList: Int16Array = getPointListOnLineInt16(startX, startY, endX, endY, limit);
  const dotListLen = dotList.length;
  for (let i: i16 = 0; i < dotListLen; i++) {
    const dotX: i16 = unchecked(dotList[2 * i]);
    const dotY: i16 = unchecked(dotList[2 * i + 1]);
    let shade: u16 = 50 + getImageData(imgData, imgWidth, dotX, dotY);
    if (shade > 255) shade = 255;
    setImageData(imgData, imgWidth, dotX, dotY, <u8>shade);
  }
}

export function isLineDrawn(lineList: Int16Array, startIndex: i16, endPinIndex: i16): bool {
  const len = <i16>(lineList.length / 2);
  for (let i = 0; i < len; i++) {
    const lineX = unchecked(lineList[2 * i]);
    const lineY = unchecked(lineList[2 * i + 1]);
    if ((startIndex === lineX && endPinIndex === lineY) ||
        (startIndex === lineY && endPinIndex === lineX)) {
      return true;
    }
  }
  return false;
}

export function isPinTooClose(pinList: Int16Array, startIndex: i16, endIndex: i16): bool {
  let pinDist = <i16>Mathf.abs(endIndex - startIndex);
  const len = <i16>pinList.length;
  pinDist = pinDist > len / 4
      ? len / 2 - pinDist
      : pinDist;
  return pinDist < 25;
}

export function imgToGrayScale(imgData: Uint8Array, imgWidth: i16): Uint8Array {
  // grayscale = 0.299R + 0.587G + 0.114B.
  const len = <i16>(imgData.length / 4);
  const grayImage = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const R: u8 = unchecked(imgData[4 * i]);
    const G: u8 = unchecked(imgData[4 * i + 1]);
    const B: u8 = unchecked(imgData[4 * i + 2]);
    const gray: u8 = <u8>(0.299 * R + 0.587 * G + 0.114 * B);
    unchecked(grayImage[i] = gray);
  }
  return grayImage;
}

/*
function isLineDrawn(lineList, startPinIndex, endPinIndex) {
  const lineFound = lineList.find(line => {
    if (
      (startPinIndex === line[0] && endPinIndex === line[1]) ||
      (startPinIndex === line[1] && endPinIndex === line[0])
    ) {
      return true;
    }
    return false;
  });
  return Boolean(lineFound);
}
*/