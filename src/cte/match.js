function checkArray(array) {
  return array === undefined || !Array.isArray(array);
}

function eq(array, other) {
  if(checkArray(array) || checkArray(array)) return false;
  if (array.length !== other.length) return false;
  let flag = true;
  for (let i = 0; i < array.length && flag; i++)
    if (array[i] !== other[i])
      flag = false;
  return flag;
}

function match(callbackArray) {
  const resultArray = [];
  callbackArray.forEach(callback => {
    resultArray.push(callback());
  });
  return resultArray;
}

function doWith(value, callbackfn, returnfn) {
  returnfn(callbackfn(value));
}

const l = console.log;

function fizbuz(n) {
  doWith(match([_ => n % 3 === 0, _ => n % 5 === 0]), result => {
    if (eq(result, [true, false])) return "Fiz";
    else if (eq(result, [false, true])) return "Buz";
    else if (eq(result, [true, true])) return "FizBuz";
    else return n;
  }, console.log);
}

for (let i = 1; i <= 50; fizbuz(i), i++) ;