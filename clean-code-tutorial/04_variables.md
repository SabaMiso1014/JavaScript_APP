# 変数の定義

## 変数を定義する際の重要なポイント

- ポイント A. 変数が使える範囲を限定する
  変数が使える範囲を絞ることで、他の開発者が見なければならない範囲を狭めることができます

- ポイント B. 出来る操作を限定する
  出来る操作を**意図的に**限定することで、考慮しなければならないパターンを絞ることができます

- ポイント C. 変数に格納されている値を明確にする
  変数名を明確にすることで、コードを通してコードの意図を他の開発者に伝えることができます

## マジックナンバー、マジックキャラクタを避ける

コード内にべた書きされている数値や文字列をマジックナンバー、マジックキャラクタと呼ぶ。
コードを記述する際には、マジックナンバー等は定数として定義するようにしましょう。

### Bad

```javascript
console.log(1200 * 1.1);
```

### Good

```javascript
const TAX_RATE = 1.1;
console.log(1200 * TAX_RATE);
```

### Bad

```javascript
console.log(120 ** 2 * 3.14);
```

### Good

```javascript
const PI = 3.14;
console.log(120 ** 2 * PI);
```

### Bad

```js
setTimeout(() => {
  ...
}, 500)
```

### Good

```js
// 要素のフェードインが完了するのを待っている、という意図が読み取れる
const FADE_DURATION = 500
setTimeout(() => {
  ...
}, FADE_DURATION)
```

### Bad

```js
if (15 <= age && age <= 64) {...}
```

### Good

```js
// 生産年齢かどうかを条件にしているのが変数から読み取れる
const MIN_WORKING_AGE = 15;
const MAX_WORKING_AGE = 64;
if (MIN_WORKING_AGE <= age && age <= MAX_WORKING_AGE) {...}
```

### Bad

```javascript
const sha256 = async function (text) {
  const uint8 = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", uint8);
  return Array.from(new Uint8Array(digest))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
};

const plainPassword = userInputPassword();
const hashedPassword = await sha256(plainPassword + "KL349FJ4PBN3937VH"); //　簡単に解読されないように固定の値をパスワードに連結し、ハッシュ化をしている。
```

### Good

```javascript
const plainPassword = userInputPassword();
const SALT = "KL349FJ4PBN3937VH";
const hashedPassword = await sha256(plainPassword + SALT);
```

### Bad

```javascript
const ONE_DAY_MS = 86400000;
```

### Good

```javascript
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
```

### 豆知識

あまり使ってほしくないメソッド名などは敢えて、刺激的な名前を付けることで、使用者に警告を伝えることも出来ます。

```text
React dangerouslySetInnerHTML
```

### ポイント

コーディングの際には、「読みやすく、検索しやすく、改修しやすい」状態にしておくことが求められています。
コードを見ただけで意味が読み取れない値をハードコーディングすることは避けるべきです。
特に数字のハードコーディング（マジックナンバー）は、その数字だけで意味を読み取ることが難しく、また数字決めうちでの検索は非常に困難です。
できるだけ変数に格納し名前をつけましょう。

### 練習問題

次のマジックナンバーを変数に格納してみましょう。

```js
// 都道府県コードから四国かどうかを判定
// 徳島: 36
// 香川: 37
// 愛媛: 38
// 高知: 39
const isShikoku =
  code === "36" || code === "37" || code === "38" || code === "39";

// 税込価格を取得
function getIncludeTaxPrice(price) {
  return price * 1.1;
}
```

#### 解答

```js
const PREFECTURE_CODE = {
  tokushima: "36",
  kagawa: "37",
  ehime: "38",
  kochi: "39",
};

// 都道府県コードから四国かどうかを判定
const isShikoku =
  code === PREFECTURE_CODE.tokushima ||
  code === PREFECTURE_CODE.kagawa ||
  code === PREFECTURE_CODE.ehime ||
  code === PREFECTURE_CODE.kochi;

// 税込価格を取得
const TAX_RATE = 1.1;
function getIncludeTaxPrice(price) {
  return price * TAX_RATE;
}
```

## 共通して使用する値は定数で保持する

### Bad

```javascript
function calcPerimeter(radius) {
  return 2 * 3.14 * radius;
}

function calcArea(radius) {
  return 3.14 * radius * radius;
}
```

### Good

```javascript
const PI = 3.14;

function calcPerimeter(radius) {
  return 2 * PI * radius;
}

function calcArea(radius) {
  return PI * radius * radius;
}
```

円周率を定数として宣言することで値に意味が付いて見やすくなり、変更も容易になった。

### Bad

```javascript
getMenuStyle().backgroundColor = "pink";
getMenuStyle().border = "20px solid tomato";
getMenuStyle().outline = "10px solid blue";
```

### Good

```javascript
const menuStyle = getMenuStyle();
menuStyle.backgroundColor = "pink";
menuStyle.border = "20px solid tomato";
menuStyle.outline = "10px solid blue";
```

## 変数に本来の目的以外の情報を持たせない

変数名と異なる情報を入れてしまうことは混乱やバグに繋がるのでやめましょう。

### Bad

```javascript
const currentUserId = {
  id: 12,
  name: "田中",
  age: 20,
};
```

変数名を見るとユーザー id が格納されていそうだが、実際はユーザーデータが格納されている。

### Good

```javascript
const currentUserId = 12;
const currentUser = {
  id: 12,
  name: "田中",
  age: 20,
};
```

### Bad

```javascript
const User = [
  ...
    {
      id: 12,
      name: '田中',
      age: 20,
    }
  ...
]
```

### Good

```javascript
const Users = [
  ...
    {
      id: 12,
      name: '田中',
      age: 20,
    }
  ...
]
```

### Bad

```javascript
let isOpen = false;

function isModalOpen() {
  if (isOpen) {
    // ===================
    // モーダルを閉じる処理
    // ===================
  } else {
    // ===================
    // モーダルを開く処理
    // ===================
  }
}
```

isOpen は開いているかの状態を表すため、開閉の処理を行うべきではない。

### Good

```javascript
let isOpen = false;

function toggleModal() {
  if (isOpen) {
    // ====================
    // モーダルを閉じる処理
    // ====================
  } else {
    // ====================
    // モーダルを開く処理
    // ====================
  }
}
```

isOpen は Boolean の値のみを格納し、実際の処理は別の関数に分離させる。

### TIPS

ON/OFF を切り替える関数には toggle を使用する

## 配列は添え字の指定よりも分割代入で値を明示する

JavaScript には分割代入という機能があり、それを使用することで配列などのデータを取り出し名前を付けることができます。
添字ではなく名前をつけることにより、わかりやすいコードになります。

### Bad

```javascript
const pattern = /[\/\.\-]/;
const date = "1996/03/01";
const splitDate = date.split(pattern);
console.log(`${splitDate[0]}年${splitDate[1]}月${splitDate[2]}日`);
```

### Good



```javascript
const pattern = /[\/\.\-]/;
const date = "1996/03/01";
const [year, month, day] = date.split(pattern);
console.log(`${year}年${month}月${day}日`);
```

### Bad

```javascript
const skills = ["Ruby", "JavaScript", "Java", "Python"];
const firstSkill = skills.shift();
const otherSkills = skills;
```

### Good

```javascript
const skills = ["Ruby", "JavaScript", "Java", "Python"];
const [firstSkill, ...otherSkills] = skills;
```

### Bad

```javascript
const position = [12, 32, 42];
const x = position[0];
const y = position[1];
const z = position[2];
```

### Good

```javascript
const position = [12, 32, 42];
const [x, y, z] = position;
```

## 一つの目的に一つの変数を定義する

一つの変数は一つの目的のために定義しましょう！

### Bad

まず、こちらのコードを見てみてください。
円の面積を求めるコードです。

```javascript
const PI = 3.14;
let size = 30;
size = PI * size * size;

console.log(`円の面積は${size}です`);
```

円周率は PI にて定義がされていますが、半径を宣言したあと円の面積を格納しています。
これでは size が何を指す変数かがわかりません。
詳しくはセクション 02 の命名規則を復習してください。

### Good

```javascript
const PI = 3.14;
const radius = 30;
const circularArea = PI * radius * radius;

console.log(`円の面積は${circularArea}です`);
```

今回のコードでは変数の名前が広すぎず、値と結びつくような命名ができているので、意味が伝わりやすくバグが生まれにくいコードになりました。
また、目的ごとに命名をすることで変数名の名前が広すぎることを防ぐことができます。

### Bad

目的ごとに変数を変えなかった場合には次のような問題も発生します。
次のコードでは price に対して結果を順次上書きしていっています。
ただ、この場合は順番を変えただけで結果が異なることになります。

```javascript
const TAX_RATE = 1.1;
const DISCOUNT_AMOUNT = 1000;

let price = 5000;
// 以下の順番を変えると結果が異なる
price = price - DISCOUNT_AMOUNT;
price = price * TAX_RATE;

console.log(`お支払いは${price}円です。`);
```

### Good

```javascript
const TAX_RATE = 1.1;
const DISCOUNT_AMOUNT = 1000;

let price = 5000;
// それぞれの依存関係が明確なため、順番を変えようとする人は現れないだろう
let discountPrice = price - DISCOUNT_AMOUNT;
let totalPrice = discountPrice * TAX_RATE;

console.log(`お支払いは${totalPrice}円です。`);
```

### Bad

下記のコードでは変数 user が使い回されている。
変数の数はなるべく少なくするべきだがこれでは user に入っている値に気を使う必要がある。

```javascript
let user = await fetchLoginUser();

// user(ログインユーザー)を使った処理

// 問題！ ↑と↓で同じuserだが入ってる値が違う。
user = await fetchCustomer();

// user(customer※契約者)を使った処理
```

### Good

変数を目的ごとに分けることで、変数に入っている値が明確になりました。

```javascript
let currentUser = await fetchLoginUser();
// もしくは、userの命名でもOK

// currentUser(ログインユーザー)を使った処理

// Good! それぞれの変数で格納されている値が明確になった！

let customer = await fetchCustomer();

// customerを使った処理
```

ただ、この状態でも currentUser に対して `await fetchCustomer()`の値を代入することは可能です。

```js
let currentUser = await fetchLoginUser();
currentUser = await fetchCustomer(); // 他の値で上書き出来てしまう。
```

### Good

そこで、変数宣言に const を使用することによって、値の上書き（再代入）を考慮する必要がなくなります。

```javascript
// const で定義
const currentUser = await fetchLoginUser();
currentUser = await fetchCustomer();
// > エラーが発生！！ Uncaught TypeError: Assignment to constant variable.
```

### ポイント

- 一つの変数は一つの目的のために定義する。
- const を使うことによって、値の宣言時から値が変わらないことが担保されるため、途中のコードを追う必要がなくなる。

### Advanced

currentUser オブジェクトを他の処理にて使用しない場合は、オブジェクトの分割代入を使用することによって、より簡潔に記述することができます。

### Bad

```javascript
async function buildUserPage() {
  const currentUser = await fetchLoginUser();
  const username = currentUser.username;
  // usernameしか使わないのであれば、currentUserをまるごと取得する必要はない。
  // currentUserを取得する事によって、後続のコードでcurrentUserが使用されているか確認する必要がある。
}
```

### Good

```javascript
async function buildUserPage() {
  const { username } = await fetchLoginUser();
  // usernameのみをコード内で使用
  // currentUserの他のプロパティはコード内で使用していないことを暗に他の開発者に伝えていることになる。
}
```

上記のコードでは username のみ分割代入で取得しているため、暗に currentUser の他のプロパティは buildUserPage の中で使用していないことを他の開発者に暗示していることになります。
このように、コードを通して、コードの意図を他の開発者に伝える事ができます。

### 練習問題

```js
// 新しく投稿する内容を定義する。
const post = {
  userId: user.id,
  title: "Hello World",
  content: "Welcome to learning clean code.",
};

function editPost(currentPost, newContent) {
  const user = getCurrentUser();

  if (currentPost.userId === user.id)
    throw new Error("You are not the author of this post");

  newContent.updatedAt = new Date();
  newContent.createdAt = currentPost.createdAt;

  updateCurrentPost(newContent);
}
```

#### 解答

```js
// postではどの段階の投稿かがわからないため、newPostという名前に変更する。
const newPostContent = {
  userId: user.id,
  title: "Hello World",
  body: "Welcome to learning clean code.",
};

function editPost([currentPost, setCurrentPost], content) {
  const { id: userId } = getCurrentUser();

  if (currentPost.userId !== userId)
    throw new Error("You are not the author of this post");

  const newPost = {
    ...content,
    updatedAt: new Date(),
    createdAt: currentPost.createdAt,
  };

  setCurrentPost(newPost);
}
```

## オブジェクトや配列は定数で定義しよう

一つの変数には一つの目的をもたせる観点でコードを考えたとき、オブジェクトや配列は const で定義するべきであることがわかってきます。

### Bad

意味の異なるオブジェクトが同じ変数に代入されている。

```javascript
async function fetchLoginUser() {
  // ログインユーザーの取得処理
  return {
    name: "tanaka",
    role: "admin",
  };
}

async function fetchCustomer() {
  // ログインユーザーの取得処理
  return {
    name: "tanaka",
    address: "...",
  };
}

let user = await fetchLoginUser();

// ログインユーザーのオブジェクトにはroleのプロパティが存在する

user = await fetchCustomer();

// 契約者にはaddressが存在するが、roleは存在しない。

if (user.role === "admin") {
  // user.roleはundefinedとなり、エラーは発生しないが誤ったコードとなる。
  // また、user定義部からこの条件式が実行されるまでのコードを確認する必要が発生する。
}
```

### Good

別の変数として定義することで、それぞれの変数の役割が明確となる。

```javascript
const currentUser = await fetchLoginUser();

const customer = await fetchCustomer();

if (currentUser.role === "admin") {
  // 問題なし！
}
```

変数に新しいオブジェクトを再代入することは基本的に行いません。
変更可能な操作を限定（再代入の操作を不可）することで、他の開発者が考え得る可能性を限定します。
また、オブジェクトは定数で定義しても中身を変更することができます。

## 変数の寿命を短くする

変数の寿命とは、**変数を宣言してから使用するまでの行数**のことを指します。
値を使用する際には、どのような値が格納されているのかを確認する必要があります。
寿命が長ければ長いほど、設定されている値が何なのかがわかりづらくなってしまうため、コードを追いづらくなってしまいます。

### Bad

```javascript
const currentUser = fetchLoginUser();
// ==========================
// 10行の処理
//===========================
if (currentUser.age >= 20) {
  // 20歳以上のユーザーに対する処理
}
```

1000 行の処理の間に currentUser のデータが書き換えられた場合、意図する動作をしない恐れがあります。
もしうまく動作しなかった場合 1000 行の処理の中を見てデバッグする必要が出てくるので寿命は短くしましょう。

### Good

```javascript
// ===================
// 10行の処理
// ===================
const currentUser = fetchLoginUser();

if (currentUser.age >= 20) {
  // 20歳以上のユーザーに対する処理
}
```

処理の直前に宣言をすることで変数の中身が追いやすくなりデバッグも容易になります。

### 寿命が長いことでのデメリット

1. 想定していた中身と違う事による、バグが起きる可能性がある
2. 寿命が長ければ長いほど見返すのが大変になる
3. 感心が分断され、1 画面で収まらずコードが読み辛くなる

### 変数の寿命を短くするコツ（For 文）

for 文内の結果を格納する用の変数などは for 文の直前で宣言する。

### Bad

下記のコードで実際に numberString を使用しているのは for 文内なので、for 文の直前で宣言してあげれば問題ない。

```js
function processSomething(max) {
  let numberString = "";
  let otherVariable;
  // ================
  // 100行の処理
  // ================
  for (let i = 0; i < max; i++) {
    numberString += i;
  }
}
```

### Good

for 文の直前で定義することによって、使用箇所と変数宣言部が近くなり、追いやすいコードとなった。

```js
function processSomething(max) {
  let otherVariable;
  // ================
  // 100行の処理
  // ================
  let numberString = "";
  for (let i = 0; i < max; i++) {
    numberString += i;
  }
}
```

### POINT

for 文内部で使用する変数をわざわざ関数の先頭で宣言する必要はない。

### 変数の寿命を短くするコツ（関数）

関数終了後にも状態を保持する際には関数の外にある変数に対して値を設定することがある。このような場合にも、関数の直前で変数を宣言することによって、見通しの良いコードとなります。

### Bad



```javascript
let isOpen = false;
// ==================
// 100行の処理
// ==================
function buttonClickHandler() {
  isOpen = !isOpen;
}
```

### Good

```javascript
// ==================
// 100行の処理
// ==================
let isOpen = false;

function buttonClickHandler() {
  isOpen = !isOpen;
}
```

### 変数の寿命を短くするコツ(例外)

小さな関数（１０行程度）の場合は宣言をまとめて記載しても特に読みにくいことはないでしょう。

### Bad



```javascript
function postUser() {
  const sendData = {};
  const inputUsername = getInputUsername();
  const inputEmail = getInputEmail();

  if (!validateUsername(inputUsername)) {
    sendData.username = inputUsername;
  }

  if (!validateEmail(inputEmail)) {
    sendData.email = inputEmail;
  }

  // sendDataをサーバーに送信する処理
}
```

このくらいの関数の大きさの場合には関数の先頭でまとめて変数を定義しても特に見づらいことはない。

### Good

```javascript
function postUser() {
  const sendData = {};

  const inputUsername = getInputUsername();
  if (!validateUsername(inputUsername)) {
    sendData.username = inputUsername;
  }

  const inputEmail = getInputEmail();
  if (!validateEmail(inputEmail)) {
    sendData.email = inputEmail;
  }

  // sendDataをサーバーに送信する処理
}
```

関数が小さい場合にはどちらでも読み手の負担は変わらないことがわかります。

## 【発展】なるべく小さなスコープで変数を定義する

スコープとは変数や関数などを参照できる範囲のことです。スコープ内で定義された変数や関数はスコープ外からは参照することができません。そしてスコープが大きくなればなるほど見なければならない範囲が大きくなるので意識しましょう。

### Bad

例えば、次のコードでは PRICE_TABLE で金額表を管理しています。
このとき、仮に getEntryPrice 関数内でしか PRICE_TABLE を使わない場合には PRICE_TABLE を getEntryPrice 内に移動しましょう。
これはなぜかということ、仮に PRICE_TABLE 内に新しい項目を追加しようとした際に、 getEntryPrice 関数外に PRICE_TABLE が定義されている場合には、getEntryPrice
以外の関数でも PRICE_TABLE が使われていないかを確認する必要があります。
これが、スコープが広いことによる弊害です。

```javascript
const PRICE_TABLE = {
  kidOrSenior: 300,
  junior: 500,
  adult: 700,
  // vip: 0
};

function getEntryPrice(age) {
  if (typeof age !== "number" || age < 0)
    throw new Error("値が正しくありません");

  if (age <= 6 || age >= 60) return PRICE_TABLE.kidOrSenior;

  if (age <= 15 && age >= 7) return PRICE_TABLE.junior;

  return PRICE_TABLE.adult;
}
```

### Good

一方で、getEntryPrice 内で PRICE_TABLE を定義した場合には影響範囲が getEntryPrice 内にとどまることが他の開発者に伝わります。そのため、getEntryPrice
関数に集中することが出来て、無駄な影響調査の工数を減らすことが出来ます。

```javascript
function getEntryPrice(age) {
  const PRICE_TABLE = {
    kidOrSenior: 300,
    junior: 500,
    adult: 700,
  };

  if (typeof age !== "number" || age < 0)
    throw new Error("値が正しくありません");
  if (age <= 6 || age >= 60) return PRICE_TABLE.kidOrSenior;
  if (age <= 15 && age >= 7) return PRICE_TABLE.junior;
  return PRICE_TABLE.adult;
}
```

## 【発展】レキシカルスコープは極力使わない

レキシカルスコープとは静的スコープ（または、外部スコープ）と呼ばれる実行中コードの外側のスコープのことを指します。

### Bad

```js
// 関数 greeting から見たレキシカルスコープ
const user = { name: "田中" };

function greeting() {
  console.log(user.name);
}

function changeUserName(name) {
  user.name = name;
}

changeUserName("小林");

greeing();
// > 小林
```

上記のようにしてもコードは問題なく動きますが、この出力結果として「田中」、もしくは「小林」のどちらが出力されるかの判断が付きにくいコードになります。

レキシカルスコープを通すと、greeting や changeUserName 関数内で使用されている user.name がどこから来たのかを探す必要があるため、可読性が悪くなります。

また、上記のコードでは比較的（使用箇所の）近くで user が定義されているため、コードを追うのにそれほど苦労しませんが、実際のコードはもっと複雑です。

上記のコードが仮に巨大なコードの一部で、greeting や changeUserName の実行タイミングの順序すらわからない場合にはどうでしょうか？

```js
const user = { name: "田中" };

function greeting() {
  console.log(user.name);
}

function changeUserName(name) {
  user.name = name;
}

// updateUserProfile はさらに他の関数の中で実行される。
function updateUserProfile(inputs) {
  // 何らかの処理
  changeUserName(inputs.name);
}

// displayUserProfile はさらに他の関数の中で実行される。
function displayUserProfile() {
  greeing();
}
```

このような状態になっている場合に greeing や displayUserProfile の中で使用されている user オブジェクトが関数の実行時点でどのような状態になっているのかを追うことはとても困難です。

また、一般的にプログラムは一本筋でコードの実行が行われることはなく、プログラム内には様々な条件分岐が設けられます。（すなわち、user.name
に入っている値がプログラムのたどってきた経路によって変わる可能性があります。）そうなると、user.name の値に何が入ってくるのかを、様々なパターンから割り出す必要があります。

```js
const user = { name: '田中' };
↓
条件分岐①
↓
①の結果で呼ばれない場合がある
updateUserProfile(inputs); // <- ここで user.name が更新される
↓
条件分岐②
↓
②の結果で呼ばれない場合がある
displayUserProfile() // <- この中で user.name の値を使用。どこで更新されたのかわからない。

```

このようにレキシカルスコープの変数を参照すると、考慮しなければならないパターンが無駄に増える危険をはらんでいます。そのため、必要でない限りレキシカルスコープは使用しないようにしましょう。

### Good

もし、関数外で使用する変数が存在する場合には、なるべく引数を通して、値を受け渡しするようにしましょう。

```js
const user = { name: "田中" }; // <- 関数 greeting から見たレキシカルスコープ

function greeting(user) {
  console.log(user.name);
}

function changeUserName(user, name) {
  // <- 関数 changeName から見たレキシカルスコープ
  user.name = name;
}

function updateUserProfile(user, inputs) {
  // 何らかの処理
  changeUserName(user, inputs.name);
}

function displayUserProfile(user) {
  // 何らかの処理
  greeing(user);
}
```

上記の例は Bad の例と似ていますが、user を引数から渡すことで、updateUserProfile や displayUserProfile に**渡ってきた user オブジェクト**
が使用されていることになります。

これにより、どの user オブジェクトが関数内で使用されているのかが追いやすいコードになります。

### POINT

- 一つの関数でしか使わない変数はレキシカルスコープに記載しない。
- 特に値が変更される可能性がある変数はレキシカルスコープに置くとコードが追いづらくなる。
- なるべく、引数を通して値を受け渡しするように心がける。

### 練習問題

以下の plus10 の関数を書き換えて、レキシカルスコープの変数を使用しないように修正しましょう。
また、余裕のある人は let から const の書き換えも行ってみてください。

```javascript
let baseNum = 0;

function plus10() {
  baseNum = baseNum + 10;
}
plus10();

console.log(baseNum);
```

#### 解答

```javascript
function plus10(count) {
  return count + 10;
}

const baseNum = 0;
const resultNum = plus10(baseNum);
console.log(resultNum);
```

## 【発展】グローバルスコープは（可能な限り）使用しない

グローバルスコープはファイルにまたがり共有されるスコープです。
グローバルスコープの値（特に変数）は見る範囲が大幅に増えるため、使用しないでください。

### Bad

変数をグローバルスコープに配置した場合、他のファイル空でも値を変更できるため、影響範囲が大きい。

```HTML:index.html
<body>
  <script src='scripts/lib.js'></script>
  <script src='scripts/main.js'></script>
</body>
```

```javascript:scripts/lib.js
// scripts/lib.js
const username = 'suzuki';
const password = 'suzuki1234';
// ====================
// Do something
// ====================
```

```javascript:scripts/main.js
// scripts/main.js
const username = 'tanaka';
const password = 'tanaka1234';
// → lib.jsで定義されているため、エラーになる
// ====================
// Do something
// ====================
```

JavaScript の場合にはファイルをまたいでグローバルスコープが生成されるため、
他のファイル内で同じ名前の変数名があるとエラーが発生します。

また、スコープが広くなればなるほど、その変数が「どの場所で使われているのか？」「どの場所で値が変更されているのか？」の調査範囲が大きくなります。そのため、変数はなるべくグローバルスコープで宣言しないようにしましょう。

### Good

```javascript:scripts/main.js
// scripts/main.js
init();
function init() {
  const username = 'tanaka';
  const password = 'tanaka1234';
  // → lib.jsで定義されているため、エラーになる
  // ====================
  // Do something
  // ====================
}
```

```javascript:scripts/lib.js
// scripts/lib.js
initLib();
function initLib() {
  const username = 'suzuki';
  const password = 'suzuki1234';
  // ====================
  // Do something
  // ====================
}
```

上記のように記載することで変数のスコープを関数スコープに留めることができます。
このようにすることで他のファイル内で使用されている変数や関数との競合を防ぐことが可能になります。

因みに、上記の関数はスコープを形成するためだけに使用しているため、下記のように即時関数と呼ばれる関数に置き換えることができます。
※即時関数:関数の定義時に実行される関数。一度しか使用しない関数に使用される。

```javascript:scripts/main.js
// scripts/main.js
(function() {
  const username = 'tanaka';
  const password = 'tanaka1234';
  // ====================
  // Do something
  // ====================
})();

// or アロー関数でもＯＫ

(() => {
  // 本文
})();
```

```HTML:index.html
<body>
  <script type='module' src='scripts/lib.js'></script>
  <script type='module' src='scripts/main.js'></script>
</body>
```

```javascript:scripts/lib.js
// lib.js内でスコープが形成される
const username = 'suzuki';
const password = 'suzuki1234';
// ====================
// Do something
// ====================
```

```javascript:scripts/main.js
// main.js内でスコープが形成される
const username = 'tanaka';
const password = 'tanaka1234';
// ====================
// Do something
// ====================
```

## 【発展】モジュールスコープを使用する

**JavaScript 遣いの方向け**

type="module"
をスクリプトタグに付与することでモジュールスコープが有効になります。モジュールスコープはそのファイル内でのスコープになるため、グローバルスコープよりも影響範囲を限定的にすることができます。そのため、下記のコードはエラーにはなりません。

```HTML:index.html
<body>
  <script type="module" src="scripts/lib.js"></script>
  <script type="module" src="scripts/main.js"></script>
</body>
```

```javascript:scripts/lib.js
// scripts/lib.js
const username = 'suzuki';
const password = 'suzuki1234';
// ====================
// Do something
// ====================
```

```javascript:scripts/main.js
// scripts/main.js
const username = 'tanaka';
const password = 'tanaka1234';
// → モジュールスコープのため、他のファイルとスコープが分離されているため、エラーにはならない。
// ====================
// Do something
// ====================
```

### POINT

- 基本的にグローバルスコープに対して、変数や関数は配置しない！（即時関数やモジュールスコープに配置する）
- ライブラリで他のスクリプトから使用可能にしたい場合のみグローバルスコープを使用します。
- モジュールスコープはファイル内のスコープとなるため、他のファイルの変数や関数の状態を気にしない。

## 【発展】異なるスコープで同じ変数名を使用しない

異なるスコープで同じ変数名で変数が定義されるとどの値が取れてくるのか分かりづらい。 意図せずレキシカルスコープの変数が取得される可能性があるため、変数名を変えるとよい。

### Bad



```javascript
const personName = "tanaka";

function getPersonName() {
  const personName = "yamamoto";

  if (true) {
    const personName = "yamaguchi";
  }
}
```

正しく動作するが、潜在的なバグに気づくことが困難になります。

### Good

```javascript
// gのプレフィックスを先頭に付けてグローバル変数であることを示す。
const gPersonName = "tanaka";

function getPersonName() {
  const personName = "yamamoto";

  if (true) {
    // _を先頭に付けてローカル変数（グローバル変数でない変数）この場合はif文のブロックスコープに属する変数
    const _personName = "yamaguchi";
    // どのpersonNameを使用しようとしているのかが一目瞭然となる。
  }
}
```
