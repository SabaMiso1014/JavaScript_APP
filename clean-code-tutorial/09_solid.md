# 【発展】SOLID 原則

## SOLID 原則とは？

SOLID 原則とは、オブジェクト指向プログラミングにおける設計原則のことである。
SOLID 原則は、以下の 5 つの原則からなる。（頭文字を取ると SOLID になることから SOLID 原則と呼ばれる）

- 単一責任の原則（Single Responsibility Principle）
- オープン・クローズドの原則（Open-Closed Principle）
- リスコフの置換原則（Liskov Substitution Principle）
- インターフェース分離の原則（Interface Segregation Principle）
- 依存性逆転の原則（Dependency Inversion Principle）

## 単一責任の原則（Single Responsibility Principle）

クラスは単一の責任（責務）のみを負うべきである。というルール。
クラスに責任が多いと、クラスの機能を変更するときに、他のコードに与える影響箇所が大きくなります。
そのため、クラスに責任を多く持たせないようにすることが大切です。

### 目的

- 改修時の影響箇所の限定化
- 一つのクラスの肥大化防止

### Bad

```javascript
class TodoList {
  constructor() {
    this.items = [];
  }

  addItem(text) {
    this.items.push(text);
  }

  removeItem(index) {
    this.items = items.splice(index, 1);
  }

  toString() {
    return this.items.toString();
  }

  saveToFile(filename) {
    // ファイルを保存する処理
  }

  loadFromFile(filename) {
    // ファイルを読み込む処理
  }
}
```

### Good

```javascript
// ユーザーに表示するリストの保持に責任を持つクラス
class TodoList {
  constructor() {
    this.items = [];
  }

  addItem(text) {
    this.items.push(text);
  }

  removeItem(index) {
    this.items = items.splice(index, 1);
  }

  toString() {
    return this.items.toString();
  }
}

class FileManager {
  save(filename, data) {}

  load(filename) {}
}
```

### Bad

```javascript
class LoginButton {
  onClick() {
    // ログインボタンを押した際の処理
    // 中で login() が呼ばれると仮定
  }

  render() {
    // ログインボタンの表示
  }

  login() {
    // ログイン機能
  }
}
```

### Good

```javascript
class LoginButton {
  onClick() {
    // ログインボタンを押した際の処理
    // 中で login() が呼ばれると仮定
  }

  render() {
    // ログインボタンの表示
  }
}

class Auth {
  login() {
    // ログイン機能
  }

  logout() {}
}
```

### Bad

```javascript
class Payment {
  confirmOrderByPaypal(billingInfo, orderInfo) {}
  cancelByPaypal(id) {}

  confirmOrderByCreditCard(billingInfo, orderInfo) {}
  cancelByCreditCard(id) {}
}
```

### Good

```javascript
class Payment {
  constructor(strategy) {
    this.#strategy = strategy;
  }

  confirmOrder(billingInfo, orderInfo) {
    this.#strategy.confirmOrder(billingInfo, orderInfo);
  }

  cancel(id) {
    this.#strategy.cancel(id);
  }
}

class Paypal {
  confirmOrder(billingInfo, orderInfo) {}
  cancel(id) {}
}

class CreditCard {
  confirmOrder(billingInfo, orderInfo) {}
  cancel(id) {}
}

const paypal = new Paypal();
const payment = new Payment(paypal);
```

## オープン・クローズドの原則（Open-Closed Principle）

クラスは拡張にはオープンで、修正にはクローズドであるべきである。というルール。
（既存の機能に変更を加えずに拡張できるようにするべきであるという考え方）

### 修正に対してクローズドであるべき理由

修正とは元のコードから変更を加えることを指し、多くの場合は既に動いているコードに変更を加えることをさします。
すでにあるコードを変更することは、バグが発生する可能性があり、調査にはそれなりのコストが伴います。

- コードを変更することでどこに影響があるかを調査する必要がある
- 修正の影響で、動作に支障が出ないかを確認する必要がある

関数・メソッド・クラスには責任があります。
責任とはドキュメント等で記述されている「**〇〇という機能を提供する**」といった明確な目的を持ったものです。
つまり、このクローズドの原則は、**機能追加のために責任を変更すべきでない**ということです。

### 拡張に対してオープンにすべき理由

拡張は修正とは似て非なるものです。
拡張の手法としてクラスを継承したクラスを作成するなどさまざまな方法がありますが、オープンにする理由は以下の通りです。

- すでにあるものに影響を与えずに新しい機能を追加することができる

無秩序な拡張は混乱を招く可能性があるので、SOLID 原則の他の原則などと組み合わせて使うことが重要です。

### Bad

```javascript
function printEmployee(employee) {
  console.log(employee.description);
  employee.members.forEach((name) => {
    console.log(name);
  });
}

class Employee {
  constructor(description, members) {
    this.description = description;
    this.members = members;
  }
}

const employee = new Employee("従業員情報", ["Taro", "Jiro", "Saburo"]);

printEmployee(employee);
```

employee のデータ構造を変更した場合 printEmployee の実装も変更する必要があります。

### Good

```javascript
function printEmployee(employee) {
  employee.printDescription();
  employee.printNames();
}

class Employee {
  constructor(description, members) {
    this.description = description;
    this.members = members;
  }

  printDescription() {
    console.log(this.description);
  }

  printMembers() {
    this.members.forEach((member) => {
      console.log(member);
    });
  }
}

const employee = new Employee("従業員情報", ["Taro", "Jiro", "Saburo"]);
printEmployee(employee);
```

※ Payment の例もオープン・クローズドの原則に当てはまる。

## リスコフの置換原則（Liskov Substitution Principle）

S が T の派生系（S が T を継承している状態）であれば、プログラム内で T 型のオブジェクトが使用されている箇所は全て S 型のオブジェクトで置換可能であるべきである。というルール。

具体的に言うと、メソッドの戻り値や副作用なども T で決まっている場合、T を継承している S でも必ず同じ振る舞いをするべきという意味になります。
親のルールは必ず子に受け継がせ、「**S is a T**」 （S は T の 1 つ、Dog is an Animal）と言える設計かどうかがポイントです。

### Bad

```javascript
class Human {
  age = 20;
  getAge() {
    return this.age;
  }
}

class Student extends Human {
  getAge() {
    console.log(`${this.age}歳です。`);
  }
}

function printAge(age) {
  console.log(`${age}歳です。`);
}

const human = new Human();
printAge(human.getAge()); // 20歳です。

const student = new Student();
// student.getAge()だけで「20歳です。」と表示される。
const age = student.getAge(); // 20歳です。
printAge(age); // undefined歳です。
```

`printAge`での出力結果が異なるので、`Student` は `Human`で 置換可能とは言えないためリスコフの置換原則に違反しています。

### Good

```javascript
class Human {
  age = 20;
  getAge() {
    return this.age;
  }
}

class Student extends Human {
  getAge() {
    return this.age;
  }
}

function printAge(age) {
  console.log(`${age}歳です。`);
}

const student = new Student();
printAge(student.getAge()); // 20歳です。

const human = new Human();
printAge(human.getAge()); // 20歳です。
```

### Bad

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  setWidth(width) {
    this.width = width;
  }
  setHeight(height) {
    this.height = height;
  }
  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(size) {
    super(size, size);
  }

  setWidth(width) {
    throw new Error(
      "縦と横の長さを一致させるため、setSizeメソッドを使用してください。"
    );
  }

  setHeight(height) {
    throw new Error(
      "縦と横の長さを一致させるため、setSizeメソッドを使用してください。"
    );
  }

  setSize(size) {
    super.setWidth(size);
    super.setHeight(size);
  }
}
```

正方形は長方形の一種なので、 `Rectangle` を継承させて `Square`を作成しましたが、プロパティの振る舞いが異なるので、リスコフの置換原則に違反しています。

- `Rectangle`: 幅と高さをそれぞれ独立して変えられる
- `Square`: サイズのみ指定できる。サイズを指定したら自動的に幅と高さが設定される

### Good

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  setWidth(width) {
    this.width = width;
  }
  setHeight(height) {
    this.height = height;
  }
  getArea() {
    return this.width * this.height;
  }
}

class Square {
  constructor(size) {
    this.width = size;
    this.height = size;
  }
  setSize(size) {
    this.width = size;
    this.height = size;
  }
  getArea() {
    return this.width * this.height;
  }
}
```

`Rectangle` を継承せず、それぞれ独立したクラスとして作成する方が良いでしょう。

## インターフェース分離の原則（Interface Segregation Principle）

インターフェースの利用者に対して、インターフェースを分離するべきである。というルール。
言い換えると、**インターフェースの利用者に必要なものだけを提供するべきである。** ということです。

```ts
interface HumanInterface {
  name: string;
  hello(): void;
}

class Japanese implements HumanInterface {
  name: string = "taro";

  hello() {
    console.log(`Hello, I'm ${this.name}`);
  }
}
const taro = new Japanese();
taro.hello();
```

### Bad

```js
class Creature {
  eat() {}
  run() {}
  fly() {}
  swim() {}
}

const dog = new Creature();
dog.eat();
dog.run();

const swallow = new Creature();
swallow.eat();
swallow.fly();

const shark = new Creature();
shark.eat();
shark.swim();
```

### Good

```js
class Creature {
  eat() {}
}

class Animal extends Creature {
  run() {}
}
class Bird extends Creature {
  fly() {}
}
class Fish extends Creature {
  swim() {}
}

const dog = new Animal();
dog.eat();
dog.run();

const swallow = new Bird();
swallow.eat();
swallow.fly();

const shark = new Fish();
shark.eat();
shark.swim();
```

### Bad

```js
class Store {
  #data = {
    id: "123",
    name: "Store",
    phone: "555-555-5555",
    hours: "9am-5pm",
    visitors: 200,
    averageSales: 300000,
  };
  getDataForCustomer() {
    const { id, name, phone, hours } = this.#data;
    return { id, name, phone, hours };
  }
  getDataForAdmin() {
    return this.#data;
  }
  setData(newData) {
    this.#data = newData;
  }
}

function printDataForCustomer() {
  const store = new Store();
  const data = store.getDataForCustomer();
  console.log(data);
}

function printDataForAdmin() {
  const store = new Store();
  const data = store.getDataForAdmin();
  console.log(data);
}

printDataForCustomer();
printDataForAdmin();
```

カスタマーに表示するお店のデータと、管理者に表示するお店のデータは大部分が同じなので 1 つのクラスで定義しているが、カスタマー用には使用しない不要なプロパティが含まれてしまっています。
（※単一責任の原則にも違反している）

### Good

```js
class StoreForCustomer {
  #data = {
    id: "123",
    name: "Store",
    phone: "555-555-5555",
    hours: "9am-5pm",
  };
  getData() {
    return this.#data;
  }
}

function printDataForCustomer() {
  const store = new StoreForCustomer();
  const data = store.getData();
  console.log(data);
}
printDataForCustomer();

class StoreForAdmin {
  #data = {
    id: "123",
    name: "Store",
    phone: "555-555-5555",
    hours: "9am-5pm",
    visitors: 200,
    averageSales: 300000,
  };
  getData() {
    return this.#data;
  }
  setData(newData) {
    this.#data = newData;
  }
}

function printDataForAdmin() {
  const store = new StoreForAdmin();
  const data = store.getData();
  console.log(data);
}
printDataForAdmin();
```

カスタマーと管理者でクラスを分けることで、それぞれに必要なプロパティ、メソッドのみを提供しています。

## 依存関係逆転の原則（Dependency Inversion Principle）

依存関係とは、A というクラスが B というクラスを利用している場合、A は B に依存しているということです。
その依存関係が抽象クラスと具象クラスのみにあり、具象クラス同士に依存関係がない状態が最も柔軟性に優れていると言われています。

その考えから、具象クラス同士での利用が必要になった場合、お互いに直接依存するのではなく共有された抽象クラスを抜き出しそこに依存させるべきである、というのが依存関係逆転の原則です。

全ての場面で原則を守ることは厳しいですが、特に変化しやすい具象クラスの参照、継承には注意しましょう。

### 良い依存関係とは？

有向非巡回グラフをイメージするとわかりやすいです。
つまり大切な考え方は

- 依存関係は一方向になるようにする（双方向依存はしない）
- 依存関係は巡回しないようにする
- 上位のモジュールは下位のモジュールに依存してはいけない
- 抽象は実装に依存してはいけない、実装は抽象に依存するべきである

### Bad

```js
class Payment {
  constructor(strategy) {
    this.#strategy = strategy;
  }

  confirmOrder(billingInfo, orderInfo) {
    // 具象クラス（下位のモジュールの実装）に依存
    if (this.#strategy instanceof Paypal) {
      this.#strategy.payByPaypal(billingInfo, orderInfo);
    } else if (this.#strategy instanceof CreditCard) {
      this.#strategy.confirmOrder(billingInfo, orderInfo);
    }
  }

  cancel(id) {
    // 具象クラス（下位のモジュールの実装）に依存
    if (this.#strategy instanceof Paypal) {
      this.#strategy.cancel(id);
    } else if (this.#strategy instanceof CreditCard) {
      this.#strategy.refund(id);
    }
  }
}

class Paypal {
  payByPaypal(billingInfo, orderInfo) {}
  cancel(id) {}
}

class CreditCard {
  confirmOrder(billingInfo, orderInfo) {}
  refund(id) {}
}
```

### Good

```js
class Payment {
  constructor(strategy) {
    this.#strategy = strategy;
  }

  confirmOrder(billingInfo, orderInfo) {
    // 具象クラス（下位のモジュールの実装）に依存していない！
    this.#strategy.confirmOrder(billingInfo, orderInfo);
  }

  cancel(id) {
    // 具象クラス（下位のモジュールの実装）に依存していない！
    this.#strategy.cancelOrder(id);
  }
}

class PaymentMethod {
  confirmOrder(billingInfo, orderInfo) {
    throw new Error("confirmOrderを実装してください。");
  }
  cancel(id) {
    throw new Error("cancelを実装してください。");
  }
}

class Paypal extends PaymentMethod {
  // 具象クラス（下位のモジュールの実装）を抽象クラス（上位のモジュールの実装）に寄せる！
  confirmOrder(billingInfo, orderInfo) {}
  // 具象クラス（下位のモジュールの実装）を抽象クラス（上位のモジュールの実装）に寄せる！
  cancel(id) {}
}

class CreditCard extends PaymentMethod {
  confirmOrder(billingInfo, orderInfo) {}
  cancel(id) {}
}
```
