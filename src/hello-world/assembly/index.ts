// The entry file of your WebAssembly module.
// declare function log(arg0: i32): void;

declare function formatLog(arg0: i32): void;

export {mul} from "./external"

export function addLog(a: i32, b: i32): i32 {
  const sum: i32 = a + b;
  formatLog(sum);
  return sum;
}

export function add(a: i32, b: i32): i32 {
  return a + b;
}
