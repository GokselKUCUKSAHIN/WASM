declare function printer(arg0: i32): void;

export function mul(a: i32, b: i32): i32 {
  const prod: i32 = a * b;
  printer(prod);
  return prod;
}