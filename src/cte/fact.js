const fact = n => n < 2 ? 1 : n * fact(n - 1);

const solve = n => [...Array(n)].map((v, i) => 1 / fact(i + 1)).reduce((a, b) => a + b);
console.log(1 + solve(50));
console.log(Math.E);