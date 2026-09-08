---
title: クラス，フィールド，メソッド
description: クラスの宣言，定数値と初期化，インスタンスと static の違い。
---

# クラス，フィールド，メソッド

クラスにはフィールドとメソッドを宣言します。JAL は Java のコンストラクタや初期化式を自動で補う言語ではないため，必要な処理を命令として書きます。

## インスタンスの値を読み書きする

```jal
public class Counter (major_version=55, minor_version=0) {
  private count:I

  public <init>(I)V {
    aload_0
    invokespecial java/lang/Object-><init>()V
    aload_0
    iload_1
    putfield Counter->count:I
    return
  }

  public setCount(I)V {
    aload_0
    iload_1
    putfield Counter->count:I
    return
  }

  public getCount()I {
    aload_0
    getfield Counter->count:I
    ireturn
  }
}
```

`<init>` はコンストラクタです。この例では親のコンストラクタを呼んでから，引数を `count` に代入します。`setCount` を呼ぶと，後から値を変更できます。どちらのメソッドも，スロット 0 は `this`，スロット 1 は `int` 引数です。

`putfield` の直前には，下から対象オブジェクト，代入する値の順に積みます。`getfield` は対象オブジェクトの参照を取り出し，フィールド値を積みます。

コンストラクタを宣言しなければ，JAL が引数なしコンストラクタを自動で追加することはありません。static メソッドだけを使うクラスには，コンストラクタがなくても構いません。

## 定数値と初期化処理

```jal
public static final MESSAGE:Ljava/lang/String; = "ready"
```

フィールド宣言の `= 値` は `ConstantValue` 属性として出力されます。JVM がこの属性を使って初期化するのは static フィールドです。インスタンスフィールドに書いても，コンストラクタでの代入にはなりません。

指定できる定数の種類はフィールド型によって決まります。任意のオブジェクトを `new` したり，メソッドを呼び出したりする初期化式は書けません。

処理を伴う static 初期化には `<clinit>` を使います。

```jal
public class Settings (major_version=55, minor_version=0) {
  private static text:Ljava/lang/String;

  static <clinit>()V {
    ldc "ready"
    putstatic Settings->text:Ljava/lang/String;
    return
  }
}
```

`<clinit>` はクラスの初期化時に JVM が実行します。クラスファイルを読み込んだ瞬間に必ず実行するという意味ではありません。static メソッドの呼び出しなど，初期化が必要になる操作で実行されます。

## メソッドとアクセス修飾子

メソッドは名前，記述子，修飾子，本体で定義します。`static` メソッドには `this` がなく，最初の引数はスロット 0 に入ります。インスタンスメソッドは対象オブジェクトを伴って呼び出します。

`public`，`protected`，`private` を省略すると，パッケージアクセスです。`final` は，フィールドでは代入可能な場所を制限し，メソッドではオーバーライドを，クラスでは継承を禁止します。フィールドが `final` でも，参照先オブジェクトの内容まで不変になるわけではありません。

## インターフェースと抽象メソッド

```jal
public abstract interface Printer (major_version=55, minor_version=0) {
  public abstract print(Ljava/lang/String;)V {}
}
```

抽象メソッドには処理を書かず，空の `{}` を付けます。実際の処理は，このインターフェースを実装するクラスで定義します。抽象メソッドのクラスファイルには，命令列を格納する `Code` 属性を付けません。

フィールドの定数値は [JVM 仕様 §4.7.2](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-4.html#jvms-4.7.2)，クラスの初期化は [§5.5](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-5.html#jvms-5.5) に規定されています。
