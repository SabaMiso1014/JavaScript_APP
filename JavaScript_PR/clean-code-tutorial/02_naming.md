# 命名規則

## なぜ変数名が大切なのか

例えば以下のコードを見てみましょう。

```js
const a = 300 / 60;
```

このコードでは変数名が抽象的過ぎて、何をしているのか全く意図が伝わってきません。

```js
const minutes = 300;
const hours = minutes / 60;
```

<br/>

記述内容は`300 / 60`で全く同じですが、変数名から「分を時間に計算する」という意図が読み取れます。このように名前に情報を詰め込むことで、**他者や未来の自分へのメッセージ**となります。

## ケーススタディー

### Bad

何を計算するための関数か分からない。

```js
function calc(number) {
  return number / 60;
}
```

### Good

分を時間に変換する関数であることが分かる。

```js
function convertMinsToHours(minutes) {
  return minutes / 60;
}
```

### Bad

```js
class Calculation {
  divide(minutes) {
    return minutes / 60;
  }
  multiply(minutes) {
    return minutes * 60;
  }
}
```

### Good

```js
class TimeCalculation {
  getHours(minutes) {
    return minutes / 60;
  }
  getSeconds(minutes) {
    return minutes * 60;
  }
}
```

## 良い変数名とは

1. 変数が保持するものを正確に説明する
2. あいまいでない
3. 短すぎず、長すぎない変数

では具体的にどのようなルールに元づいて変数名を決定していけばよいでしょうか。
本セクションではこのように変数名を命名する際に意図が伝わりやすくなる普遍的なルールについて紹介します。

## 識別子とケース

識別子（変数名、関数名、クラス名などの識別するためのもの。）のケースの種類について学びましょう。
識別子に名前を付けることを命名と言います。
識別子の命名規則については主に４種類の方法に分類されます。

- ケバブケース
- スネークケース
- パスカルケース
- キャメルケース



### ケバブケース

単語と単語の間をハイフンでつなぐ命名規則。

```text
kebab-case
class-name
data-attribute
```

#### 使用ケース

HTML 属性（id、class、name...）、URL パス
※ 変数名には使用しないことが多い。

```html:HTML属性
<input name="user-name" />
<section class="content-width">...</section>
```

```text
https://example.com/sales-profit
https://example.com/post-132
```

### スネークケース

単語と単語の間をアンダースコアでつなぐ命名規則。

**使用ケース**
(ローカル)変数名
関数名
定数
URL パス
DB のテーブル名、カラム名など
※ クラスには使用しない

```text
snake_case
user_id
request_operation_log()
var_dump()
merge_ordered()
```

#### アッパースネークケース（コンスタントケース）

大文字をアンダーバーでつなぐ命名規則。

#### 使用ケース

主に定数に使用する。

```text
USER_NAME
FIREBASE_API_KEY
```

### パスカルケース

単語の先頭を大文字にする命名規則。
アッパーキャメルケースともいう。

#### 使用ケース

**クラスやインターフェースに対して使用します。**

```text
PascalCase
Users
MyClass
```

### キャメルケース

先頭の単語は小文字、後に続く単語の先頭を大文字にする命名規則。
ローワーキャメルケースともいう。

#### 使用ケース

変数やプロパティ名に使用することが多い。

```text
camelCase
bookTitle
getName
```

### 練習問題

以下を正しい命名規則で書き直してみましょう。

```js
// クラス属性をケバブケースに直す
<h1 class="page-title">...</h1>
<ul class="user-name-list">...</ul>

// スネークケースに直す
const header_Height = 80;
const User_Message = "hello world";

// パスカルケースに直す
class UserData {
  constructor() {
    this.id = "12345";
  }
}

class GamePlayer {
  constructor() {
    this.score = 0;
  }
}

// キャメルケースに直す
const bookItem = {
  id: '1',
  title: 'Hello World'
};

function ADD_ACTIVE_CLASS() {...};
```

#### 解答

```js
// クラス名をケバブケースに直す
<h1 class="page-title">...</h1>
<ul class="user-name-list">...</ul>

// スネークケースに直す
const header_height = 80;
const user_message = "hello world";

// パスカルケースに直す
class UserData {
  constructor() {
    this.id = "12345";
  }
}

class GamePlayer {
  constructor() {
    this.score = 0;
  }
}

// キャメルケースに直す
const bookItem = {
  id: '1',
  title: 'Hello World'
};

function addActiveClass() {...};
```

## 変数の命名規則

変数の命名規則についてこれまで学んできた内容を踏まえて確認してみましょう。変数名にはスネークケース、またはキャメルケースを使用しましょう。

### Bad

```js
// 年齢
let number = 20;
```

### Good

```js
let age = 20;
```

### Bad

```js
let str = "red";
```

### Good

```js
let themeColor = "red";
// or
let theme_color = "red";
```

### その他の例

```js
// お客様種別
const customerType = 1; // 1:個人 2:法人
// サービス名称
const serviceName = "ダミープラン";
// 申し込みサービスID
const entryServiceId = 10010;
// 商品ID
const product_id = 1212;
```

## 真偽値の命名規則

### Bad

```js
const string = typeof "taro" === "string";
```

### Good

```js
// is をつけることで 「stringであるかないか」の真偽値が入ることがわかる
const isString = typeof "taro" === "string";
```

### Bad

```js
const notCompleted = !["done", "pending", "done", "done"].every(
  (str) => str === "done"
);
```

### Good

```js
// 肯定的な命名の方が伝わりやすい
const completed = ["done", "pending", "done", "done"].every(
  (str) => str === "done"
);
```

#### ポイント

真偽値は必ず `true` or `false` になるので状態のどちらか、を表すことのできる命名が望ましい。

- is ～
- 過去分詞系（done、finished、completed など）

### 練習問題

```js
// 未成年であるかどうかを判定
const xxx = age > 20;

// 文字列の中に数字を含むかどうかの判定
const xxx = /\d/.test(string);
```

#### 解答

```js
const isAdult = age > 20;

const isIncludeNumber = /\d/.test(string);
```

## 定数の命名規則

定数は const で定義される値の変更（再代入）が不可となる変数のことを指す。
定数はアッパースネークケースかキャメルケースを使う。

### Bad



```javascript
const ORDER_TYPE = {
  newEntry: 0,
  updatePlan: 10,
  updateOption: 20,
  cancelContract: 30,
};

const toMicroSec = {
  ms: 1,
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
};
```

### Good



```javascript
const ORDER_TYPE = {
  newEntry: 0,
  updatePlan: 10,
  updateOption: 20,
  cancelContract: 30,
};

const TO_MICRO_SEC = {
  ms: 1,
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
};
```

### これは定数？

const で定義するオブジェクトはプロパティの変更が可能なため、一般的にはキャメルケースで定義する。

CONST_VAL（アッパースネークケース）

- 参照として用いる値を格納する変数
- for 文のループ上限値(MAX_○○)
- IF 文等の条件（IS_MATCH）
- 環境変数、設定情報（IMG_URL、LOG_URL）

someVal（キャメルケース）

- オブジェクトのインスタンス、値を保持しておくためのオブジェクト

```js
const person = { name: "Code" };
person.name = "Mafia";
console.log(person.name);
// > Mafia
```

```js
class Person {
  name = "Code";
}
const person = new Person();
```

上記のコードでは const を用いて定義しているが、name プロパティの書き換えが行われていることが確認できる。
JavaScript の場合には const で定義した変数がオブジェクトや配列の場合にも、中身の書き換えを行うことが出来る。
そのため、const で定義していたとしてもアッパースネークケースを使用することはない。

アッパースネークケースはオブジェクト中身（プロパティ）も含めて変更しない値に対して使用する。

```js:受付のタイプを一覧で定義するオブジェクト
const ORDER_TYPE = {
  newEntry: 0,
  updatePlan: 10,
  updateOption: 20,
  cancelContract: 30,
};
```

#### 定数（const）の命名のポイント

CONST_VAL（アッパースネークケース）

- 参照として用いる値を格納する変数
- for 文のループ上限値(MAX_○○)
- IF 文等の条件（IS_MATCH）
- 環境変数、設定情報（IMG_URL、LOG_URL）

someVal（キャメルケース）

- オブジェクトのインスタンス、値を保持しておくためのオブジェクト（customerInfo、serviceInfo）

## 関数の命名規則

### Bad

```js
// 単位を分から時間に変換する関数
function fn(num) {
  return num / 60;
}
```

### Good

```js
function convertMinsToHours(minutes) {
  return minutes / 60;
}
```

### Bad

```js
// 整数の最大値を取得する関数
function maxInteger(list) {
  const integers = list.filter((num) => Number.isInteger(num));
  return Math.max(...integers);
}
```

### Good

```js
function getMaxInteger(list) {
  const integers = list.filter((num) => Number.isInteger(num));
  return Math.max(...integers);
}
```

### 練習問題

以下の関数の命名は適切かどうか考えてみましょう！

#### 問 1

```javascript
async function getUser() {
  const response = 全てのユーザーを返却する処理;
  return response;
}
```

#### 解答

【適切ではない】

ユーザーを返却するのはわかるが、複数形でないこともあり、特定のユーザーを返却するのだと勘違いしてしまう。

```javascript
async function getAllUsers() {
  const response = 全てのユーザーを返却する処理;
  return response;
}
```

全てのユーザーを返却させるのであれば、関数名に全てのユーザーを返却することを明記する。

#### 問 2

```javascript
function open() {
  // メニューを開く処理
  setMenuState(function (prevState) {
    return { isOpen: !prevState.isOpen };
  });
}
```

#### 解答

【適切ではない】

open では何を開くのかがわからない。

```javascript
function openMenu() {
  // メニューを開く処理
  setMenuState(function (prevState) {
    return { isOpen: !prevState.isOpen };
  });
}
```

`openMenu` という関数名であれば、メニューを開くための関数であることがわかる。

#### 問 3

```javascript
function calculation(number) {
  return number * 2;
}
```

#### 解答

【適切ではない】

何のための計算をするのかがわからない。

```javascript
function getDoubleNum(number) {
  return number * 2;
}
```

倍にするのが関数名から伝わる。

## 真偽値を返す関数の命名規則

prefix として接頭語に be 動詞や一般動詞、助動詞などを使用すると分かりやすくなります。
真偽値を返却する関数などは `is` で始めるのが一般的です。
例：「項目が選択中だったら」なら "if item is selected" なので関数名は `item.isSelected()` になります。

ただし、場合によっては`is`で始めることが難しい場合もあります。
そういう場合は、`has`や`can`などの接頭語を使用することがあります。
例：「プロパティを持っていたら」なら "if item has property" なので関数名は `item.hasProperty()` になります。

動詞始まりの例：

- has (持っているか)
- needs (必要か)

助動詞始まりの例：

- can (できるか)
- should (すべきか)
- needs (する必要があるか)

また、「存在したら」の場合は `isExist` と命名したくなりますが、`exist` は自動詞なので、`is` で始めることができません。
そこで Microsoft や Android などのソースコードを参照してみると、`exists`と命名されることが多いことが分かりました。
このように、関数名の表現に困ったら、世の中の API を参考にするとネイティブの方々がしているような的確な表現が見つかる場合もあるので、ぜひ参考にしてみてください。

### Bad

```javascript
if (startTimer(timer)) {
}
```

### Good

```javascript
if (canStartTimer(timer)) {
}
```

### Bad

```javascript
if (emptyBoolean(user)) {
}
```

### Good

```javascript
if (isEmpty(user)) {
}
```

### Bad

```javascript
if (file.notFound()) {
}
```

### Good

```javascript
if (!file.exists()) {
}
```

## クラスの命名規則

### Bad

```js
// 購入履歴を管理するクラス
class MyClass {
  constructor() {
    this.ary = [];
  }

  fn(str) {
    this.ary = [...this.ary, str];
  }
}
```

### Good

```js
class PurchaseHistory {
  constructor() {
    this.history = [];
  }

  add(item) {
    this.history = [...this.history, item];
  }
}
```

### Bad

```js
// 得点を計測、保持するクラス
class countScore {
  constructor() {
    this.count = 0;
  }
  increment() {...}
  decrement() {...}
}
```

### Good

```js
class ScoreCounter {
  constructor() {
    this.count = 0;
  }
  increment() {...}
  decrement() {...}
}
```

## プロジェクト名を全てのクラスにつける必要はない

### Bad

```javascript
class MyDIYTelevision {
  #power = false;
  #switch = new MyDIYSwitch();

  pushSwitch = () => {
    this.#power = this.#switch.push(this.#power);
    console.log(`power: ${this.#power ? "on" : "off"}`);
  };
}

class MyDIYSwitch {
  push = (power) => {
    return !power;
  };
}

const television = new MyDIYTelevision();
television.pushSwitch();
```

- プロジェクト名を全てのクラスにつけると検索で全て引っかかり、探すのが面倒になる

### Good

```javascript
class Television {
  #power = false;
  #switch = new Switch();

  pushSwitch = () => {
    this.#power = this.#switch.push(this.#power);
    console.log(`power: ${this.#power ? "on" : "off"}`);
  };
}

class Switch {
  push = (power) => {
    return !power;
  };
}

const television = new Television();
television.pushSwitch();
```

## オブジェクトやクラスのメソッドは冗長な名前にしない

### Bad

```js
class Person {
  printPersonProfiles() {}
}
```

### Good

```js
class Person {
  //  personのメソッドなので、Person は不要
  printProfiles() {}
}
```

### ポイント

すでに自明である単語は削り、できるだけ簡潔な命名にしましょう。

## 識別子の命名規則：ポイント

それぞれの型の命名は次のルールを意識すると良いでしょう。

- 変数名、プロパティ: (形容詞+)名詞

```js
themeColor;
customerType;
serviceName;
favoriteSports;
```

- 関数、メソッド: 動詞(+形容詞+名詞)

```js
getDayOfWeek;
getNumberArray;
addActiveClass;
```

- クラス: (形容詞+)名詞

```js
FavoriteSports;
ScoreCounter;
PurchaseHistory;
```

## 練習問題

ここまで学んだ命名規則を振り返って、以下を適切な名前に直してみましょう。

```js
// 元旦
const xxx = "1月1日";

// 曜日を格納した配列
const xxx = ["日", "月", "火", "水", "木", "金", "土"];

// 3割引の商品の値段
function xxx(number) {
  return number * (1 - 0.3);
}

// 数値配列の合計値を取得
function xxx(array) {
  return array.reduce(function (a, b) {
    return a + b;
  });
}

// お気に入りのスポーツのクラス
class xxx {
  constructor(name) {
    this.name = name;
  }
  showInfo() {
    console.log(`私の好きなスポーツは${this.name}です。`);
  }
}

// 惑星
class xxx {
  constructor(name) {
    this.name = name;
  }
  // 地球からの距離を返す
  xxx() {...}
}
```

#### 解答

```js
const newYearDay = "1月1日";

const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
const DAY_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

function discountThirtyPercent(number) {
  return number * (1 - 0.3);
}
　
function sum(array) {
  return array.reduce(function (a, b) {
    return a + b;
  });
}

class FavoriteSports {
  constructor(name) {
    this.name = name;
  }
  showInfo() {
    console.log(`私の好きなスポーツは${this.name}です。`);
  }
}

class Planet {
  constructor(name) {
    this.name = name;
  }
  getDistancefromEarth() {...}
}
```

### 練習問題

以下のコードを適切な命名に直してみましょう

```js
const food = {
  japaneseFood: ["寿司", "焼き肉", "鯖の味噌煮"],
  italianFood: ["ピザ", "パスタ", "マリトッツォ"],
  americanFood: ["キッシュ", "ガレット", "マカロン"],
};

class Television {
  #modelNumber = "型番";

  printTelevisionModelNumber() {
    console.log(this.#modelNumber);
  }
}

class Monster {
  constructor(name, hp, mp) {
    this.monsterName = name;
    this.monsterHp = hp;
    this.monsterMp = mp;
  }
  attackEnemy() {
    console.log(this.monsterName + "の攻撃！");
  }
  defendFromEnemy() {
    console.log(this.monsterName + "はダメージを防いだ！");
  }
}

class Page {
  setPageTitle() {}
  setPageDescription() {}
  setPageKeyword() {}
}
const newPage = new Page();
newPage.setPageTitle("記事のタイトル"); // メソッド名のPageは冗長な情報
```

#### 解答

```js
const food = {
  japanese: ["寿司", "焼き肉", "鯖の味噌煮"],
  italian: ["ピザ", "パスタ", "マリトッツォ"],
  american: ["キッシュ", "ガレット", "マカロン"],
};

class Television {
  #modelNumber = "型番";

  printModelNumber() {
    console.log(this.#modelNumber);
  }
}

class Monster {
  constructor(name, hp, mp) {
    this.name = name;
    this.hp = hp;
    this.mp = mp;
  }
  attack() {
    console.log(this.name + "の攻撃！");
  }
  defend() {
    console.log(this.name + "はダメージを防いだ！");
  }
}

class Page {
  setTitle(title) {}
  setDescription() {}
  setKeyword() {}
}

const newPage = new Page();
newPage.setTitle("記事のタイトル");
// シンプルに television の printModelNumber を呼び出すだけで良い
```

## 意味があり発音可能な変数名を利用すること

### Bad

```js
const hms = "10:20:45";
```

### Good

```js
const currentTime = "10:20:45";
```

### Bad

```js
const dfColor = "#fff";
```

### Good

```js
const defaultColor = "#fff";
```

### ポイント

- 多くの人に意味がわかる
- 発音可能
  説明しないと意味が分からない変数名ほど厄介なものはありません。
  名前を変えるだけでコード上で何が行われているのかの理解が進みますし、チームメンバーとの会話でコミュニケーションがとりやすくなります。

## 配列の末尾には複数形の s を付ける

配列の末尾は複数形の s をつけると配列である目印になる。
その他 `List` や `Array` などを末尾につけても良いでしょう。

### Bad



```js
favorite.forEach(item => ...)
```

### Good



```js
favorites.forEach(favorite => ...)
```

### Bad

```js
animal.map(a => ...)
```

### Good

```js
animals.map((animal) => animal);
```

#### ポイント

配列はその型だけで「複数であること」が想像されます。
変数が単数形だと混乱を来す場合があるので、複数形になるような命名をしましょう。

## 嘘の変数名をつけない

変数名は格納されている値をなるべく明確にするようにしましょう。

### Bad

```js
// Listは配列によく使われる命名
const averageList = {
  japanese: 70,
  mathematics: 63,
  science: 75,
  english: 58,
};
```

### Good

```js
const AVERAGE_SCORE = {
  japanese: 70,
  mathematics: 63,
  science: 75,
  english: 58,
};
```

### Bad

```js
function findNumber(list) {
  return list.filter((item) => typeof item === "number");
}
```

### Good

```js
function getNumberArray(list) {
  return list.filter((item) => typeof item === "number");
}
function filterNumber(list) {
  return list.filter((item) => typeof item === "number");
}
```

### ポイント

コード上で表現したい意図と異なる意味を持つ単語は避け、
全員が同じ意図を読み取れる単語を選択し、格納している値をなるべく正確に表しましょう。
特に `list` という名前は配列型を連想させる単語のため要注意です。

### 練習問題

以下の変数について、より適切な変数名を考えてみましょう。



```js
// 曜日の配列
const smtwtfs = ["日", "月", "火", "水", "木", "金", "土"];

// 指定した日付から曜日を取得
function getWk(y, m, d) {
  return smtwtfs[new Date(y, m - 1, d).getDay()];
}
```

```js
// 都道府県
const xxx = {
  hokkaido: '北海道',
  aomori: '青森',
  iwate: '岩手',
  miyagi: '宮城',
  ・
  kagoshima: '鹿児島',
  okinawa: '沖縄'
}

// 配列を昇順にする関数
function orderChar(array) {
  return array.sort((first, second) => first - second);
}
```

#### 解答

```js
// 曜日の配列
const DAY_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];
// const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

// 指定した日付から曜日を取得
function getDayOfWeek(y, m, d) {
  return DAY_OF_WEEK[new Date(y, m - 1, d).getDay()];
}
```

```js
// 都道府県
const PREFECTURE = {
  hokkaido: '北海道',
  aomori: '青森',
  iwate: '岩手',
  miyagi: '宮城',
  ・
  kagoshima: '鹿児島',
  okinawa: '沖縄'
}

// 配列を昇順にする関数
function sortAscending(array) {
  return array.sort((first, second) => first - second);
}
```

## 練習問題

以下のコードに適切な名前をつけてみましょう。

#### 問 1. 配列を並べ替える

```js
// 配列を昇順にする
function xxx(array) {
  return array.sort(function (a, b) {
    return a - b;
  });
}

// 配列を降順にする
function xxx(array) {
  return array.sort(function (a, b) {
    return b - a;
  });
}
```

#### 解答

```js
function sortAscending(array) {
  return array.sort(function (a, b) {
    return a - b;
  });
}

function sortDescending(array) {
  return array.sort(function (a, b) {
    return b - a;
  });
}
```

#### 問 2. 入力形式の確認

```js
// メールアドレスの形式が正しいかどうか
function xxx(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 電話番号の形式が正しいかどうか
function xxx(tel) {
  return tel.match(/^\d{2,4}-\d{2,4}-\d{3,4}$/);
}
```

#### 解答

```js
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateTelNumber(tel) {
  return tel.match(/^\d{2,4}-\d{2,4}-\d{3,4}$/);
}
```

#### 問 3. 面積の計算

```js
// 三角形の面積を取得
function xxx(base, height) {
  return (base * height) / 2;
}

// 四角形の面積を取得
function xxx(width, height) {
  return width * height;
}
```

#### 解答

```js
function getAreaOfTriangle(base, height) {
  return (base * height) / 2;
}

function getAreaOfRectangle(width, height) {
  return width * height;
}
```

#### 問 4. 次回の西暦を求める

#### 問題

```js
// 次のオリンピック開催年を求める
function xxx(year) {
  return year + 4 - (year % 4);
}

// 次の閏年を求める
function xxx(year) {
  while (true) {
    year++;
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return year;
    }
  }
}
```

#### 解答

```js
function getNextOlympicYear(year) {
  return year + 4 - (year % 4);
}

function getNextLeapYear(year) {
  while (true) {
    year++;
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return year;
    }
  }
}
```

## 同じ意味合いの単語は統一する

### Bad



```js
function getSum() {}
function setTotal() {}
```

### Good

```js
function getSum() {}
function setSum() {}
```

### Bad

```js
function removeHeader() {}
function deleteFooter() {}
```

### Good

```js
function removeHeader() {}
function removeFooter() {}
```

### ポイント

使われている単語が異なる場合、読み手は異なる処理が行われることを考慮してコードを読む必要があります。
このような混乱を防ぐためにも、同じ意味合いの単語は統一するようにしましょう。

#### 類似語例

- start、begin
- stop、end
- modify、update、change
- create、new、factory
- find、search
- done、finish、complete
- deliver、dispatch、send
- select、choose
- show、display

## 反対の意味を持つ値は対比のある名前を付ける

### Bad



```js
// 前後の数字を比較。前の数字が大きければ true を出力
for (let i = 1; i < numbers.length - 1; i++) {
  const a1 = numbers[i - 1];
  const a2 = numbers[i + 1];
  console.log(a1 > a2);
}
```

### Good

```js
for (let i = 1; i < numbers.length - 1; i++) {
  const prev = numbers[i - 1];
  const next = numbers[i + 1];
  console.log(prev > next);
}
// 現在：current
```

### ポイント

反対の意味を持つ値の命名を、数字やその他適当なワードで埋めてしまうことがあります。正しく対比の単語が命名されていれば、処理内容の理解がぐっと向上します。

#### 対比語例

- first <-> last
- next <-> previous
- create <-> delete
- source <-> destination
- add <-> remove
- show <-> hide
- min <-> max
- public <-> private
- success <-> failure

### 練習問題

対比語と類似語をあげてみよう。

#### 問 1. 次の対比語を思い出してみましょう



- create
- public

#### 解答

- create <-> delete
- public <-> private

#### 問 2. 次の類似語を思い出してみましょう

- update
- send

#### 解答

- update、modify、change
- send、deliver、dispatch

## 意味のない単語を含めない

識別子の中に意味のない（すでに他の単語によって表されている）単語は含めないようにしましょう。

### Bad



```text
personNameString
```

### Good

```text
<!-- personName が文字列以外の可能性は極めて低いので string は余計な情報 -->
personName
```

### Bad

```text
japanTokyo
```

### Good

```text
<!-- 東京が日本の一部であることは自明 -->
tokyo
```

### Bad

```text
UserData
UserInfo
```

### Good

```text
<!-- 明確な意味の違いを持たない場合は不要なワードを消す -->
User
```

### ポイント

このような意味のない単語のことをノイズワードと言います。
名前がただ冗長になるだけでなく、読み手にも「この単語がついている意図があるのか？」と余計な思考を巡らせることにもなりかねません。

### 練習問題

以下の変数名を適切な名前に直してみましょう。

```js
const descriptionText = "~~~~~(説明文)";

const coldIceCreamFlavorList = ["チョコ", "バニラ", "ミント", "抹茶"];

const superUltraHyperRichMan = "Bill Gates";

const verticalAxisLine = "y-axis";

const mouthColorOnFace = "red";
```

#### 解答

```js
const description = "~~~~~(説明文)";

const iceCreamFlavorList = ["チョコ", "バニラ", "ミント", "抹茶"];

const richMan = "Bill Gates";

const verticalAxis = "y-axis";

const mouthColor = "red";
```

## 変数名を省略するコツ

### ポイント



1. 標準の略語を使用する
   一般的に使用されているもの。辞書に載っているもの。開発業界のパブリックな略語。

### 省略例

- a11y - accessibility
- i18n - internationalization

2. 先頭の単語を抜き出す

### 省略例

- init - initialize
- calc - calculate

3. １文字目以外の母音を削除する

### 省略例

- idx - index
- cstm - customer
- srvc - service
- btn - button

4. 開発者の中で一般的に使用されるもの（おまけ）

### 省略例

- $ - DOM に使用
  $header, $main
- \_ - プライベートメソッドやプライベートプロパティ（メンバ）に使用
  \_privateMethod, \_privateProp

5. その他

- 単語の 1 文字のみの省略は避ける
  - link -> lnk
  - exists -> exsts
- 発音できる名前にする
  - position -> ×: pstn, ○: pos
- プロジェクト全体で省略形の認識を揃える

### 練習問題

次の単語を省略してみましょう。

- initialize
- index
- customer
- position

#### 解答

- initialize 　 → init
- index 　 → idx
- customer 　 → cstm
- position 　 → pos
