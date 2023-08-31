# 関数の定義

## 関数を定義する際の重要なポイント

- ポイント A. 関数は 1 つの機能のみを実装し、小さく作る！
  （責務を限定する）
  複数機能を実装してしまうと、関数の責務が大きくなり、テストが難しくなります。可読性も落ちます。

- ポイント B. 条件分岐をなるべく書かない！
  条件分岐を書くと関数が大きく、複雑に、使いづらくなります！

- ポイント C. 関数は DRY 原則で作成しよう！
  関数名は処理内容と一致させるようにしましょう！

## 関数名は処理内容を明確に！

関数で行うことは明確にしましょう。

### Bad

```js
function log() {}

function print() {}
```

### Good

```js
function sendServerLog() {}

function renderProfilePage() {}
```

### Bad

少し関数名が抽象的過ぎて何の検索なのか分かりません。

```js
function search(keyword) {}
```

### Good

関数名を明確にするとより分かりやすくなります。

```js
function searchByFavorite(favorite) {}

class Favorites {
  filter() {}
}
```

## 関数はなるべく小さくし、一つの責務のみ行う

関数の中で複数の処理が絡み合っていては非常に読みづらいコードになってしまいます。タスクを分割し、1 つの関数で 1 つのタスクを完結させるようにできないかを考えてみましょう。

例えば次の関数では huge に多くの処理を実装しているため、huge 内のコードが変更された際の影響範囲（この場合は関数が呼び出される箇所）が無駄に広くなってしまっています。

### Bad

```js
// A, B, C を条件によって処理する関数
function huge(condition) {
  if (condition === "A") {
    // 処理 A（他の処理BCに関係しない）
  } else if (condition === "B") {
    // 処理 B（他の処理ACに関係しない）
  } else if (condition === "C") {
    // 処理 C（他の処理ABに関係しない）
  }
}

// 影響範囲（この場合は３つとなる）
huge("A");
huge("B");
huge("C");
```

### Good

一方、関数をそれぞれ小さく分割すると影響範囲が小さくなります。

```js
// A, B, C 全ての修正で
function smallA() {
  // 処理 A
}
function smallB() {
  // 処理 B
}
function smallC() {
  // 処理 C
}

smallA();
smallB();
smallC();
```

確かに関数は使いまわすことでメリットを発揮します。しかし、全く関係のない処理が同じ関数内で記述されていることは無駄に影響範囲を広めるため避けましょう。

### Bad

```js
function validate(type, value) {
  if (type === "mail") {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return {
      isError: !isValid,
      message: isValid ? "" : "Invalid email address",
    };
  } else if (type === "tel") {
    const isValid = value.match(/^\d{2,4}-\d{2,4}-\d{3,4}$/);
    return {
      isError: !isValid,
      message: isValid ? "" : "Invalid tel number",
    };
  } else if (type === "name") {
    const isValid = value.match(/^[a-zA-Z]{2,}$/);
    return {
      isError: !isValid,
      message: isValid ? "" : "Invalid name",
    };
  }
}

validate("mail", "hoge@example.com");
validate("tel", "090-1234-5678");
validate("name", "hoge");
```

### Good

```js
function validateMail(value) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return {
    isError: !isValid,
    message: isValid ? "" : "Invalid email address",
  };
}

function validateTel(value) {
  const isValid = value.match(/^\d{2,4}-\d{2,4}-\d{3,4}$/);
  return {
    isError: !isValid,
    message: isValid ? "" : "Invalid phone number",
  };
}

function validateName(value) {
  const isValid = value.match(/^[a-zA-Z]{2,}$/);
  return {
    isError: !isValid,
    message: isValid ? "" : "Invalid name",
  };
}

validateMail("hoge@example.com");
validateTel("090-1234-5678");
validateName("hoge");
```

### Bad

```js
async function submitBlogPost() {
  let result;

  const inputTitle = getUserInputTitle(); // ユーザーからの入力を取得
  const inputBody = getUserInputBody(); // ユーザーからの入力を取得

  // POST送信する際のデータを定義
  const sendData = {
    title: inputTitle,
    body: inputBody,
  };

  try {
    setLoadingState("LOADING");
    // POST送信をしている
    const response = await fetch("/blog-post", {
      method: "POST",
      body: JSON.stringify(sendData),
    });

    // HTTPステータスコードが200番代以外の場合はエラーを発生させる
    if (result.status < 200 && 300 <= result.status) {
      throw new Error(result.message);
    }

    result = await response.json();

    setLoadingState("DONE");
  } catch (error) {
    setLoadingState("FAIL");
    setErrorMessage(error);
  }

  return result;
}
```

### Good

```js
async function submitBlogPost() {
  let result;
  
  const sendData = getSendData();

  try {
    setLoadingState("LOADING");
    // POST送信をしている

    const url = "/blog-post";
    result = await sendPostMethod(url, sendData);

    setLoadingState("DONE");
  } catch (error) {
    setLoadingState("FAIL");
    setErrorMessage(error);
  }

  return result;
}

function getSendData() {
  const inputTitle = getUserInputTitle(); // ユーザーからの入力を取得
  const inputBody = getUserInputBody(); // ユーザーからの入力を取得

  // POST送信する際のデータを定義
  return {
    title: inputTitle,
    body: inputBody,
  };
}

async function sendPostMethod(url, sendData) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(sendData),
  });

  // HTTPステータスコードが200番代以外の場合はエラーを発生させる
  if (result.status < 200 && 300 <= result.status) {
    throw new Error(result.message)
  };

  return await response.json();
}
```

- API に POST するデータを作成する関数
- 実際に POST する関数
- 一連の流れをハンドリングする関数

と分割することで、関数の役割が明確になりコードの可読性を向上することができます。

### 関数を小さくするメリット

関数を小さくすることで様々なメリットがあります。

1. 汎用性を持たせることができる
2. 影響範囲を限定することができる
3. 人のコードを読む際の負担を減らすことができる

### 練習問題

以下の要件に沿って getAge 関数を整理してみましょう。

- 要件 ①: 誕生日の日付フォーマットが正しいか判定する処理を分離しましょう。
- 要件 ②: `profile` オブジェクトに `age` を追加する処理を getAge から分離しましょう。

```js
const profile = {
  name: "山田太郎",
  birthday: "2000-01-01",
  age: null,
};

function getAge(birthday) {
  if (!birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error(`誕生日のフォーマットが正しくありません。[${birthday}]`);
  }
  const today = new Date();
  const birth = new Date(birthday);
  const age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    profile.age = age - 1;
    return age - 1;
  }
  profile.age = age;
  return age;
}

getAge(profile.birthday);
console.log(`${profile.name}さんは${profile.age}歳です。`);
```

#### 解答

```js
const profile = {
  name: "山田太郎",
  birthday: "2000-01-01",
  age: null,
};

const age = getAge(profile.birthday);
profile.age = age;
console.log(`${profile.name}さんは${profile.age}歳です。`);

function getAge(birthday) {
  if (!validateDate(birthday)) {
    throw new Error(`誕生日のフォーマットが正しくありません。[${birthday}]`);
  }
  const today = new Date();
  const birth = new Date(birthday);
  const age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    return age - 1;
  }
  return age;
}

function validateDate(date) {
  return date.match(/^\d{4}-\d{2}-\d{2}$/);
}
```

## 練習問題

以下の関数の fetch 処理とスペースの除去を別の関数に切り出してみましょう。

### Bad

```js
async function fetchText(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const json = await response.json();
  const { text } = json;

  // すべての改行とスペースを除去
  text.replace(/\r?\n|\r|\s/g, "");
  return text;
}
```

### Good

```js
async function fetchFormattedText(id) {
  const text = await fetchText(id);
  const formattedText = removeSpaces(text);
  return formattedText;
}

async function fetchText(id) {
  const response = await fetch(`https://api.example.com/text/${id}`);
  const json = await response.json();
  const { text } = json;
  return text;
}

function removeSpaces(text) {
  return text.replace(/\r?\n|\r|\s/g, "");
}
```

## DRY（ドライコード）を意識する

「Don't Repeat Yourself」は同じコードを繰り返し書いてはいけないという原則です。
同じ機能や目的のコードが複数箇所にあれば、コードが冗長になるだけでなくその分リーディングにも時間がかかります。修正や仕様変更が発生した際にも、同じ処理があちらこちらに散らかっていれば修正漏れの恐れもあります。処理が似てる場合や目的、意味が同じコードはまとめられないか考えることが重要です。

### Bad

```js
const drinks = ["lemonade", "soda", "tea", "water"];
const foods = ["beans", "chicken", "rice"];

function printDrink(drinks) {
  for (let i = 0; i < drinks.length; i++) {
    console.log(drinks[i]);
  }
}

function printFood(foods) {
  for (let i = 0; i < foods.length; i++) {
    console.log(foods[i]);
  }
}

printDrink(drinks);
printFood(foods);
```

### Good

```js
const drinks = ["lemonade", "soda", "tea", "water"];
const foods = ["beans", "chicken", "rice"];

function printArray(array) {
  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
}

printArray(drinks);
printArray(foods);
```

### Bad

```js
async function fetchArticlesForUser(userId) {
  // APIエンドポイントが変更された場合、関数全てのURLを変更しなければならない
  const response = await fetch(`/api/users/${userId}`, {
    credentials: "include",
    redirect: "follow",
  });
  const user = await response.json();
  const articleResponse = await fetch(`/api/articles/${user.authorId}`);
  return articleResponse.json();
}

async function fetchCommentsForUser(userId) {
  // 変更を忘れるかもしれない
  const response = await fetch(`/api/users/${userId}`, {
    credentials: "include",
    redirect: "follow",
  });
  const user = await response.json();
  const commentResponse = await fetch(`/api/comments/${user.commentId}`);
  return commentResponse.json();
}
```

### Good

```js
async function fetchArticlesForUser(userId) {
  const user = await fetchUser(userId);
  const articles = await fetchJSON(`/api/articles?u=${user.authorId}`);
  return articles;
}

async function fetchCommentsForUser(userId) {
  const user = await fetchUser(userId);
  const comments = await fetchJSON(`/api/comments?u=${user.authorId}`);
  return comments;
}

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  return await response.json();
}

async function fetchUser(userId) {
  const endpoint = `/api/users/${userId}`;
  const options = {
    credentials: "include",
    redirect: "follow",
  };
  return await fetchJSON(endpoint, options);
}
```

データ取得の汎用関数と、それぞれのデータを取得するための関数で切り分けます。

### Bad

```js
function editComment(userId, comment) {
  const comment = database.selectById(comment.id);

  // 投稿主でなければ編集できない
  if (!canEditComment(userId, comment)) {
    // エラーを発生させる
  }
  // comment 変更処理
}

function canEditComment(userId, comment) {
  return comment && comment.ownerId === userId;
}

function editTopic(userId, topic) {
  const topic = database.selectById(topic.id);

  // 投稿主でなければ編集できない
  if (!canEditTopic(userId, topic)) {
    // エラーを発生させる
  }
  // topic 変更処理
}

function canEditTopic(userId, topic) {
  return topic && topic.ownerId === userId;
}
```

### Good

```js
function editComment(userId, comment) {
  const record = database.selectById(comment.id);

  if (!canEdit(userId, record)) {
    // エラーを発生させる
  }
  // comment変更処理
}

function editTopic(userId, topic) {
  const record = database.selectById(topic.id);

  if (!canEdit(userId, record)) {
    // エラーを発生させる
  }
  // topic変更処理
}

// 投稿主かどうかの判定をする関数を作成
function canEdit(userId, record) {
  return record && record.ownerId === userId;
}
```

### POINT

同じようなコードを見かけた際は関数として抽出できないかを検討してみましょう！

## DRY を適用しない方が良いケース

DRY 原則はコードを整理する上で重要な法則です。一方で、DRY を適用しない方が良いケースも存在します。

### DRY 適用前

```js
// 税込み金額
function getTotalWithTAX(amount) {
  const TAX = 0.1;
  return amount + amount * TAX;
}

// 支払い違反金
function getTotalWithPenalties(amount) {
  const PENALTY = 0.1;
  return amount + amount * PENALTY;
}
```

上記のコードは一見すると DRY が適用できるように見えます。

### DRY 適用後

```js
function getTotalWithExtraPercentage(amount, extraPercentage) {
  return amount + amount * extraPercentage;
}
// 税込み金額
getTotalWithExtraPercentage(1000, 0.1);
// 支払い違反金
getTotalWithExtraPercentage(1000, 0.1);
```

一見良さそうに見えますが、支払い違反金の計算方法が変わった場合（例えばパーセントの他に金額自体を追加することが可能になったなど）にこの関数は次のように変更する必要が出てきます。

```js
function getTotalWithExtraPercentage(amount, extra, isPercent = true) {
  let sum;
  if (isPercent) {
    sum = amount + amount * extra;
  } else {
    sum = amount + extra;
  }
  return sum;
}
```

ただ、ここで注意したいのが**税込み金額**の計算は`sum = amount + amount * extra`のみで行われるため、else ブロックの方は使用されません。そのため、税込み金額の計算としては else ブロック内のコードは冗長なものになります。
このようにして、関数が目的毎に分けられていない場合には、無駄な条件分岐等が追加され見づらいコードになってしまうのです。

DRY を適用させる前に、一度目的が同じかどうかを考え、目的が同じの場合のみ適用するように注意しましょう。

## DRY を適用するべき？

|              | 選択肢                |
| ------------ | --------------------- |
| 好きな色　　 | 1. 赤、2. 青、3. 緑   |
| 好きな食べ物 | 1. 肉、2. 魚、3. 野菜 |

このアンケートの入力バリデーションを行う関数を作成してみます。

```js
// 好きな色の選択値バリデーション（選択肢1~3）
function validateFavoriteColor(selected) {
  const min = 1;
  const max = 3;
  return min <= selected && selected <= max;
}

// 好きな食べ物の選択値バリデーション（選択肢1~3）
function validateFavoriteFood(selected) {
  const min = 1;
  const max = 3;
  return min <= selected && selected <= max;
}

validateFavoriteColor(1);
validateFavoriteFood(3);
```

上記のコードも共通部分が多く、DRY を適用しても良さそうに見えます。

### DRY 適用後

```js
// 選択値のバリデーション（選択肢1~3）
function validateChoice(selected) {
  const min = 1;
  const max = 3;
  return min <= selected && selected <= max;
}

// 好きな色の選択値バリデーション
validateChoice(1);

// 好きな食べ物の選択値バリデーション
validateChoice(3);
```

しかし、アンケートの内容が変更され、問いごとに必要なチェックが変わる可能性があります。
例えばどちらの問いだけ、「その他」を選べるような要件が追加になった場合、関数内で条件分岐が必要になります。

|              | 選択肢                                     |
| ------------ | ------------------------------------------ |
| 好きな色　　 | 1. 赤、2. 青、3. 緑                        |
| 好きな食べ物 | 1. 肉、2. 魚、3. 野菜、4. その他：[　　　] |

```js
// 選択値のバリデーション（選択肢1~3）
function validateChoice(min, max, selected, selectedOther, otherValue) {
  if (selectedOther && selected === max) {
    return otherValue.length ? true : false;
  }
  return min <= selected && selected <= max;
}

// 好きな色の選択値バリデーション
validateChoice(1, 3, 1, false, "");

// 好きな食べ物の選択値バリデーション
validateChoice(1, 4, 3, true, "ラーメン");
```

このようにした場合には将来各入力項目のチェックが大きくなった時に validateChoice のチェック内容が肥大化していきそうです。
そこで、個別のチェックを実装しやすいようにそれぞれのチェックはまた別で定義してあげます。

```js
// 好きな色の選択値バリデーション
function validateFavoriteColor(selected) {
  const min = 1;
  const max = 3;
  return validateChoice(min, max, selected, false, "");
}

// 好きな食べ物の選択値バリデーション
function validateFavoriteFood(selected, otherValue) {
  const min = 1;
  const max = 3;
  return validateChoice(min, max, selected, true, otherValue);
}

validateFavoriteColor(1);
validateFavoriteFood(3, "ラーメン");
```

こうすることによって各項目にチェックが追加されても、実装しやすいようになります。

### 練習問題

以下のコードについて、 DRY を適用すべきかどうか考えてみましょう。

#### 問 1

```js
const lastName = "やまだ";
const firstName = "たろう";

// 苗字をカタカナに変換する関数
function convertLastNameToKana(lastName) {
  return lastName.replace(/[\u3041-\u3096]/g, function (match) {
    var chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

// 名前をカタカナに変換する関数
function convertFirstNameToKana(firstName) {
  return firstName.replace(/[\u3041-\u3096]/g, function (match) {
    var chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

console.log(convertLastNameToKana(lastName));
console.log(convertFirstNameToKana(firstName));
```

#### 解答

「カタカナに変換する」という目的は同じであるため、適用すべき。

```js
const lastName = "やまだ";
const firstName = "たろう";

// カタカナに変換する関数
function convertToKana(text) {
  return text.replace(/[\u3041-\u3096]/g, function (match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

console.log(convertToKana(lastName));
console.log(convertToKana(firstName));
```

#### 問 2

```js
// たこ銀行から送金する場合
function transferMoneyFromTakoBank(deposit) {
  const commission = 100;
  updateDeposit(deposit, commission);
}

// いか銀行から送金する場合
function transferMoneyFromIkaBank(deposit) {
  const commission = 100;
  updateDeposit(deposit, commission);
}
```

#### 解答

たこ銀行といか銀行の手数料が同じ額なのは偶然のため適用すべきではありません。
将来的に銀行ごとに送金手数料が変わる可能性は大いにあります。

## 引数が多い場合はオブジェクトにまとめる

### Bad

```js
function storeUser(userId, name, age, hobby, birthday, thumbnail) {
  // ユーザー情報を保存
}

// どの引数に渡しているのかが明確でなく、引数の渡す順番によってコードの実行状況が変わる
storeUser(1, "Tom", 22, "Soccer", "/2020/08/tom.jpg");

// name と age が逆になっている
storeUser(1, 22, "Tom", "Soccer", "/2020/08/tom.jpg");
```

順番通りに指定する必要があり、間違えるとバグの温床になってしまいます。

### Good

```js
function storeUser(user) {
  // ユーザー情報を保存
}

const user = {
  userId: 1,
  name: "Tom",
  age: 22,
  hobby: "Soccer",
  thumbnail: "/2020/08/tom.jpg",
};

storeUser(user);
```

### Bad

```js
function moveObject(
  beforeX,
  beforeY,
  beforeZ,
  transitionX,
  transitionY,
  transitionZ,
  isAnimation
) {
  // do something
}

moveObject(1, 2, 3, 4, 5, 6, true);
```

引数がたくさんあり、指定順が正しいかどうかを 1 つ 1 つ確認するのが大変です。
以下のように変数に格納してから指定してみても引数の記述が非常に長く、可読性はそこまで上がりません。

```js
const beforeX = 1;
const beforeY = 2;
const beforeZ = 3;
const transitionX = 4;
const transitionY = 5;
const transitionZ = 6;
const isAnimation = false;

moveObject(
  beforeX,
  beforeY,
  beforeZ,
  transitionX,
  transitionY,
  transitionZ,
  isAnimation
);
```

### Good

```js
function moveObject(
  { beforeX, beforeY, beforeZ },
  { transitionX, transitionY, transitionZ },
  isAnimation
) {
  // do something
}

moveObject(
  { beforeX: 0, beforeY: 0, beforeZ: 0 },
  { transitionX: 0, transitionY: 0, transitionZ: 0 },
  true
);
```

```js
const beforePos = {
  beforeX: 1,
  beforeY: 2,
  beforeZ: 3,
};
const transitionPos = {
  transitionX: 4,
  transitionY: 5,
  transitionZ: 6,
};
const isAnimation = true;
moveObject(beforePos, transitionPos, isAnimation);
```

移動前の座標と移動する値、アニメーションの有無をそれぞれまとめて渡すことで、グループが明確になり、必要な引数が確認しやすいコードになります。

## 論理和で初期値を設定しない。デフォルト引数を使う。

関数の引数に初期値を設定する場合には論理和を使用せず、デフォルト引数を使うようにしましょう。

### Bad

```js
function drawSquare(color, size) {
  size = size || 100;
  render("square", size, color);
}
```

size に 0 が渡ってきたときにも 100 が設定される。

### Good

```js
function drawSquare(color, size = 100) {
  render("square", size, color);
}
```

デフォルト値を使用することで、意図しない挙動を防ぐことができます。

### Bad

```js
function createUser({ age, name, sns }) {
  const registerUser = {
    age: age || -1,
    name: name || "名無し",
    sns: sns || [],
  };
  db.user.create(registerUser);
}
```

### Good

```js
function createUser({ age = -1, name = "名無し", sns = [] } = {}) {
  const registerUser = { age, name, sns };
  db.user.create(registerUser);
}
```

### ポイント

このように、`||`を使用してしまうと、falsy な値が渡された場合にデフォルト値が適用されてしまうため、意図しない挙動になってしまう可能性があります。
初期値として使用する際には本当に適切かどうかを一度立ち止まって考えてみてください。

## 関数にフラグを渡さない

関数の引数に渡すフラグ（true、または false）の多くは、関数内の条件分岐に使用されます。
条件分岐は関数の処理を複雑にするため、なるべく関数にフラグを渡す記述は避けるようにしましょう。

### Bad

```js
async function getUser({ userId, isAdmin = false, isAllUser = false }) {
  // 全てのユーザーを取得
  if (isAllUser) {
    const response = await fetch("/users");
    const result = await response.json();
    return result;
  }
  if (isAdmin) {
    // 管理者を取得
    const body = {
      userId,
      secretKey: process.env.SECRET_KEY,
    };
    const response = await fetch("/admin-users", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const result = await response.json();
    return result;
  } else {
    // 一般ユーザーを取得
    const body = {
      userId,
    };
    const response = await fetch("/users", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const result = await response.json();
    return result;
  }
}
```

### Good

関数を分けることによって、関数内部の記述をシンプルに出来る。

```js
async function getAdminById(userId) {
  const body = {
    userId,
    secretKey: process.env.SECRET_KEY,
  };
  const response = await fetch("/admin-users", {
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return result;
}

async function getUserById(userId) {
  const body = {
    userId,
  };
  const response = await fetch("/users", {
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return result;
}

async function getAllUsers() {
  const response = await fetch("/users");
  const result = await response.json();
  return result;
}

// 呼び出し側コード
if (isAdmin) {
  getAdminById(userId);
  // 何らかの処理
} else {
  getUserById(userId);
  // 何らかの処理
}

getAllUsers();
```

## 関数は使用順に上から下に書く

参照元の関数の下に書くことによって、上から下にコードが読めるようになります。
ファイル内をあちこち行き来しなくて良いので可読性が向上します。
このように縦方向の記述を整えることを垂直フォーマットと呼びます。

### Bad

displayTasks で使用される関数の位置が散らばっているため、コードを読む際に追いにくくなってしまいます。

```js
function renderTask(task) {}

// その他の関数

function displayTasks(task) {
  if (isCompleted(task)) {
    renderTask(task);
  }
}

// その他の関数

function isCompleted(task) {}
```

### Good

```js
function displayTasks(task) {
  if (isCompleted(task)) {
    renderTask(task);
  }
}
function isCompleted(task) {}
function renderTask(task) {}
```

### Bad

```js
function changeLoadingState() {}
function main() {
  toggleMenu();
  changeLoadingState();
  toast("success!");
}
function toast(message, type = "normal") {}
function toggleMenu() {}
```

### Good

```js
function main() {
  toggleMenu();
  changeLoadingState();
  toast("success!");
}
function toggleMenu() {}
function changeLoadingState() {}
function toast(message, type = "normal") {}
```

### ポイント

読み手はファイルの上から下へ向かって目を通すことが多いです。
コードの流れも上から下へ流れていくように書いてあれば、それに従って素直に読み解くことができます。

変数や関数の定義を探す、元の位置に戻るなどの手間を省くことができとても読みやすいコードになるでしょう。

## 処理をグループ化して記載する

関心のある処理ごとに改行を入れることで、コードの可読性を上げることができます。

### Bad

```js
async function signup(username, email) {
  if (!isValid(username, email))
    throw new Error("usernameもしくはemailが正しくありません");
  const createUser = await db.user.create(username, email);
  setUser(createUser);
  goToHome(createUser);
}
```

### Good

```js
async function signup(username, email) {
  if (!isValid(username, email))
    throw new Error("usernameもしくはemailが正しくありません");

  const createdUser = await db.user.create(username, email);

  setUser(createdUser);
  goToHome(createdUser);
}
```

今回の関数は大きく 4 つのステップに分けることができます

1. if で Validation エラーなどがないかをチェック
2. データベースで user を新規登録している
3. 登録できたユーザー情報を state に格納している
4. 画面を遷移させる

今回は各処理が短いため、もう少し粒度を大きくして分類してみると 3 つに分けました。

1. 引数が正しいかのエラーチェック
2. ユーザー登録する
3. 登録後の後処理

### 処理をグループ化するメリット

- 視認性が向上し、プログラムの可読性が向上する。
- 処理が分散されるのを未然に防ぐことができる。

## フォーマッターを使用する

インデントを揃えたり、適切に空白文字を入れることによってコードを読みやすくする。
水平フォーマットと呼ぶ。

### Bad

```js
function oddEvenLoop(maxNumber) {
  if (maxNumber > 0) return;
  for (let i = 1; i <= maxNumber; i++) {
    if (i % 2 === 0) console.log("even");
    else console.log("odd");
  }
}
```

インデントや空白がないため、読みづらくなってしまっています。

### Good

```js
function oddEvenLoop(maxNumber) {
  if (maxNumber > 0) return;

  for (let i = 1; i <= maxNumber; i++) {
    if (i % 2 === 0) console.log("even");
    else console.log("odd");
  }
}
```

### ポイント

インデントや空白がないと視認性が著しく低下するのでコードフォーマッターなどを導入しインデントなどを揃えましょう！

JavaScript でよく使われるコードフォーマッター

- ESlint
- Prettier

## 【発展】参照透過性を保つ

読みやすい関数とはどういった関数でしょうか？
その一つのキーワードに**参照透過性**があります。
参照透過性とは**決まった入力（引数）**に対して**必ず決まった出力（戻り値）を返す**性質のことを指します。

例えば、次のような関数は参照透過ではありません。

```js
let b = 1;
function sum(a) {
  return a + b;
}
const result = sum(2);

console.log(result);
```

この場合には関数 sum の中から外部スコープの変数 b を参照しています。そのため、変数 b の値が変わると、関数 sum は同じ引数を渡して実行しても異なる実行結果が返ってきます。

### Bad

```js
let b = 1;
function sum(a) {
  return a + b;
}

const result1 = sum(2);
b = 2;
const result2 = sum(2);

console.log(result1, result2);
// > 3, 4
```

あなたが開発のチームメンバの一員で、参照透過性を持たない関数に出会った時を想像してみてください。
実際のシステム開発で遭遇するコードは上記のコードよりもずっと複雑です。
あなたは同じ引数を入れているにも関わらず、異なる結果を返す関数がどのような条件の時に値が変わるのかを読み解く必要があります。
あるいは、他のところで使っていないと思っていた値が実はある関数内で使用されていたため、修正漏れが発生する可能性が高まります。

### 練習問題

以下の関数（increment、decrement）を参照透過になるように修正してください。

```js
let count = 0;

function increment() {
  count++;
}
function decrement() {
  count--;
}

increment();
decrement();
increment();
increment();
console.log(count);
// > 2
```

#### 解答

```js
let count = 0;
// const BASE_COUNT = 10; // ※１
function increment(count) {
  count++;
  // count += BASE_COUNT; // ※１
  return count;
}
function decrement(count) {
  count--;
  return count;
}

count = increment(count);
count = decrement(count);
count = increment(count);
count = increment(count);
console.log(count);
// > 2

// ※１：定数の値は変わることはないので、レキシカルスコープから取得しても特に問題なし。
```

## 【発展】副作用を持つ関数はなるべく限定的にする

関数外の値や状態を更新するような処理は**副作用**といいます。
副作用には以下のような操作が挙げられます。

**例）副作用**

- 引数で渡ってきたオブジェクトの中身を書き換える
- 外部スコープの変数の値を変える
- コンソールへのログ出力
- DOM 操作
- サーバーとの通信
- タイマー処理
- ランダムな値の生成

関数が副作用を持つということは、その関数の実行が戻り値以外にも影響を与えていることを意味しています。
そのため、副作用をもつ関数がそこらしかに存在するとコードが追いずらくなってしまいます。

### Bad

```js
async function sendPostHandler() {
  const inputTitle = getUserInputTitle(); // ユーザーからの入力を取得（副作用）
  const inputBody = getUserInputBody(); // ユーザーからの入力を取得（副作用）

  // POST送信する際のデータを定義
  const sendData = {
    title: inputTitle,
    body: inputBody,
  };

  // 入力値のチェック（副作用でない）
  if (!validateTitle(sendData.title)) return;
  if (!validateBody(sendData.body)) return;

  // サーバーへのリクエスト（副作用）
  const response = await fetch("/blog-post", {
    method: "POST",
    body: JSON.stringify(sendData),
  });

  const result = await response.json();
}
```

### Good

```js
async function formSubmitHandler() {
  const sendData = getSendData();

  if (!validateForm(sendData)) return false;

  const result = await postBlog(sendData);
  return result;
}

function getSendData() {
  const inputTitle = getUserInputTitle();
  const inputBody = getUserInputBody();

  return {
    title: inputTitle,
    body: inputBody,
  };
}

// 参照透過性&副作用を保持できる関数を抽出できた！
function validateForm(sendData) {
  // 入力値のチェック（副作用でない）
  if (!validateTitle(sendData.title)) return false;
  if (!validateBody(sendData.body)) return false;
  return true;
}

async function postBlog(sendData) {
  const response = await fetch("/blog-post", {
    method: "POST",
    body: JSON.stringify(sendData),
  });
  const result = await response.json();

  // HTTPステータスコードが200番代以外の場合はエラーを発生させる
  if (result.status < 200 && 300 <= result.status) {
    throw new Error(result.message);
  }

  return result;
}
```

副作用を起こす操作はなるべく関数に抽出して、参照透過性を維持できる関数を増やせるように心掛けましょう。

先程紹介した通り、引数のオブジェクトの中身を書き換える操作は副作用の一つとなります。
引数の中身を書き換えることによって関数の処理を表現するとコードが追いづらくなってしまうため、なるべく避けるようにしましょう。

## 【発展】引数で渡ってきたオブジェクトの中身は書き換えない

引数で渡ってきたオブジェクトの中身を書き換える操作というのは副作用の一種となります。引数で渡ってきたオブジェクトの中身は書き換えず、なるべく戻り値で結果を返すようにしましょう。

### Bad

```js
const person = {
  name: "タロウ",
};

function updatePersonName(_person) {
  _person.name = "ジロウ"; // <- オブジェクトの中身を書き換える。
}

updatePersonName(person);

console.log(person.name);
// > ジロウ <- 引数として渡したpersonオブジェクトの中身も書き変わっている。
```

このように引数で渡したオブジェクト（仮引数）の中身を変更した場合、それは引数として渡したオブジェクト（実引数）にも影響を与えます。動作としては問題なく動きますが、このような書き方は直感的ではありません。
他の開発者が直感的にコードを読めるように、**引数には結果を得るために必要な値を設定し、戻り値でその結果の値を返却する**ようにしましょう。

### Good

```js
const person = {
  name: "タロウ",
};

function updatePersonName(_person) {
  // const newPerson = { ..._person };
  const newPerson = { name: "ジロウ" };

  return newPerson;
}

const newPerson = updatePersonName(person);

console.log(person.name, newPerson.name);
// > タロウ ジロウ
```

### ２つ目の例

配列の sort メソッドは配列の要素の順番を書き換えるメソッドです。

### Bad

```js
function sortDesc(itemIds) {
  itemIds.sort();
}
const itemIds = [4, 3, 2, 1];
sortDesc(itemIds);
console.log(itemIds); // [1, 2, 3, 4]
```

上記の例では、sortDesc の引数で渡した itemIds の値が書き変わっています。
このように引数で渡しただけなのに中身が変わるような関数は処理が追いづらくなります。

### Good

では、引数で渡した配列を変更することなく、ソートされた配列を新たに作成して、返却する関数を定義してみましょう。

```js
function sortDesc(itemIds) {
  // スプレット演算を使用し、配列を展開し別の配列を作成している。
  const newIds = [...itemIds];
  // or
  // slice()でも可。
  // const newIds = itemIds.slice();

  return newIds.sort();
}
const itemIds = [4, 3, 2, 1];
const sortedIds = sortDesc(itemIds);
console.log(itemIds); // [4, 3, 2, 1]
console.log(sortedIds); // [1, 2, 3, 4]
```

このように `[...itemIds]`、または`itemIds.slice()`を使うことで、配列を新しく複製して引数で渡ってきた配列に影響を与えないような処理を記述することができます。

## 【発展】関数は純粋関数としてなるべく定義する

これまで見てきた**参照透過性の保持**と**副作用のない**関数のことを**純粋関数**と呼びます。副作用が発生する操作に関しては特定の場所にまとめるようなルールとすることで、コードが整理しやすくなります。
つまり、関数はなるべく純粋関数として定義し、副作用が発生する操作はなるべくひとまとまりにすることによって、それ以外の処理（純粋関数で記述した処理）の動作安定性を向上させることができます。

### Bad

```js
initUserPage();
async function initUserPage() {
  // サーバーからデータ取得
  const response = await fetch("/users", {
    method: "GET",
    body: JSON.stringify(body),
  });
  const user = await response.json();

  // ユーザーページを組み立てる処理（純粋関数）
  const userPageHtml = `
    <h2>名前：${user.name}</h2>
    <h2>年齢：${user.age}</h2>
  `;

  // DOMの更新を行い、画面反映を行う処理（純粋関数でない）
  const containerEl = getContainerElement();
  containerEl.innerHTML = userPageHtml;
}
```

### Good

```js
// ユーザーページを表示する処理
initUserPage();
function initUserPage() {
  const user = await fetchUser();
  const userPageHtml = buildUserPage(user);
  updateDOM(userPageHtml);
}

// データを取得する操作（純粋関数でない）
async function fetchUser() {
  // サーバーからデータ取得
  return user;
}
// ユーザーページを組み立てる処理（純粋関数）
function buildUserPage(user) {
  return userPageHtml;
}
// DOMの更新を行い、画面反映を行う処理（純粋関数でない）
function updateDOM(userPageHtml) {
}

```

このようにすることで、`buildUserPage`の処理に関しては純粋関数で定義できることになるため、この部分に関してはテストコードを記述することが可能になり動作安定性が増すことになります。

### 純粋関数であることでのメリット

1. 外部の状態に依存しないので、リファクタリングや拡張がしやすい
2. スコープ外の値に影響を及ぼさないため、デグレードが発生しづらい
3. テストコードが記述できる（特定の入力に対して特定の出力が行われるかテスト可能となる）

純粋でない関数の場合、関数の外部との繋がりが強くなりスコープ外の変数の値や状態まで追っていかなければなりません。

修正や追加をする際の影響、テストのしにくさを考えると関数はなるべく純粋に保つのが良いでしょう。

## 練習問題

次のコードを純粋関数に修正して、１秒後にアルファベット順に名前が出力されるようにしてみてください。

### Bad

```js
const nameList = ["Bob", "Alice", "Mike", "John", "Tom", "Ken"];

// アルファベット順にソート
function sortAlphabet() {
  nameList.sort();
  return nameList;
}

// 文字数が小さい順にソート
function sortWordCount() {
  nameList.sort((a, b) => a.length - b.length);
  return nameList;
}

function getThreeNames() {
  return nameList.slice(0, 3);
}

sortAlphabet();

setTimeout(() => {
  const names = getThreeNames();
  console.log(names); // <- アルファベット順に並べた配列から3人目までの名前を取得したい
}, 1000);

sortWordCount();
```

コードの記述を見ると、

```
アルファベット順に並び替え → 1秒後に3人の名前を取得 → 文字数が少ない順に並び替え
```

という順番で処理が流れるように思えます。

この時、`getThreeNames`が発火した時、期待通りの配列を取得できるでしょうか？

実際には、このコードでは文字数が少ない順に値が取得されました。

それは setTimeout が非同期関数のため、1 秒待機の間も処理は止まらず先に `sortWordCount` が走ってしまうためです。

### Good

ではこれを純粋関数として変更してみましょう。

```js
const nameList = ["Bob", "Alice", "Mike", "John", "Tom", "Ken"];

// アルファベット順にソート
function sortAlphabet(nameList) {
  const newList = [...nameList];
  newList.sort();
  return newList;
}

// 文字数が小さい順にソート
function sortWordCount(nameList) {
  const newList = [...nameList];
  newList.sort((a, b) => a.length - b.length);
  return newList;
}

function getThreeNames(nameList) {
  return nameList.slice(0, 3);
}

const sortedNamesAlpha = sortAlphabet(nameList);

setTimeout(() => {
  const names = getThreeNames(sortedNamesAlpha);
  console.log(names); // <- アルファベット順に並べた配列から3人目までの名前を取得したい
}, 1000);

const sortedNamesWCount = sortWordCount(sortedNamesAlpha);
// 結果：['Alice', 'Bob', 'John']
```

このようにした場合には、nameList に対する変更は加わらないため、アルファベット順にソートされた値で配列を取得することができるようになります。
