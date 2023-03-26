# 繰り返し処理

- ポイント A. ループ処理を見やすくするコツ！

  - for 文と while 文の使い分け
  - カウンタ変数を扱う際の注意点

- ポイント B. foreach 文を使おう

  - for..in や for..of を使おう
  - コード中の変数はなるべく減らす！

- ポイント C. map、filter、forEach を使おう
  - Array のループ用メソッドの使い方

## for と while では for 文を優先して使用する

for ループはループの制御コードを一箇所にまとめることができるので、ループの内容が読みやすくなります。

### for 文の場合

for 文の場合はループ制御が `for( 初期化式; 条件式; 変化式 )` とまとまって記載されているためコードが見やすいです。

```javascript
for (let i = 0; i < 10; i++) {
  // 初期化式; 条件式; 変化式
  // 何らかの処理
}
```

### while 文の場合

一方、while 文はループ制御（初期化式、条件式、変化式）が一箇所にまとまっていないため、色んな場所を見てループ制御を理解する必要があります。

```javascript
//変数iの初期化
let i = 0;

//条件式
while (i < 10) {
  // 何らかの処理

  //変化式
  i++;
}
```

## while 文の方が適している例

特定の条件でループを終了する場合には while 文が適しています。

### Good

```javascript
// 乱数が 0.5 以上の時にループを継続
let loopCount = 0;
while (Math.random() > 0.5) {
  console.log(++loopCount);
}
```

### Bad

for 文では初期化式と変化式が省略形となります。

```javascript
// 乱数が 0.5 以上の時にループを継続
let loopCount = 0;
for (; Math.random() > 0.5; ) {
  console.log(++loopCount);
}
```

### Bad

```js
// 金利 0.05% で1万円預金した場合、預金額が2万円を超える何年後を取得
const INTERST_RATE = 0.05;
let deposit = 10000;

let years = 0;
for (; deposit < 20000; ) {
  deposit += deposit * INTERST_RATE;
  years++;
}
console.log(years);
```

### Good

```js
const INTERST_RATE = 0.05;
let deposit = 10000;

let years = 0;
while (deposit < 20000) {
  deposit += deposit * INTERST_RATE;
  years++;
}
console.log(years);
```

### POINT for 文と while 文の使い分け

- ループの回数を指定するとき → for 文を利用
- 特定の条件でループを抜けるとき → while 文を利用

### 練習問題

以下の例をみて for 文と while 文どちらが適しているか練習してみましょう。

#### 問 1

0 ~ 9 までの整数を繰り返しランダム生成して出力。
生成した乱数が 1 になったらループを抜ける。

```js
//　for 文 or while 文？
```

#### 解答

```js
let escape = true;

// escapeがtrueの間はずっと繰り返し
while (escape) {
  // 0〜9までの乱数を代入
  const num = Math.floor(Math.random() * 10);
  console.log(num);

  // 乱数が1になったら繰り返しを抜ける(特定の条件でループを抜ける処理)
  if (num === 1) escape = false;
}
```

```js
let randomNum;

// randosmNumが1になるまでずっと繰り返し
while (randomNum !== 1) {
  // 0〜9までの乱数を代入
  randomNum = Math.floor(Math.random() * 10);
  console.log(randomNum);
}
```

#### 問 2

以下の配列の中の値を全て出力する。

```js
const fruits = ["lemon", "apple", "banana"];

//　for 文 or while 文？
```

#### 解答

```js
const fruits = ["lemon", "apple", "banana"];

for (i = 0; i < fruits.length; i++) {
  //　fruits.lengthで配列に格納されている長さ分、つまり3回ループする
  console.log(fruits[i]);
}
```

## for 文内で使う変数は for 文の前で定義

for 文内で使う変数を for 文の前で定義することで、for 文内の処理が見やすくなりコードの可読性も上がります。

また配列で定義された変数を繰り返し使う場合、for 文の途中で定義をするとエラーになる場合もあります。

### Bad

```js
// ファイルの先頭
const nums = [30, 20, 10];
let sum = 0;

// 何らかしらのコード

for (let i = 0; i < 3; i++) {
  sum += nums[i];
}

console.log(sum);
```

ループごとに毎回同じ配列を定義し直しているのは冗長です。
また、配列の値が増えた場合、カウンタ変数の上限もいちいち書き換えなければならず、保守性が低くなります。

### Good

```js
const nums = [30, 20, 10];

let sum = 0;
for (let i = 0; i < nums.length; i++) {
  sum += nums[i];
}
console.log(sum);
```

### Bad

```js
// 20 ~ 49 歳の人を文字列として結合して表示
let personsName = "";

const persons = [
  { age: 40, name: "John" },
  { age: 18, name: "Mary" },
  { age: 31, name: "Jack" },
  { age: 50, name: "Bob" },
];

for (let i = 0; i < persons.length; i++) {
  const min = 20;
  const max = 49;
  if (persons[i].age >= min && persons[i].age <= max) {
    personsName += persons[i].name;
  }
}

console.log(personsName);
```

### Good

```js
const persons = [
  { age: 40, name: "John" },
  { age: 18, name: "Mary" },
  { age: 31, name: "Jack" },
  { age: 50, name: "Bob" },
];

const min = 20;
const max = 49;
let personsName = "";
for (let i = 0; i < persons.length; i++) {
  if (persons[i].age >= min && persons[i].age <= max) {
    personsName += persons[i].name;
  }
}
console.log(personsName);
```

## 同じループ内で複数のことをしない

ループの処理は複雑化せずに 1 つのループに 1 つの機能として記述する方が読み手にとって分かりやすくなります。

### Bad

```js
const randomNums = [73, 4, 85, 20];

const newArray = [...randomNums];
let sum = 0;

// randomNums を昇順に並べ替えた配列を作成し、合計値も取得する
for (let i = 0; i < newArray.length; i++) {
  sum += newArray[i];

  for (let j = 0; j < newArray.length; j++) {
    if (newArray[i] < newArray[j]) {
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
  }
}

console.log(sum);
console.log(newArray);
```

このコードの中では、「昇順に並べ替える」ことと「合計値を取得すること」の 2 つを行っています。
どの部分がどちらの目的を果たすコードなのか、ループが安全に作動しているかチェックするのに、大量のコードを確認しなければなりません。

そして実は、このコードでは `sum` の値が正しく取得できないのです。
読みにくさに加え、バグに気付きにくいコードは非常に危険です。

### Good

```js
const randomNums = [73, 4, 85, 20];

// randomNums を昇順に並べ替えた配列を生成する
const newArray = [...randomNums];
for (let i = 0; i < newArray.length; i++) {
  for (let j = 0; j < newArray.length; j++) {
    if (newArray[i] < newArray[j]) {
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
  }
}
console.log(newArray);

// randomNums の合計値を取得する
let sum = 0;
for (let i = 0; i < randomNums.length; i++) {
  sum += randomNums[i];
}
console.log(sum);
```

目的ごとにループ処理を分けることで、コード自体も見やすくなり可読性の向上に繋がります。
さらに、sort や reduce を使うことによって記述量も減らしつつ、ループで行いたいことが明確に伝わるようになります。

```js
const randomNums = [73, 4, 85, 20];

const newArray = [...randomNums].sort((a, b) => a - b);
console.log(newArray);

const sum = randomNums.reduce((acc, cur) => acc + cur);
console.log(sum);
```

### Bad

```js
const positions = [
  { x: 1, y: 20 },
  { x: 22, y: 54 },
  { x: 3, y: 4 },
];

const positionsOver25 = [];

// 原点からの距離を計算して positions に追加する。また 25以上の配列をあたらに作成する。
for (let i = 0; i < positions.length; i++) {
  const { x, y } = positions[i];
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

  positions[i].distance = distance;
  if (distance > 25) {
    positionsOver25.push({ x, y, distance });
  }
}

console.log(positions);
console.log(positionsOver25);
```

### Good

```js
const positions = [
  { x: 1, y: 20 },
  { x: 22, y: 54 },
  { x: 3, y: 4 },
];

// 原点からの距離を計算して positions に追加する。
for (let i = 0; i < positions.length; i++) {
  const { x, y } = positions[i];
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  positions[i].distance = distance;
}
console.log(positions);

// 距離が 25 以上の配列をあたらに作成する。
const positionsOver25 = [];
for (let i = 0; i < positions.length; i++) {
  const { distance } = positions[i];
  if (distance > 25) {
    positionsOver25.push({ ...positions[i] });
  }
}
console.log(positionsOver25);
```

forEach や　 filter を使った場合は以下のような記述になります。

```js
const positions = [
  { x: 1, y: 20 },
  { x: 22, y: 54 },
  { x: 3, y: 4 },
];

// 原点からの距離を計算して positions に追加する。
positions.forEach(function (item) {
  item.distance = Math.sqrt(item.x * item.x + item.y * item.y);
});
console.log(positions);

// 距離が 25 以上の配列を新たに作成する。
const positionsOver25 = positions.filter(function (item) {
  return item.distance > 25;
});
console.log(positionsOver25);
```

## for 文のカウンタ変数は書き換えない

カウンタ変数とは「繰り返し処理の回数を数える変数」のことを指します。

```js
// この場合のカウンタ変数は i のことを指す。
for (let i = 0; i < 10; i++) {}
```

for 文のカウンタ変数（ i, j, k など ）はループ処理の本文（{}で囲まれた部分）で**書き換えてはいけません**。
一般的に for 文のループ制御は `for( 初期化式; 条件式; 変化式 )` 部分のみで行われます。そのため、他の開発者は本文中でカウンタ変数が書き換えられることを想定して開発していません。

### Bad

下記の for 文のループ制御を見たとき、他の開発者はこのループは 10 回ループすると考えます。
しかし実際には 3 の倍数のときにはループはスキップされます。

```js
// ３の倍数をスキップして値をコンソールに出力するプログラム
for (let i = 1; i < 10; i++) {
  if (i % 3 === 0) {
    i = i + 1; // ３の倍数のときに、 i に +1 を足し合わせる。
  }

  console.log(i);
}
// > 1
// > 2
// > 4
// > 5
// > 7
// > 8
// > 10
```

また、このように i の値を for 文の本文内で書き換えると、i の値が if 文の前後で変わる可能性があります。そのため、i を使った記述の挙動が追いづらくなってしまいます。

```js
// i の値が追いづらい。このままコードを追加していくと、メンテナンスがしづらくなるのは明らか。
for (let i = 1; i < 10; i++) {
  // i の時に行いたい処理はここに記述を追加する必要がある。

  if (i % 3 === 0) {
    i = i + 1; // ３の倍数のときに、 i に +1 を足し合わせる。
  }

  // i + 1　の時に行いたい処理はここに記述を追加する必要がある。

  console.log(i);
}
```

### Good

カウンタ変数を変更せずにループ制御を変更するためには continue、または break を使いましょう。

#### coutinue 使用

continue が呼ばれると変化式の実行（i++）後に改めて for 文の本文の先頭から処理が実行されます。

```js
for (let i = 1; i < 10; i++) {
  if (i % 3 === 0) {
    continue; // i++が実行された後、for文の先頭から処理が継続（continue)される
  }

  console.log(i);
}

//出力されるコード
// > 1
// > 2
// > 4
// > 5
// > 7
// > 8
```

#### break 使用

break の場合には break が呼ばれたタイミングでループ処理が終了します。

```js
for (let i = 1; i < 10; i++) {
  if (i % 3 === 0) {
    break; // for文を抜ける。
  }

  console.log(i);
}

console.log("end");
// > 1
// > 2
// > end
```

終了条件を動的に変更したい場合は、次で紹介する while 文を使用しましょう。

### 練習問題

それでは continue, break を使用してカウンタ変数を変更せずにループ制御を変更してみましょう。

```js
// 問1. 2の倍数の場合、処理を行わずスキップする
for (let i = 0; i < 13; i++) {
  // ここに処理を書く
}

//出力結果
// > 1
// > 3
// > 5
// > 7
// > 9
// > 11

// 問2. 5以上、かつ4の倍数を1つ出力したらループを終了させる
for (let i = 1; i < 15; i++) {
  // ここに処理を書く
}

//出力結果
// > 1
// > 2
// > 3
// > 4
// > 5
// > 6
// > 7
// > 8
```

#### 解答

```js
// 問1
for (let i = 1; i < 13; i++) {
  if (i % 2 === 0) {
    continue; // i++が実行された後、for文の先頭から処理が継続（continue）される
  }
  console.log(i);
}

// 問2
for (let i = 1; i < 15; i++) {
  console.log(i);
  if (i >= 5 && i % 4 === 0) {
    break;
  }
}
```

## より丁寧なカウンタ変数名を使用する

カウンタ変数名も慎重に選ぶことにより、どのような変数なのかを明確にできます。単純なループ以外は、意味のある変数名を命名することで、より理解しやすいコードになるでしょう。ネストを利用した for ループ文を例に見てみましょう。

### Bad

```js
const pages = ["home", "about", "contact", "blog", "faq"];

for (let i = 0; i < pages.length; i++) {
  console.log(pages[i]);
}
```

### Good

```js
const pages = ["home", "about", "contact", "blog", "faq"];
for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
  console.log(pages[pageIdx]);
}
```

### Bad

```js
const cards = [
  { suit: "Spade", numbers: ["A", "2", "4"] },
  { suit: "Heart", numbers: ["5", "7"] },
  { suit: "Diamond", numbers: ["K"] },
  { suit: "Club", numbers: ["3", "A"] },
];

for (let i = 0; i < cards.length; i++) {
  const { suit, numbers } = cards[i];

  for (let k = 0; k < numbers.length; k++) {
    // 「${マーク}:${ナンバー}」
    console.log(suit + ":" + numbers[k]);
  }
}
```

### Good

カウンタ変数名を丁寧につけることで、何を示しているかが一目でわかるようになる。

```js
const cards = [
  { suit: "Spade", numbers: ["A", "2", "4"] },
  { suit: "Heart", numbers: ["5", "7"] },
  { suit: "Diamond", numbers: ["K"] },
  { suit: "Club", numbers: ["3", "A"] },
];

for (let cardIdx = 0; cardIdx < cards.length; cardIdx++) {
  const { suit, numbers } = cards[cardIdx];

  for (let numIdx = 0; numIdx < numbers.length; numIdx++) {
    // 「${マーク}:${ナンバー}」
    console.log(suit + ":" + numbers[numIdx]);
  }
}
```

## foreach 文を使おう

カウンタ変数名が不要な場合には foreach 文を使いましょう。
プログラム言語には配列の各要素を取り出す foreach 文（JavaScript の場合には`for..of`や`for..in`）が準備されているのが一般的です。

- `for (variable of iterable)`
  - 反復可能な配列状のオブジェクトに使用できます。（配列, 文字列, Map など）
- `for (variable in object)`
  - オブジェクトなど列挙可能なプロパティに繰り返し処理を行う
  - 繰り返し処理の際に順序の一貫性が保証されていないことに注意。（特に配列やオブジェクトの key に数字を使用している場合は要注意）

### Bad

```js
const cards = [
  { suit: "Spade", numbers: ["A", "2", "4"] },
  { suit: "Heart", numbers: ["5", "7"] },
  { suit: "Diamond", numbers: ["K"] },
  { suit: "Club", numbers: ["3", "A"] },
];

for (let cardIdx = 0; cardIdx < cards.length; cardIdx++) {
  const { suit, numbers } = cards[cardIdx];

  for (let numIdx = 0; numIdx < numbers.length; numIdx++) {
    // 「${マーク}:${ナンバー}」
    console.log(suit + ":" + numbers[numIdx]);
  }
}
```

### Good

```js
const cards = [
  { suit: "Spade", numbers: ["A", "2", "4"] },
  { suit: "Heart", numbers: ["5", "7"] },
  { suit: "Diamond", numbers: ["K"] },
  { suit: "Club", numbers: ["3", "A"] },
];

for (const { suit, numbers } of cards) {
  for (const num of numbers) {
    // 「${マーク}:${ナンバー}」
    console.log(suit + ":" + num);
  }
}
```

`forEach` を使ってもシンプルに記述できます。
※ `forEach` の詳細についてはのちのレクチャーで説明します。

```js
prefectures.forEach((prefecture) => {
  const { name, cities } = prefecture;

  cities.forEach((city) => {
    console.log(name + city);
  });
});
```

### 練習問題

次の for 文を for..of を使って書き直してみましょう。

### Bad

```js
const pickedCountries = ["Japan", "Tanzania", "Germany", "France"];
const continents = {
  asia: ["Japan", "China", "Korea", "India"],
  europe: ["United Kingdom", "France", "Germany", "Italy"],
  america: ["United States", "Canada"],
  africa: ["Egypt", "South Africa", "Kenya", "Tanzania"],
};
const continentKeys = Object.keys(continents);

for (let pickedIdx = 0; pickedIdx < pickedCountries.length; pickedIdx++) {
  const pickedCountry = pickedCountries[pickedIdx];

  for (
    let continentIdx = 0;
    continentIdx < continentKeys.length;
    continentIdx++
  ) {
    const continent = continentKeys[continentIdx];
    const countriesInContinent = continents[continent];

    for (
      let countryIdx = 0;
      countryIdx < countriesInContinent.length;
      countryIdx++
    ) {
      if (countriesInContinent[countryIdx] === pickedCountry) {
        console.log(pickedCountry + " is in " + continent);
      }
    }
  }
}
```

### Good

```js
const pickedCountries = ["Japan", "Tanzania", "Germany", "France"];
const continents = {
  asia: ["Japan", "China", "Korea", "India"],
  europe: ["United Kingdom", "France", "Germany", "Italy"],
  america: ["United States", "Canada"],
  africa: ["Egypt", "South Africa", "Kenya", "Tanzania"],
};

for (const country of pickedCountries) {
  for (const continent in continents) {
    if (continents[continent].includes(country)) {
      console.log(country + " is in " + continent);
    }
  }
}
```

`forEach` を使ってもシンプルに記述できます。
※ `forEach` の詳細についてはのちのレクチャーで説明します。

```js
pickedCountries.forEach((pickedCountry) => {
  for (let continent in continents) {
    const countriesInContinent = continents[continent];

    countriesInContinent.forEach((country) => {
      if (country === pickedCountry) {
        console.log(pickedCountry + " is in " + continent);
      }
    });
  }
});
```

## 【発展】高階関数(map, filter, forEach)を使おう

高階関数を使うことで無駄な変数（カウンタ変数、新しい配列の初期化など）が減り、処理が分離されます。ここでは forEach、map、filter の３つを紹介します。

### forEach とは

`forEach` は、配列の要素を順番に取り出してコールバック関数に渡す高階関数です。
Array.prototype.forEach メソッドを使用すると処理を完結に記述することが出来ます。

#### 使い方

```js
array.forEach(function (element, index, array) {
  // ...
});
```

コールバック関数は、以下の引数とともに呼び出されます。

- 第一引数: 現在処理されている配列の要素
- 第二引数: 現在処理されている配列のインデックス
- 第三引数: 処理対象の配列

```js
const fruits = ["apple", "tomato", "banana"];

fruits.forEach(function (fruit, index, array) {
  console.log(index, fruit);
});

// 出力される値
// 0 'apple'
// 1 'tomato'
// 2 'banana'
```

### for 文と forEach の比較

#### for 文

```js
const fruits = ["apple", "tomato", "banana"];

for (let i = 0; i < fruits.length; i++) {
  // ループの終了条件やカウンタなどの設定が必要
  console.log(fruits[i]);
}

//出力される値
// > apple
// > tomato
// > banana
```

ループの終了条件やカウンタなどの設定が必要になってくるのでコードが複雑になりがちです。
また配列の値に対して何かの処理を行うには、「ループのカウンターを指定して配列から値を取り出す」という工程を経なければなりません。

#### forEach 文

```js
const fruits = ["apple", "tomato", "banana"];

fruits.forEach(function (fruit) {
  // 初期設定不要で効率よく記述ができる
  console.log(fruit);
});

//出力される値
// > apple
// > tomato
// > banana
```

どちらも同じ実行結果ですが `forEach` 文を使用することで、コールバック関数に実行したい処理を記述するだけで済みます。
無駄な記述を減らしミスを軽減したりコードの管理をしやすくすることができます。

### map とは

map は、コールバック関数を配列の各要素に対して呼び出し、その結果を格納した新しい配列を生成する高階関数です。

#### map 使い方

```js
array.map(function (element, index, array) {
  // ...
});
```

コールバック関数は、以下の引数とともに呼び出されます。

- 第一引数: 現在処理されている配列の要素
- 第二引数: 現在処理されている配列のインデックス
- 第三引数: 処理対象の配列

```js
const fruits = ["apple", "tomato", "banana"];
const fruitsJuice = fruits.map(function (data, index, array) {
  // 戻り値として加工する内容を記述する
  return data + "juice";
});

console.log(fruitsJuice);
// 出力される値
// > ['applejuice', 'tomatojuice', 'bananajuice']

// 新しい配列を新たに生成するため、元の配列には影響を与えません。
console.log(fruits);
// > ['apple', 'tomato', 'banana']
```

### map と for 文の比較

#### for 文

```js
const fruits = ["apple", "melon", "banana"];

let fruitsJuice = [];
for (let i = 0; i < fruits.length; i++) {
  fruitsJuice[i] = fruits[i] + "juice";
}

console.log(fruitsJuice);

//出力される値
// > ['applejuise', 'melonjuise', 'bananajuise']
```

やはり for 文はループの終了条件やカウンタなどの設定が必要になります。
また、処理結果を格納している reult に初期値として配列を格納する必要もあり、無駄な変数の初期化等を行う必要があります。

#### map

```js
const fruits = ["apple", "melon", "banana"];

const fruitsJuice = fruits.map(function (data) {
  return data + "juise";
  //戻り値として加工する内容を記述する
});

console.log(fruitsJuice);

//出力される値
// > ['applejuise', 'melonjuise', 'bananajuise']
```

ループの終了条件やカウンタなどの設定が必要なく、配列を変数として定義する必要もありません。

### filter とは

`filter` は、指定されたコールバック関数で個々の要素を判定し、条件に合致した要素だけを取り出した新しい配列を生成する高階関数です。

#### filter の使い方

```js
array.filter(function (element, index, array) {
  // ...
});
```

コールバック関数は、以下の引数とともに呼び出されます。

- 第一引数: 現在処理されている配列の要素
- 第二引数: 現在処理されている配列のインデックス
- 第三引数: 処理対象の配列

```js
const nations = [
  { name: "Japan", region: "Asia" },
  { name: "Italy", region: "Europe" },
  { name: "China", region: "Asia" },
  { name: "France", region: "Europe" },
];

const result = nations.filter(function (nation, index, array) {
  return nation.region === "Asia";
});

console.log(result);
// 出力される値
// > [{name: 'Japan', region: 'Asia'},{name: 'China', region: 'Asia'}]

// 新しい配列を新たに生成するため、元の配列には影響を与えません。
console.log(nations);
```

### filter と for 文の比較

#### for 文

```js
const nations = [
  { name: "Japan", region: "Asia" },
  { name: "Italy", region: "Europe" },
  { name: "China", region: "Asia" },
  { name: "France", region: "Europe" },
];

const resultNations = [];

for (let i = 0; i < nations.length; i++) {
  if (nations[i].region === "Asia") {
    resultNations.push(nations[i]);
  }
}
console.log(resultNations);

// 出力される値
// > [{name: 'Japan', region: 'Asia'},{name: 'China', region: 'Asia'}]
```

こちらも同様に、ループの終了条件やカウンタなどの設定が必要です。
また for 文のなかで if 分で条件判定して、空の配列に格納する必要があります。
フィルターをかけるだけですが、コード量が増えて全体が複雑に見えてしまいます。

#### filter

```js
const nations = [
  { name: "Japan", region: "Asia" },
  { name: "Italy", region: "Europe" },
  { name: "China", region: "Asia" },
  { name: "France", region: "Europe" },
];

const resultNations = nations.filter(function (nation) {
  return nation.region === "Asia";
});

console.log(resultNations);

// 出力される値
// > [{name: 'Japan', region: 'Asia'},{name: 'China', region: 'Asia'}]
```

filter を使用することで、コード量が簡素化されます。
また、 `filter` というメソッド名なので、一目見ただけで読み手はが「フィルターされている」と理解することができます。

### 練習問題

では for 文を `forEach`, `map`, `filter`に書き直す練習をしてみましょう。

#### forEach に書き直す

```js
// 問1. forEach に書き直す
const continents = ["Africa", "Australia", "Antractica"];

for (let i = 0; i < continents.length; i++) {
  console.log(continents[i]);
}

// 出力される値
// > Africa
// > Australia
// > Antractica

// 問2. map に書き直す
const oceans = ["Pacfic", "Atlantic", "Indian"];

const result = [];
for (let i = 0; i < oceans.length; i++) {
  result[i] = oceans[i] + "-ocean";
}
console.log(result);
// 出力される値
// > ['Pacfic-ocean', 'Atlantic-ocean', 'Indian-ocean']

// 問3. filter に書き直す
const sports = [
  { name: "baseBall", category: "ball-game" },
  { name: "Judo", category: "martial-arts" },
  { name: "wrestling", category: "fighting-sports" },
];

const filteredSports = [];

for (let i = 0; i < sports.length; i++) {
  if (sports[i].category === "fighting-sports") {
    filteredSports.push(sports[i]);
  }
}
console.log(filteredSports);
// 出力される値
// > {name: 'wrestling', category: 'fighting-sports'}
```

##### 解答

```js
// 問1. forEach に書き直す
const continents = ["Africa", "Australia", "Antractica"];

continents.forEach(function (continent) {
  console.log(continent);
});

// 問2. map に書き直す
const oceans = ["Pacfic", "Atlantic", "Indian"];

const resultOceans = oceans.map(function (ocean) {
  return ocean + "-ocean";
});

console.log(resultOceans);

// 問3. filter に書き直す
const sports = [
  { name: "baseBall", category: "ball-game" },
  { name: "Judo", category: "martial-arts" },
  { name: "wrestling", category: "fighting-sports" },
];

const filteredSports = sports.filter(function (sport) {
  return sport.category === "fighting-sports";
});

console.log(filteredSports);
```
