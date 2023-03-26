# 条件分岐

## ポイント

- ポイント A. 条件式を伝わりやすくする

  - 境界条件を変数として定義する
  - 条件式を関数として取り出す
  - 定数を左辺に配置する

- ポイント B. 読み手の負担を減らす！

  - 最も一般的なケースを最初に評価する
  - 早期 return を使う
  - ネストを深くしない

- ポイント C. if 文は最後の手段であることを心得る！
  - if 文の前にコールバック関数やクラスの利用を検討する

## 条件分岐はあちこちで書かない

条件分岐が散らばっていては、仕様が変更された際にどこを修正するべきなのか、どこまで影響範囲が広いのか予測が難しくなります。
同じ条件分岐はあちこちで書かないようにしましょう。

### Bad

```js
const skills = [
  "たいあたり",
  "でんこうせっか",
  "アイアンテール",
  "10まんボルト",
  "かみなり",
];

function getAttackPoint(skill) {
  switch (skill) {
    case "アイアンテール":
      return 30;
    case "10まんボルト":
      return 100;
    case "かみなり":
      return 1000;
    default:
      return 0;
  }
}

function getHp(skill, currentHp) {
  let attackPoint;
  if (skill === "たいあたり") {
    attackPoint = 10;
  } else if (skill === "でんこうせっか") {
    attackPoint = 20;
  } else {
    attackPoint = getAttackPoint(skill);
  }
  return currentHp - attackPoint;
}
```

### Good

```js
const skills = [
  "たいあたり",
  "でんこうせっか",
  "アイアンテール",
  "10まんボルト",
  "かみなり",
];

function getAttackPoint(skill) {
  switch (skill) {
    case "たいあたり":
      return 10;
    case "でんこうせっか":
      return 20;
    case "アイアンテール":
      return 30;
    case "10まんボルト":
      return 100;
    case "かみなり":
      return 1000;
    default:
      return 0;
  }
}

function getHp(skill, currentHp) {
  const attackPoint = getAttackPoint(skill);
  return currentHp - attackPoint;
}
```

### Bad

```js
function chooseContinent(code) {
  switch (code) {
    case "AS":
      console.log("アジアを選択しました");
      break;
    case "EU":
      console.log("ヨーロッパを選択しました");
      break;
    case "NA":
      console.log("北アメリカを選択しました");
      break;
    default:
      console.log("その他を選択しました");
      break;
  }
}

function decideContinent(code) {
  switch (code) {
    case "AS":
      console.log("アジアに決定しました");
      break;
    case "EU":
      console.log("ヨーロッパに決定しました");
      break;
    case "NA":
      console.log("北アメリカに決定しました");
      break;
    default:
      console.log("その他に決定しました");
      break;
  }
}
```

### Good

```js
function getContinentName(code) {
  switch (code) {
    case "AS":
      return "アジア";
    case "EU":
      return "ヨーロッパ";
    case "NA":
      return "北アメリカ";
    default:
      return "その他";
  }
}

function chooseContinent(code) {
  const continent = getContinentName(code);
  console.log(`${continent}を選択しました`);
}

function decideContinent(code) {
  const continent = getContinentName(code);
  console.log(`${continent}に決定しました`);
}
```

## 厳密な等価性で評価する

JavaScript の比較演算子は 2 種類あり、等価演算子(==)と厳密等価演算子(===)があります。

- 等価演算子
  - 一定のルールの下暗黙的な型変換が行われてから比較される
- 厳密等価演算子
  - 型変換が行われずに比較がされる

つまり、型変換のない厳密等価演算子を使用することで、意図しないバグを防ぐことができます。

### Bad

```js
if ("hello" == true) {
}
if ("12" == 10 + 2) {
}
if (0 == false) {
}

const date = new Date(2022, 1, 1);
const dateString = "Tue Feb 01 2022 00:00:00 GMT+0900 (日本標準時)";
if (date == dateString) {
}
```

比較前に同じ型に変換され、全て true になってしまいます。

- 数値と文字列の比較
  - 文字列を数値に変換
- 一方が論理値の場合
  - true は 1、 false は 0 に変換
- 一方がオブジェクト、もう一方が数値 or 文字列
  - オブジェクトの `valueOf()`, `toString()` メソッドを使用してプリミティブに変換

### Good

```js
if ("hello" === true) {
}
if ("12" === 10 + 2) {
}
if (0 === false) {
}

const date = new Date(2022, 1, 1);
const dateString = "Tue Feb 01 2022 00:00:00 GMT+0900 (日本標準時)";
if (date === dateString) {
}
```

型レベルまで比較がされるので全て false になります。

### Bad

```js
// getUserInput は"20"という文字列が返却されるものとする
const userInputNumber = getUserInput();

// 数字の20ではなく、文字列の"20"が格納されていると仮定する
// "20" == 20 となり true になる
if (userInputNumber == 20) {
  console.log(userInputNumber + userInputNumber);
  // > 2020
  // と表示されてしまう
}
```

### Good

```js
const userInputNumber = getUserInput();

// "20" == 20 となり false になる
if (userInputNumber === 20) {
  console.log(userInputNumber + userInputNumber);
}
```

ユーザーが 20 と入力した場合でも console に何も表示されないため、バグに気付くでしょう。
`userInputNumber`の戻り値が `string` であることにすぐ気がつき、型を Number 型に変換することでバグを解消することができます。

## 最も一般的な条件から評価する

if 文の条件式は最も一般的な評価（最頻値）から記述するようにしましょう。
頻繁に行われる処理を前に記述することで読み手の負担が軽減されます。

### Bad

```js
const user = getCurrentUser();
if (isPremium(user)) {
  // プレミアムアカウントの処理
} else if (isAdmin(user)) {
  // 管理者アカウントの処理
} else if (isFree(user)) {
  // 通常アカウントの処理
} else {
  throw new Error("ユーザーの種類が不明です");
}
```

`通常アカウント` → `プレミアムアカウント` → `管理者アカウント` の順番でユーザー数が多いと仮定します。
この場合、通常アカウントの処理が最も頻繁に行われるため、最初に評価するように記述することで読み手の負担が軽減されます。

### Good

```js
const user = getCurrentUser();
if (isFree(user)) {
  // user が通常ユーザーだった場合、この部分を読むだけでよい。
  // 通常アカウントの処理
} else if (isPremium(user)) {
  // プレミアムアカウントの処理
} else if (isAdmin(user)) {
  // 管理者アカウントの処理
} else {
  throw new Error("ユーザーの種類が不明です");
}
```

### Bad

```js
const populationCounter = {
  working: 0,
  youth: 0,
  old: 0,
};

if (age >= 15 && age < 65) {
  populationCounter.working += 1;
} else if (age >= 65) {
  populationCounter.old += 1;
} else {
  populationCounter.youth += 1;
}
```

確かに生産年齢人口の割合が一番大きいのですが、分岐の条件が追いづらくなってしまいます。
このように数値で区分されている場合には、無理に一般的な評価から分岐させていく必要はありません。

### Good

```js
const populationCounter = {
  working: 0,
  youth: 0,
  old: 0,
};

if (age < 15) {
  populationCounter.youth += 1;
} else if (age < 65) {
  populationCounter.working += 1;
} else {
  populationCounter.old += 1;
}
```

## 境界条件のカプセル化

境界条件に使用している値を適切に変数で置換することによって、コードの見通しを良くすることができます。

### Bad

```js
const squareNum = 1;

// 一つの四角形を構成する点の数
if (squareNum * 4 <= 100) {
  console.log(`四角形の頂点の数は100以下です。`);
} else {
  console.log(`四角形の頂点の数は100より大きいです。`);
}
```

### Good

```js
const squareNum = 1;

// 一つの四角形を構成する点の数
const dotsPerSquare = squareNum * 4;
if (dotsPerSquare <= 100) {
  console.log(`四角形の頂点の数は100以下です。`);
} else {
  console.log(`四角形の頂点の数は100より大きいです。`);
}
```

Three.js のライブラリの中などでも境界条件のカプセル化が使用されています。

```js
// @see https://github.com/mrdoob/three.js/blob/dev/src/geometries/PlaneGeometry.js
import { BufferGeometry } from "../core/BufferGeometry.js";
import { Float32BufferAttribute } from "../core/BufferAttribute.js";

class PlaneGeometry extends BufferGeometry {
  constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    super();
    this.type = "PlaneGeometry";

    this.parameters = {
      width: width,
      height: height,
      widthSegments: widthSegments,
      heightSegments: heightSegments,
    };

    const width_half = width / 2;
    const height_half = height / 2;

    const gridX = Math.floor(widthSegments);
    const gridY = Math.floor(heightSegments);

    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;

    const segment_width = width / gridX;
    const segment_height = height / gridY;

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segment_height - height_half;

      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segment_width - width_half;

        vertices.push(x, -y, 0);

        normals.push(0, 0, 1);

        uvs.push(ix / gridX);
        uvs.push(1 - iy / gridY);
      }
    }

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX1 * iy;
        const b = ix + gridX1 * (iy + 1);
        const c = ix + 1 + gridX1 * (iy + 1);
        const d = ix + 1 + gridX1 * iy;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.setIndex(indices);
    this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }

  static fromJSON(data) {
    return new PlaneGeometry(
      data.width,
      data.height,
      data.widthSegments,
      data.heightSegments
    );
  }
}

export { PlaneGeometry, PlaneGeometry as PlaneBufferGeometry };
```

## 複雑な条件式は関数に切り出す

複雑な条件式を見かけた際は関数にまとめることを検討してみましょう。
if 文の条件式が見やすくなり、実装のミスを減らすことができます。

### Bad

```js
if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
  // 処理
}
```

### Good

```js
function isInFrame(x, y) {
  return x >= 0 && x <= 100 && y >= 0 && y <= 100;
}

if (isInFrame(x, y)) {
  // 処理
}
```

### Bad

```js
const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
if (regex.test(text)) {
  console.log("4バイトの絵文字が含まれています");
}
```

### Good

```js
function isIncludeEmoji(text) {
  const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  return regex.test(text);
}

if (isIncludeEmoji(text)) {
  console.log("4バイトの絵文字が含まれています");
}
```

### Bad

```js
if (gender === "male" && (age === 25 || age === 42 || age === 61)) {
  console.log("厄年です");
} else if (
  gender === "female" &&
  (age === 19 || age === 33 || age === 37 || age === 61)
) {
  console.log("厄年です");
}
```

### Good

```js
function isUnluckyYear(age, gender) {
  const UNLUCKY_YEAR = {
    male: [25, 42, 61],
    female: [19, 33, 37, 61],
  };
  return UNLUCKY_YEAR[gender].find((num) => num === age);
}

if (isUnluckyYear(age, gender)) {
  console.log("厄年です");
}
```

## 定数を左辺に配置する

比較処理と代入処理の誤用によるバグを防ぐために、定数を左辺に配置することで意図しない代入を防ぎます。
`ヨーダ条件式` / `Left-hand comparisons` などと呼ばれます。

### Bad

```js
if (value === 10) // 厳密比較
if (value == 10) // 型変換あり
if (value = 10) // 代入
```

代入が行われてもエラーにはならないので、バグの原因になります。

### Good

```js
if ( 10 === value )
if ( 10 == value )
if ( 10 = value ) // エラー
```

### Bad

```js
const MAX_LEVEL = 100;
if (level === MAX_LEVEL) {
  level = 1;
}
```

### Good

```js
const MAX_LEVEL = 100;
if (MAX_LEVEL === level) {
  level = 1;
}
```

### Bad

```js
if (getPost().getInput("title").toString() !== "") {
}
```

### Good

```js
if ("" !== getPost().getInput("title").toString()) {
}
```

比較対象の変数が長い場合は定数を先に記述することで，結論から知ることができ読みやすくなります。

## switch 文よりも連想配列（オブジェクト）を利用する

同じような処理を switch 文で書くと冗長な記述が増えてしまうため、連想配列でまとめられないか検討してみましょう。

### Bad

```js
function getEmailContent(fullname) {
  return `${fullname} 様、こんにちは。○○サービスにようこそ。`;
}

function sendInviteEmail(loginEmail) {
  let emailContent;

  switch (loginEmail) {
    case "js-taro@example.com":
      emailContent = getEmailContent("JS タロウ");
      sendEmail("js-taro@example.com", emailContent);
      break;

    case "python-taro@example.com":
      emailContent = getEmailContent("PYTHON タロウ");
      sendEmail("python-taro@example.com", emailContent);
      break;

    case "java-taro@example.com":
      emailContent = getEmailContent("JAVA タロウ");
      sendEmail("java-taro@example.com", emailContent);
  }
}

sendInviteEmail("js-taro@example.com");
```

### Good

オブジェクトなどの連想配列（キーと値が対で格納される配列）を使うと、switch 文による条件分岐をコード内から取り除くことができます。

```js
function getEmailContent(fullname) {
  return `${fullname} 様、こんにちは。○○サービスにようこそ。`;
}

const EMAIL_LIST = {
  "js-taro@example.com": "JS タロウ",
  "python-taro@example.com": "PYTHON タロウ",
  "java-taro@example.com": "JAVA タロウ",
};

function sendInviteEmail(loginEmail) {
  const fullname = EMAIL_LIST[loginEmail];
  let emailContent = getEmailContent(fullname);
  sendEmail(loginEmail, emailContent);
}
```

### 練習問題

以下のコードをリファクタリングしてみましょう。

```js
function getAreaName(areaCode) {
  switch (areaCode) {
    case 1:
      return "千代田区";
    case 2:
      return "中央区";
    case 3:
      return "港区";
    case 4:
      return "新宿区";
    default:
      return "他の区";
  }
}
```

#### 解答

```js
const AREA_CODE = {
  1: "千代田区",
  2: "中央区",
  3: "港区",
  4: "新宿区",
};

function getAreaName(areaCode) {
  return AREA_CODE[areaCode] || "他の区";
}
```

## 早期 return を使う

早期 return（Guards 節とも言う） とは、関数の先頭で条件分岐を行い、条件に合わない場合は早期に関数を終了させることです。
終了の方法は 2 種類あり、1 つは return で関数を終了させる方法、もう 1 つは throw` で例外を発生させる方法です。

### 使用するメリット

- 無駄なコードを読む必要がなくなる
- if 文のネストを減らすことができる

### Bad

関数の実行結果が何になるのか見ないといけないので、関数の一番最後まで見る必要があります。
if ブロックがどこまで続いているのか見るのが面倒に感じてしまうでしょう。

```js
async function getUserById(userId) {
  if (typeof userId === "number" && userId > 0) {
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
  return {};
}
```

### Good

早期 return を使うことで、ユーザーが取れてこなかった場合には一番最初の処理だけ見れば良くなります。

```js
async function getUserById(userId) {
  if (!(typeof userId === "number" && userId > 0)) return {}; // ここで関数の返す値が分かるのでそれ以降見る必要なし！

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
```

### Bad

```js
const ADULT_MIN_AGE = 18;

function isAdult(age) {
  if (typeof age !== "number") {
    throw new Error("年齢は数値で指定してください");
  } else if (age < 0) {
    throw new Error("年齢は 0 以上である必要があります");
  } else if (age >= ADULT_MIN_AGE) {
    return true;
  } else {
    return false;
  }
}
```

### Good

```js
const ADULT_MIN_AGE = 18;
function isAdult(age) {
  if (typeof age !== "number") throw new Error("年齢は数値で指定してください");
  if (age < 0) throw new Error("年齢は 0 以上である必要があります");
  return age >= ADULT_MIN_AGE;
}
```

`else if`と`else`を使わないことで視認性が上がりました。

早期 return を使うことで，読みやすいコードになりました。

### 練習問題

以下の関数を早期 return を使って書き直してみましょう！

```js
// 問1
function getUserName(user) {
  let username = "";
  if (user !== undefined) {
    username = user.name;
  } else {
    username = "名無し";
  }
  return username;
}

// 問2. 1~30までの数字のうち、素数の場合は true を、そうでない場合は false を返す関数を作成してください。
function isPrimeNumber(n) {
  if (n > 2) {
    for (let i = 2; i < n; i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  } else if (n === 2) {
    return true;
  } else if (n === 1) {
    return false;
  }
}

for (let i = 1; i <= 30; i++) {
  console.log(i, isPrimeNumber(i));
}
```

#### 解答

```js
// 問1
function getUserName(user) {
  if (user === undefined) return "名無し";
  return user.name;
}

// 問2
function isPrimeNumber(n) {
  if (n === 1) return false;
  if (n === 2) return true;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}
```

## ネストを防ぐ

ネストが深ければ深いほど、コードは読みづらく追いづらいものとなってしまいます。
その結果仕様を見落としたり、バグを埋め込んでしまう可能性が高まります。

### Bad

```js
function isActiveUser(user) {
  if (user != null) {
    if (
      user.startDate <= today &&
      (user.endDate == null || today <= user.endDate)
    ) {
      if (user.stopped) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
```

ネストが深く、1 つ 1 つの条件分岐を読むのが大変ですね。

### Good

```js
function isActiveUser(user) {
  if (user === null) return false;
  if (user.startDate > today) return false;
  if (!(user.endDate == null || today <= user.endDate)) return false;
  if (user.stopped) return false;
  return true;
}
```

早期 return を使用することで読みやすくなりました！

### 練習問題

早期 return でネストを解消しましょう！

```js
function isCorrectInput(member) {
  if (member.id) {
    if (member.name) {
      if (member.age) {
        if (member.email) {
          return true;
        } else {
          console.error("メールアドレスが入力されていません");
          return false;
        }
      } else {
        console.error("年齢が入力されていません");
        return false;
      }
    } else {
      console.error("名前が入力されていません");
      return false;
    }
  } else {
    console.error("idがありません");
    return false;
  }
}

const profile = {
  id: 1,
  name: "John",
  age: 20,
  email: "",
};
isCorrectInput(profile);
```

#### 解答

```js
function isCorrectInput(member) {
  if (!member.id) {
    console.error("idがありません");
    return false;
  }
  if (!member.name) {
    console.error("名前が入力されていません");
    return false;
  }
  if (!member.age) {
    console.error("年齢が入力されていません");
    return false;
  }
  if (!member.email) {
    console.error("メールアドレスが入力されていません");
    return false;
  }
  return true;
}

const profile = {
  id: 1,
  name: "John",
  age: 20,
  email: "",
};
isCorrectInput(profile);
```

## 【発展】if 文よりもコールバック、クラスを使用する

if 文が関数内に存在するということはその分プログラムの実行パターンが増えることを意味します。
条件分岐が発生すればするほど、コードの実行は追いづらくなり、考慮しなければならいケースが増えるため、if 文や switch 文はなるべくプログラム中に書かないようにしましょう。
if 文を取り除く代表的な方法にコールバック関数の利用やクラスの利用が挙げられます。

### Bad

```js
function updateUsername(data, db) {
  /* ユーザー名の更新処理 */
}

function updatePassword(data, db) {
  /* パスワードの更新処理 */
}

function executeQuery(type, data) {
  const db = getDBConnection();
  db.startTransaction();

  if (type === "username") {
    updateUsername(data, db);
  } else if (type === "password") {
    updatePassword(data, db);
  }

  db.endTransaction();
}

// ユーザー名の更新
executeQuery("username", { userId: 1, userName: "Tom" });

// ユーザーパスワードの更新
executeQuery("password", { userId: 1, password: "fewatewaq" });
```

### Good

```js
function updateUsername(data, db) {
  /* ユーザー名の更新処理 */
}

function updatePassword(data, db) {
  /* パスワードの更新処理 */
}

function executeQuery(updateQuery, data) {
  const db = getDBConnection();
  db.startTransaction();

  updateQuery(data, db);

  db.endTransaction();
}

// ユーザー名の更新
executeQuery(updateUsername, { userId: 1, userName: "Tom" });

// ユーザーパスワードの更新
executeQuery(updatePassword, { userId: 1, password: "fewatewaq" });
```

処理が必要な場合は関数を使用する際にコールバック関数を渡すようにすると、関数の役割が明確になり、可読性が上がります。

### Bad

actAnimal 内に if 文が存在しています。

```js
class Dog {
  eat() {
    console.log("ドッグフードを食べる");
  }
  sleep() {
    console.log("小屋で寝る");
  }
}
class Cat {
  eat() {
    console.log("キャットフードを食べる");
  }
  sleep() {
    console.log("ソファーで寝る");
  }
}
function actAnimal(animalType) {
  if (animalType === "dog") {
    const dog = new Dog();
    dog.eat();
    dog.sleep();
  } else if (animalType === "cat") {
    const cat = new Cat();
    cat.eat();
    cat.sleep();
  }
}
actAnimal("dog");
actAnimal("cat");
```

### Good

次のように記載すると if 分が actAnimal 内から消えました！

```js
class Animal {
  eat() {
    throw new Error("eat メソッドを実装してください。");
  }
  sleep() {
    throw new Error("sleep メソッドを実装してください。");
  }
}
class Dog extends Animal {
  eat() {
    console.log("ドッグフードを食べる");
  }
  sleep() {
    console.log("小屋で寝る");
  }
}
class Cat extends Animal {
  eat() {
    console.log("キャットフードを食べる");
  }
  sleep() {
    console.log("ソファーで寝る");
  }
}
function actAnimal(animal) {
  animal.eat();
  animal.sleep();
}
const dog = new Dog();
actAnimal(dog);
const cat = new Cat();
actAnimal(cat);
```

### 練習問題

以下のコードの if 文はどうすればなくせるか考えてみましょう。

#### 問 1

```js
function createVegetableText(name) {
  return `${name}は洗って皮を剥き、食べやすい大きさにカットします。`;
}
function createFruitText(name) {
  return `${name}は皮を剥いてお皿に盛り付けます。`;
}
function createMeatText(name) {
  return `${name}は一口大に切り、炒めます。`;
}

// 食材のタイプ別に処理方法を取得する
function getRecipe(ingredient) {
  if (ingredient.type === "vegetable") {
    return createVegetableText(ingredient.name);
  } else if (ingredient.type === "fruit") {
    return createFruitText(ingredient.name);
  } else if (ingredient.type === "meat") {
    return createMeatText(ingredient.name);
  }
}

const recipes = [];
recipes.push(getRecipe({ type: "vegetable", name: "にんじん" }));
recipes.push(getRecipe({ type: "fruit", name: "ぶどう" }));
recipes.push(getRecipe({ type: "meat", name: "鶏肉" }));
console.log(recipes);
```

#### 解答

```js
function createVegetableText(name) {
  return `${name}は洗って皮を剥き、食べやすい大きさにカットします。`;
}
function createFruitText(name) {
  return `${name}は皮を剥いてお皿に盛り付けます。`;
}
function createMeatText(name) {
  return `${name}は一口大に切り、炒めます。`;
}

function getRecipe(ingredient, createText) {
  return createText(ingredient.name);
}

const recipes = [];
recipes.push(
  getRecipe({ type: "vegetable", name: "にんじん" }, createVegetableText)
);
recipes.push(getRecipe({ type: "fruit", name: "ぶどう" }, createFruitText));
recipes.push(getRecipe({ type: "meat", name: "鶏肉" }, createMeatText));
console.log(recipes);
```

#### 解答（別解）

```js
function createVegetableText(name) {
  return `${name}は洗って皮を剥き、食べやすい大きさにカットします。`;
}
function createFruitText(name) {
  return `${name}は皮を剥いてお皿に盛り付けます。`;
}
function createMeatText(name) {
  return `${name}は一口大に切り、炒めます。`;
}

// 食材のタイプ別に処理方法を取得する
function getRecipe(ingredient) {
  return ingredient.createText(ingredient.name);
}

const recipes = [];
class Ingredient {
  constructor(name, createText) {
    this.name = name;
    this.createText = createText;
  }
}
const vegetable = new Ingredient("にんじん", createVegetableText);
const fruit = new Ingredient("ぶどう", createFruitText);
const meat = new Ingredient("鶏肉", createMeatText);
recipes.push(getRecipe(vegetable));
recipes.push(getRecipe(fruit));
recipes.push(getRecipe(meat));
console.log(recipes);
```

#### 問 2

```js
class Slime {
  getBattlePowerWords() {
    return "スライムの戦闘力は10です。";
  }
  defense() {
    return "スライムは攻撃を避けた！";
  }
}

class Dragon {
  getBattlePowerWords() {
    return "ドラゴンの戦闘力は53万です。";
  }
  defense() {
    return "ドラゴンはダメージを受けない！";
  }
}

function actMonster(monster) {
  if (monster === "slime") {
    const slime = new Slime();
    console.log(slime.getBattlePowerWords());
    console.log(slime.defense());
  } else if (monster === "dragon") {
    const dragon = new Dragon();
    console.log(dragon.getBattlePowerWords());
    console.log(dragon.defense());
  }
}

actMonster("slime");
actMonster("dragon");
```

#### 解答

```js
class Monster {
  getBattlePowerWords() {
    throw new Error("getBattlePowerWords を実装してください。");
  }
  defense() {
    throw new Error("defense を実装してください。");
  }
}

class Slime {
  getBattlePowerWords() {
    return "スライムの戦闘力は10です。";
  }
  defense() {
    return "スライムは攻撃を避けた！";
  }
}

class Dragon {
  getBattlePowerWords() {
    return "ドラゴンの戦闘力は53万です。";
  }
  defense() {
    return "ドラゴンはダメージを受けない！";
  }
}

function actMonster(Monster) {
  const monster = new Monster();
  console.log(monster.getBattlePowerWords());
  console.log(monster.defense());
}

actMonster(Slime);
actMonster(Dragon);
```
