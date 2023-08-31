// Hello World
console.log("Hello World!");

// 文字列
console.log("It's me!");
// \' で特殊文字を表示する
console.log('It\'s me!');

// 定数
const price;

// 変数
let price = 500;

// price = price + 100
price += 100;

// price = price * 2
price *= 2;

// price = price + 1
price++;
// price = price - 1
price--;

// 基本的な型
console.log(typeof 'Hi!'); // string
console.log(typeof 5); // boolean
console.log(typeof true); // boolean
console.log(typeof undefined); // underfined
console.log(typeof null); // object

// 演算子
// 文字列があるが、数値型として扱われる
console.log('5' * 3); // 15
console.log('5' - 3); // 2
console.log('15' / 3); // 5
// +は文字列連携で扱われる
console.log('5' + 3); // 53

// 比較演算子
console.log(Boolean(0)); // false
console.log(Boolean('Hello')); // true

// IF文
const score = 70;

if (score >= 80) {
  console.log('great!');
} else if (score >= 60) {
  console.log('Good!!');
} else {
  console.log('OK...');
}

// For文
for (let i = 1; i <= 10; i++) {
    console.log(`Hi ${i}`);
}

// While文
let hp = 100;

while (hp >= 0) {
  console.log(`${hp} HP Left!`);
  hp -= 15;
}

// Switch文
const signal = 'red';

switch (signal) {
  case 'red' :
    console.log('Stop!');
    break;
  // 複数の条件を加える
  // この場合は blue もしくは redの場合はという意味になる
  case 'blue' :
  case 'green':
    console.log('Go!!');
    break;
  default:
    console.log('Wrong Signal');
    break;
}

// 関数
'use strict';

function showAd () {
  console.log('-------');
  console.log('---AD--');
  console.log('-------');
}

console.log('Tom is Great');
showAd(); //  関数呼び出し

// アロー関数
const sum = (a, b, c) => {
    return a + b + c;
};

// スコープ
function f () {
    // 定数や変数がブロック内で宣言された場合
    // その定数や変数はこのブロックの中でだけ有効というルールがある
    const x = 1;
    console.log(x);
}
f();
console.log(x); // x is not defined
