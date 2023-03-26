# コメント

## コメントはなぜ必要なのか

コードで書き手の考えを全て表現できるのであれば、コメントは不要ですしコメントを読む時間も画面領域も省略できます。
なんの情報も持たないコメント、誤情報を含むコメントは読み手にとっては有害になり得ます。
「価値のあるコメント」と「価値のないコメント」の違いを考えていきましょう。

### コードにコメントが必要な場面

- コードでうまく表現できない場合に、それを補うとき
- 読み手に意味や意図、考えを伝えるとき
- 覚え書きや注意を促すとき（TODO、FIXME、NOTE・・・）

### コメントのデメリット

- コメントはコードではないため、書いてあることが絶対的に正しいとは限らない。（嘘が混ざっている可能性がある）
- メンテナンスがめんどくさい。
- コードが見づらいことをコメントで解決することは根本的な解決にならない。

### ポイント

コメントは最小限にし、コードで解決できる部分はコードを直すのが原則です。
コメントを書く時には、それが本当に必要か？正しいことを書いているか？を意識しましょう。
コメントが必要になるときはそもそも関数などが大きくなりすぎている可能性があります。コメントなしでも理解できるサイズに分割できないか検討してみましょう。

## コードで意図を表す

本来はコメントではなく、コードで意図を表せることがベストです。
ただコードではうまく説明ができない場面は確かにあります。
そのような場面では、自分の考えや理由を伝えるためのコメントであれば読み手に付加情報を与える有益なものとなるでしょう。

### Bad

```js
// 未成年ならtrueを返す
function getBoolean(num) {
  return num < 18;
}
```

### Good

変数名、関数名を変えれば関数の意味がわかる。

```js
function isNotAdult(age) {
  return age < 18;
}
```

### Bad

```js
// 配列内の数字を2倍にした配列を返す
function calc(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i];
    result[i] = a * 2;
  }
  return result;
}
```

### Good

```js
function double(array) {
  return array.map(function (item) {
    return item * 2;
  });
}
```

## あたり前のことは書かない

コメントを読むのにも時間がかかります。
なんの付加情報も持たないコメントが書かれていれば、読み手の時間を無駄に奪ってしまうことになるので、コードから読みとれるような内容のコメントは書かないようにしましょう。

### Bad

```js
const name = "Steven Paul Jobs"; // スティーブ・ジョブズ
```

```js
// スコアが80より大きい時
if(score > 80){
  ...
}
```

```js
// 10回ループさせる
for (var i = 0; i < 10; i++) {
  array.push(i);
}
```

### ポイント

誰が見ても明白なことは書く必要はありません。
むしろコメントが処理内容と食い違っていた時に読み手に混乱を与えます。
（e.g. 「より」ではなく「以上」と書かれている）

## 悪いコメント

1. なんの付加情報ももたらさない意味のないコメント
2. 冗長なコメント
3. 形式的なコメント
   - メンバ、プロパティ一つ一つへのコメントなど
4. コメントアウトされたコード
5. 位置取りのための強調コメント
   - 場合によっては追加可能
   - 他の場所への誘導。使用上の注意点など
6. 改修履歴コメント
7. バージョン管理のためのコメント
   - バージョン管理システムで管理しましょう

```js
// タイプ  --- ①
const type = {
  ADD: "ADD", // 追加  --- ①,③
  REMOVE: "REMOVE", // 削除  --- ①,③
  UPDATE: "UPDATE", // 更新  --- ①,③
  CLEAR: "CLEAR", // クリア  --- ①,③
};

// トリガー関数  --- ①
function trigger(payload, oldValue) {
  const { action, value, callback } = payload;
  let newValue = [];

  // ======================================================
  // アクションタイプ別に処理を実行  --- ⑤
  // ======================================================
  if (type.CLEAR === action) {
    // クリア  --- ①,③
    newValue = [];
  } else if (type.REMOVE === action) {
    // 削除  --- ①,③
    newValue = oldValue.filter((item) => item.key !== key);
  } else {
    // 2022/10/1 fix by @yamada_hanako  --- ⑦
    value.title = value.title.replace(/\r?\n|\r|\s/g, "");
    value.description = value.description.replace(/\r?\n|\r|\s/g, "");

    switch (action) {
      case type.ADD: // 追加  --- ①,③
        newValue = [...oldValue, value];
        break;
      case type.UPDATE: // 更新  --- ①,③
        // 2022/01/01 サービス追加改善対応  --- ⑥
        for (let i = 0; i < newValue.length; i++) {
          if (newValue[i].key === value.key) {
            newValue[i] = value;
            break;
          }
        }
        break;
      default:
        break;
    }
  }
  // console.log(newValue);  --- ④
  // console.log(payload);
  // console.log(oldValue);

  // ======================================================
  // API に POST  --- ⑤
  // ======================================================
  const endpoint = "https://yoi-comment.com/api/v1/comments";
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newValue),
  })
    .then((res) => {
      // 受け取ったレスポンスのステータスが 200 かつコールバックがある場合はコールバックを実行させるように if 文で分岐させる  --- ②
      if (200 === res.status && callback) {
        callback(newValue);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
```

## 良いコメント

1. TODO コメント
2. 使用上の注意
3. 使用上の警告
4. 公開するライブラリのための API コメント
5. コピーライトコメント
6. パフォーマンスなどに関わるコメント
7. 書き方としてややこしくなるのが避けられない処理へのコメント
   - 正規表現の意図を表すコメントなど

```js
/**
 * @license yoi_comment v0.0.0  --- ⑤
 * (c) 2010-2020 Yoi Comment, Inc.
 * License: MIT
 */

/**
 * @type {ActionType}  --- ④
 */
const type = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  UPDATE: "UPDATE",
  CLEAR: "CLEAR",
};

/**
 * @param { Payload } payload  --- ④
 * @param { Array<Item> } oldValue
 * @returns
 */
function trigger(payload, oldValue) {
  // ======================================================
  // triggerには個別の処理は実装しないでください。
  // 個別の処理を実装する場合には○○の方に実装してください。 --- ②, ③
  // ======================================================
  const { action, value, callback } = payload;
  let newValue = [];
  if (type.CLEAR === action) {
    break;
  } else if (type.REMOVE === action) {
    newValue = oldValue.filter((item) => item.key !== key);
  } else {
    // 改行とスペースを取り除く  --- ⑦
    value.title = value.title.replace(/\r?\n|\r|\s/g, "");
    value.description = value.description.replace(/\r?\n|\r|\s/g, "");
    // TODO: title と description に文字数制限を設ける  --- ①
    switch (action) {
      case type.ADD:
        newValue = [...oldValue, value];
        break;
      case type.UPDATE:
        // for 文でのループが一番速い  --- ⑥
        for(let i = 0; i < newValue.length; i++) {
          if (newValue[i].key === value.key) {
            newValue[i] = value;
            break;
          }
        }
        break;
      default:
        break;
    }
  }
  const endpoint = "https://yoi-comment.com/api/v1/comments";
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newValue),
  }).then((res) => {
    if (200 === res.status && callback) {
      callback(newValue);
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
```

## 練習問題

次のコードに記述されているコメントは、良いコメントか悪いコメントか考えてみましょう。

### 問 1

```js
// 挨拶
const greeting = {
  ja: "こんにちは",
  en: "hello",
  fr: "bonjour",
  zh: "你好",
};
```

#### 解答

- 正解: 悪いコメント
- 理由: コメントを書かなくても各国の挨拶を格納するオブジェクトであることは読み取れます。

### 問 2

```js
/**
 * @param {"ja" | "en" | "fr" | "zh" } lang
 * @returns {string}
 */
function getGreeting(lang) {
  return greetings[lang];
}
```

#### 解答

- 正解: 良いコメント
- 理由: このコメントは JSDoc と呼ばれています。ライブラリや API として公開するときやプロジェクト内の他の人がモジュールとして使用するときに、正しく扱うための手助けとなるでしょう。

※ Google の JavaScript ガイドでは「すべてのファイル、クラス、メソッド、プロパティに JSDoc コメントを記載するべき」とされています（[参照](https://w.atwiki.jp/aias-jsstyleguide2/pages/14.html)）。

※ Java では Javadoc というものがあります。

### 問 3

```js
function validateKana(value) {
  // if (value.length > 20) {
  //   return false;
  // }
  const regex = /^[ぁ-ん]+$/;
  return regex.test(value);
}
```

#### 解答

- 正解: 悪いコメント
- 理由: このコメントアウトを実装者以外が見た時にはなぜ残されているのかがわかりません。「何か意図があって残している」と解釈され、永遠に残り続ける負債となってしまうでしょう。

### 問 4

```js
// 30代男性、技術職　年収600万円以上、東京都在住なら true
if (
  30 <= age &&
  age <= 39 &&
  occupation === 1 &&
  600 <= salary &&
  prefecture === 13
) {
  return true;
} else {
  return false;
}
```

#### 解答

- 正解: 悪いコメント
- 理由: 一見すると if 文のややこしい条件を補助する良いコメントに見えますが、条件を変数に格納して名前で表現することでコメント不要のコードとなります。

```js
const isThirties = 30 <= age && age <= 39;
const isTechnicalJob = occupation === 1;
const isSixMillionYenOrMore = 600 <= salary;
const livingInTokyo = prefecture === 13;

const isTarget =
  isThirties && isTechnicalJob && isSixMillionYenOrMore && livingInTokyo;

if (isTarget) {
  return true;
} else {
  return false;
}
```

### 問 5

```js
// TODO: Promise.all に置き換えることができるかも
for (let i = 0; i <= 10; i++) {
  new Promise((resolve, reject) => {
    resolve(result);
  });
}
```

#### 解答

- 正解: 良いコメント
- 理由: 修正すべき箇所や誰かに何かの検証・解析を依頼するなど、問題のある箇所を明らかにするためのコメントです。このようなコメントは「アノテーションコメント」と呼ばれます。

#### アノテーションコメント例

- TODO: のちに修正や機能の追加が必要な箇所
- FIXME: 不具合があり、修正すべき箇所
- NOTE: なぜこうなったのかの説明を残す
