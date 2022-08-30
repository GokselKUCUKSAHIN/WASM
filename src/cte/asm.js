function fibo(n){
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    console.log(b);
    a += b;
    [a, b] = [b, a];
  }
}

fibo(50);
/*
mov ax, 0
mov bx, 1
dongu:
  push bx
  add ax, bx
  xchg ax, bx
  loop dongu
 */