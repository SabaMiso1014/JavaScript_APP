# 【発展】クラスの定義

## クラスを定義する際の重要なポイント

- クラスの情報は出来る限り隠蔽する
- 使用側がクラス内部について知らなくても使えるようにする
- クラスはなるべく小さく作る
- クラス継承とコンポジションの違いを知る
- 凝集度と結合度を意識する

## クラスはなるべく小さく作る

大きくなりすぎたクラスはうまく定義できていない可能性があるため、分割を検討する。

### Bad

```js
class Cart {
  addProduct() {}
  getProductPrice() {}
  getProductCoupon() {}
  calculate() {}
  printReceipt() {}
}
```

- Cart に Product に関する処理も持たせるとクラスが大きくなる。Product 以外のものも今後増えてくると可読性が大きく下がってしまう。

### Good

```js
class Product {
  getPrice() {}
  getCoupon() {}
}

class Cart {
  constructor(products) {
    this.products = products;
  }
  add(product) {}
  calculate() {}
  printReceipt() {}
}

const product = new Product();
const products = [product];
const cart = new Cart(products);
```

### Bad

```js
class Blog {
  addPost(post) {}
  deletePost(id) {}
  editPost(id, post) {}
  addComment(id, comment) {}
  deleteComment(id, commentId) {}
  editComment(id, commentId, comment) {}
}
```

### Good

```js
class Post {
  constructor(comments) {
    this.comments = comments;
  }
  add(post) {}
  delete(id) {}
  edit(id, post) {}
}

class Comment {
  add(id, comment) {}
  delete(id, commentId) {}
  edit(id, commentId, comment) {}
}

const comment = new Comment();
const comments = [comment];
const post = new Post(comments);
```

## クラス内部の情報は出来る限り隠蔽する

クラスの内部情報はなるべく外部からアクセスできないようにクラスは作成しましょう。外部からアクセス可能な状態にしておくと意図しない使われ方をする場合があります。

### Bad

```js
class Television {
  modelNumber = "型番";

  displayModelNumber() {
    console.log(this.modelNumber);
  }
}

const television = new Television();

console.log(television.modelNumber);
television.modelNumber = "バグを引き起こす英数字の羅列";
console.log(television.displayModelNumber());
```

- インスタンスから modelNumber が見えてしまっており、クラス外部から変更もできてしまう

### Good

```js
class Television {
  #modelNumber = "型番";

  displayModelNumber() {
    console.log(this.#modelNumber);
  }
}

const television = new Television();

television.displayModelNumber();
// console.log(television.#modelNumber)を呼び出すと以下のエラーが発生します。
// > Uncaught SyntaxError: Private field '#modelNumber' must be declared in an enclosing class
```

- 外部から参照してほしくないプロパティやメソッドを隠すことによって、プロパティに再代入されるなど、意図しない使われ方をしないようにすることができる
- modelNumber が内部実装されていることが外部に晒されていないため、displayModelNumber の内部で表示前にどのような処理をしていても他の開発者にとってのインターフェイスは displayModelNumber の呼び出しだけとなり、modelNumber への処理内容を強制できる

### Bad

```js
class Circle {
  PI = 3;
  constructor(radius) {
    this.radius = radius;
  }
  getArea() {
    return this.radius * this.radius * this.PI;
  }
  getPerimeter() {
    return 2 * this.radius * this.PI;
  }
}

const circle = new Circle(5);
console.log(circle.getArea()); // 75
circle.PI = 3.14;
console.log(circle.getArea()); // 78.5
```

### Good

```js
class Circle {
  #PI = 3;
  constructor(radius) {
    this.#radius = radius;
  }
  getArea() {
    return this.#radius * this.#radius * this.#PI;
  }
  getPerimeter() {
    return 2 * this.#radius * this.#PI;
  }
  getRadius() {
    return this.#radius;
  }
  setRadius(newRadius) {
    this.#radius = newRadius;
  }
  // setter, getter
  get radius() {
    return this.#radius;
  }
  set radius(newRadius) {
    this.#radius = newRadius;
  }
}

const circle = new Circle(5);
console.log(circle.getArea()); // 75
// circle.#PI = 3.14; // プライベートプロパティにはアクセスできない
```

## 使用側がクラス内部について知らなくても使えるようにする

クラスの内部構造を知らないと使えないクラスというのは使いづらいクラスです。使用側がなるべく使いやすいクラスを定義するように心掛けましょう。

### Bad

```js
class Television {
  power = true;
  switch = new Switch();
}

class Switch {
  toggle(power) {
    return !power;
  }
}

const television = new Television();
television.power = television.switch.toggle(television.power);
console.log(`power: ${television.power ? "on" : "off"}`);
```

- 使用の際に、switch に toggle メソッドがあることを知らないといけない

### Good

```js
class Television {
  #power = false;
  #switch = new Switch();

  toggleSwitch() {
    this.#power = this.#switch.toggle(this.#power);
    console.log(`power: ${this.#power ? "on" : "off"}`);
  }
}

class Switch {
  toggle(power) {
    return !power;
  }
}

const television = new Television();
television.toggleSwitch();
```

- Television の toggleSwitch の内部処理に Switch クラスのメソッドを含むことで、他の開発者が Switch クラスの toogle メソッドの存在を知る必要がなくなり、toggleSwitch を呼び出すだけで power プロパティを切り替えることができる。こうすることで使う側が知るべき情報量を減らすことができる。

## クラス継承とコンポジション

クラスの継承とコンポジションの違いについて学びましょう。

### 継承

- あるクラスが他クラスの特性を引き継いで、新たなクラスとして定義されること。クラス A の特性を引き継いだクラス B が定義された時、B が A を継承した、という。
- A は B であるという is-a 関係が成立する
  例）Dog is a Animal

```js
class Animal {
  eat() {
    console.log("食べる");
  }
  sleep() {
    console.log("寝る");
  }
}

class Dog extends Animal {
  sleep() {
    console.log("小屋で寝る");
  }
}
const dog = new Dog();
dog.eat();
// > 食べる
dog.sleep();
// > 小屋で寝る
```

### コンポジション

- あるクラスの機能を持つクラスのこと。 特定のクラスの機能を自分が作るクラスにも持たせたい場合に、継承を使わずプロパティとしてそのクラスを持つこと。
- A は B を含むという has-a 関係が成立する
  例）TV has a Switch

```js
class Television {
  #power = false;
  #switch = new Switch();

  toggleSwitch() {
    this.#power = this.#switch.toggle(this.#power);
    console.log(`power: ${this.#power ? "on" : "off"}`);
  }
}

class Switch {
  toggle(power) {
    return !power;
  }
}
```

### メリット

- 継承
  - あるクラスの特性を一括で引き継ぐことができる
- コンポジション
  - 継承したクラスのメソッドやプロパティが全て提供されるわけではない

### デメリット

- 継承
  - 複数のクラスが継承できない
  - 十分な検討の元、継承を行わないと将来破綻する可能性がある
- コンポジション
  - プロパティとして別クラスを持つため、クラス内のプロパティが増える
  - メソッド数が多くなる可能性がある

### ポイント

継承とコンポジションは似ているようにも見えますが、

- is-a （A は B である）なら継承
- has-a （A は B を含む）ならコンポジション

というポイントを抑え適切に使い分けることで、改修、拡張しやすく使い勝手の良いクラスになるでしょう。

### 練習問題

()に対する{}の関係を表すのに、継承、またはコンポジションのどちらで実装するべきか考えてみましょう。

1. (自転車)に{サドル}がついている
2. (犬)は{動物}に含まれる
3. (人間)は{動物}である
4. (自転車)は{乗り物}である

#### 解答

- is-a （A は B である）なら継承
- has-a （A は B を含む）ならコンポジション

1. (自転車)に{サドル}がついている -> コンポジション
2. (犬)は{動物}に含まれる -> 継承
3. (人間)は{動物}である -> 継承
4. (自転車)は{乗り物}である -> 継承

### 練習問題

攻撃の種類を保持する Attack クラスが存在します。
このクラスは Hero と Enemy クラスで利用します。
継承またはコンポジションのどちらで実装するのが良いか考えてみましょう。

```js
class Attack {
  punch(target, damage) {
    console.log(`${target}に${damage}ダメージを与えた。`);
  }
  kick(targe, damaget) {
    console.log(`${target}に${damage}ダメージを与えた。`);
  }
}
class Hero {}

class Enemy {}
```

#### 継承での実装

```js
class Attack {
  punch(target, damage) {
    console.log(`${target}に${damage}ダメージを与えた。`);
  }
  kick(targe, damaget) {
    console.log(`${target}に${damage}ダメージを与えた。`);
  }
}
class Hero extends Attack {}

class Enemy extends Attack {}
```

#### コンポジションでの実装

```js
class Attack {
  punch(target, damage) {
    console.log(`${target}に${damage}ダメージを与えた。`);
  }
  kick(target, damage) {
    console.log(`${target}に${damage}ダメージを与えた。`);
  }
}

class Hero {
  // コンポジションでattackをプロパティとしてもつ
  #attack = new Attack();
}

class Enemy {
  // コンポジションでattackをプロパティとしてもつ
  #attack = new Attack();
}
```

## 凝集度を高めよう

凝集度とは、モジュール内におけるデータ（情報）とロジック（機能）の関係性の強さを表す指標です。
データを保持するクラスと、そのデータを使って計算するロジックが局所的に集まっている状態を高凝集、分散している状態を低凝集と言います。関連する機能や情報がモジュールとして閉じた状態でまとめられている（ = 高凝集）の設計になっていれば、仕様変更で生じる修正の影響範囲は小さくなり、保守性の高いコードとなります。

### Bad

凝集度が低い（低凝集な）コード

```js
class Product {
  price = 0;
}

class Shop {
  getTaxFreePrice() {
    // 税抜き金額の算出
  }

  getTaxIncludedPrice() {
    // 税込み金額の算出
  }
}
class OnlineShop {
  getTaxFreePrice() {
    // 税抜き金額の算出
  }

  getTaxIncludedPrice() {
    // 税込み金額の算出
  }
}
```

・税込・税抜きの計算を Shop に持たせると Shop 以外のお金を扱う class が必要になった際にも計算のロジックを再実装しないといけなくなる

### Good

凝集度が高い（高凝集な）コード

```js
class Product {
  #price = 0;

  getTaxFreePrice() {
    // 税抜き金額の算出
  }

  getTaxIncludedPrice() {
    // 税込み金額の算出
  }
}
```

・Money 側に税抜・税込のロジックを持たせることでお金を扱う個々の class が金額計算のロジックを持つ必要がなくなる

関わりのあるデータとメソッドは結び付きが強い方が管理しやすい
※ 結び付いて欲しいところ、結び付いてほしくないところでメリハリを効かせることが大切。

## 結合度を疎にしよう

結合度とは、モジュール間のデータ参照や接続の依存度合いを表す指標です。
モジュール間の関係性が高く、一方の変更が相手へ与える影響が大きい状態を密結合、互いに独立していて変更や修正の自由度が高い状態を疎結合と言います。クラス同士の結びつきを弱める疎結合を目指すことでモジュール同士の独立性を高め、再利用しやすく、見通しのよいコードとなります。

### Bad

```js
class Product {
  price = 0;
  TAX = 0.1;
  discountPercent = 0.2;

  constructor(price) {
    this.price = price;
  }
}

class Order {
  getTaxIncludedTotalPrice() {
    const product = new Product(3000);
    return product.price * (1 + product.TAX) * (1 - product.discountPercent); // Productの変更に伴う変更が発生->密結合！
  }
}
```

### Good

```js
class Product {
  #price = 0;
  #TAX = 0.1;
  #discountPercent = 0.2;

  constructor(price) {
    this.#price = price;
  }

  getTaxIncludedPrice() {
    return this.#price * (1 + this.#TAX) * (1 - this.#discountPercent);
  }
}

class Order {
  getTaxIncludedTotalPrice() {
    const product = new Product(3000);
    return product.getTaxIncludedPrice();
  }
}
```

（参考）より汎用的な実装にした例

```js
class Product {
  #price = 0;
  #TAX = 0.1;
  #discountPercent = 0.2;

  constructor(price) {
    this.#price = price;
  }

  getTaxIncludedPrice() {
    return this.#price * (1 + this.#TAX) * (1 - this.#discountPercent);
  }
}

class Order {
  #products;

  constructor(products) {
    this.#products = products;
  }

  getTaxIncludedTotalPrice() {
    return this.#products.reduce(
      (total, product) => total + product.getTaxIncludedPrice(),
      0
    );
  }
}

const products = [new Product(3000), new Product(1000)];
const order = new Order(products);
console.log(order.getTaxIncludedTotalPrice());
```

## 高凝集と疎結合を目指そう

凝集度はモジュール内にある機能の関係性、結合度はモジュール間の機能の関係性を表す指標です。
高凝集、疎結合のクラスを目指すことで、メンテナンス性も可読性も高いコードとなるでしょう。

ちなみに凝集度と結合度は相関が強く、凝集度が高くなれば、結合度は低くなる傾向があります。

### Bad

```js
class Lesson {
  constructor(students = [], teacher) {
    this.students = students;
    this.teacherName = teacher.name;
    this.teacherSubject = teacher.subject;
  }

  start() {
    console.log(`${this.teacherName}:Let's start ${this.teacherSubject}`);

    for (const student of this.students) {
      console.log(`Hello, Mr.${this.teacherName}! I'm ${student.name}.`);
    }
  }

  setTeacher(teacherName, teacherSubject) {
    this.teacherName = teacherName;
    this.teacherSubject = teacherSubject;
  }
}

class Student {
  constructor(name) {
    this.name = name;
  }
}

const students = [
  new Student("Taro 1"),
  new Student("Taro 2"),
  new Student("Taro 3"),
];

const teacher = { name: "Teacher 1", subject: "English" };
const lesson = new Lesson(students, teacher);
lesson.start();
lesson.setTeacher("Teacher 2", "Math");
lesson.start();

// Teacher 1:Let's start English
// Hello, Mr.Teacher 1! I'm Taro 1.
// Hello, Mr.Teacher 1! I'm Taro 2.
// Hello, Mr.Teacher 1! I'm Taro 3.
// Teacher 2:Let's start Math
// Hello, Mr.Teacher 2! I'm Taro 1.
// Hello, Mr.Teacher 2! I'm Taro 2.
// Hello, Mr.Teacher 2! I'm Taro 3.
```

### Good

```js
// 高凝集と疎結合を目指そう
class Lesson {
  #students;
  #teacher;

  constructor(students = [], teacher) {
    this.#students = students;
    this.#teacher = teacher;
  }

  start() {
    this.#teacher.startLesson();

    for (const student of this.#students) {
      student.startLesson(this.#teacher.getName());
    }
  }

  setTeacher(teacher) {
    this.#teacher = teacher;
  }
}

class Character {
  #name;

  constructor(name) {
    this.#name = name;
  }

  getName() {
    return this.#name;
  }

  startLesson() {
    throw new Error("startLessonを実装してください。");
  }
}

class Teacher extends Character {
  #subject;

  constructor(name, subject) {
    super(name);
    this.#subject = subject;
  }

  startLesson() {
    console.log(`${this.getName()}:Let's start ${this.#subject}`);
  }
}

class Student extends Character {
  startLesson(teacherName) {
    console.log(`Hello, Mr.${teacherName}! I'm ${this.getName()}.`);
  }
}

const students = [
  new Student("Taro 1"),
  new Student("Taro 2"),
  new Student("Taro 3"),
];

const teacher = new Teacher("Teacher 1", "English");
const lesson = new Lesson(students, teacher);
lesson.start();
const nextTeacher = new Teacher("Teacher 2", "Math");
lesson.setTeacher(nextTeacher);
lesson.start();
```

### 練習問題

```js
// 配送料
class Delivery {
  area = {
    hokkaido: 1000,
    tohoku: 600,
    kanto: 600,
    chubu: 600,
    kinki: 800,
    chugoku: 800,
    shikoku: 800,
    kyushu: 1000,
  };
}

// 商品
class Item {
  constructor(name, price, quantity) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

// 買い物かご
class Cart {
  delivery = new Delivery();

  constructor(items, deliveryArea) {
    this.items = items;
    this.deliveryArea = deliveryArea;
  }

  add(item) {
    this.items.push(item);
  }
  getDeliveryCost() {
    return this.delivery.area[this.deliveryArea];
  }
}

// 注文
class Order {
  constructor() {
    const items = [
      new Item("apple", 100, 1),
      new Item("orange", 200, 2),
      new Item("banana", 300, 3),
    ];
    const cart = new Cart(items, "hokkaido");
    this.cart = cart;
  }

  removeItem(itemName) {
    this.cart.items = this.cart.items.filter((i) => i.name !== itemName);
  }
  getItemTotal() {
    return this.cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }
  getTotalPrice() {
    const itemTotal = this.getItemTotal();
    const delivery = this.cart.getDeliveryCost();
    return itemTotal + delivery;
  }
  confirm() {
    return {
      items: this.cart.items,
      total: `${this.getTotalPrice()}円`,
    };
  }
}

const order = new Order();
console.log(order.confirm());

order.removeItem("apple");
order.cart.deliveryArea = "kanto";
console.log(order.confirm());
```

#### 解答

```js
// 配送料
class Delivery {
  #destination;
  #AREA = {
    hokkaido: 1000,
    tohoku: 600,
    kanto: 600,
    chubu: 600,
    kinki: 800,
    chugoku: 800,
    shikoku: 800,
    kyushu: 1000,
  };

  constructor(destination) {
    this.#destination = destination;
  }

  getFee() {
    return this.#AREA[this.#destination];
  }

  changeDestination(destination) {
    this.#destination = destination;
  }
}

// 商品
class Item {
  #name;
  #price;
  #quantity;

  constructor(name, price, quantity) {
    this.#name = name;
    this.#price = price;
    this.#quantity = quantity;
  }

  get name() {
    return this.#name;
  }

  get price() {
    return this.#price;
  }

  get quantity() {
    return this.#quantity;
  }

  getName() {
    return this.#name;
  }

  getSubTotal() {
    return this.#price * this.#quantity;
  }
}

// 買い物かご
class Cart {
  #items;

  constructor(items) {
    this.#items = items;
  }

  add(item) {
    this.#items.push(item);
  }

  remove(itemName) {
    this.#items = this.#items.filter((item) => item.getName() !== itemName);
  }

  getItemTotal() {
    return this.#items.reduce((total, item) => {
      return total + item.getSubTotal();
    }, 0);
  }

  getItems() {
    return this.#items;
  }
}

// 注文
class Order {
  #delivery;
  #cart;

  constructor(cart, destination) {
    this.#delivery = new Delivery(destination);
    this.#cart = cart;
  }

  removeItem(itemName) {
    this.#cart.remove(itemName);
  }

  changeDestination(destination) {
    this.#delivery.changeDestination(destination);
  }

  getTotalPrice() {
    const itemTotal = this.#cart.getItemTotal();
    const delivery = this.#delivery.getFee();
    return itemTotal + delivery;
  }

  confirm() {
    return {
      items: this.#cart.getItems(),
      total: `${this.getTotalPrice()}円`,
    };
  }
}

const items = [
  new Item("apple", 100, 1),
  new Item("orange", 200, 2),
  new Item("banana", 300, 3),
];

const cart = new Cart(items);
const order = new Order(cart, "hokkaido");
console.log(order.confirm());

console.log(items[1].price);

order.removeItem("apple");
order.changeDestination("kanto");
console.log(order.confirm());
```
