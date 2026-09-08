---
title: 構文ガイド
description: クラス，フィールド，メソッド，ラベルの基本的な記法。
---

# 構文ガイド

JAL のソースファイルには，一つのクラスまたはインターフェースを定義します。クラスの中にフィールドとメソッドを書き，メソッドの中に命令を並べます。

```jal
public class HelloWorld (major_version=55, minor_version=0) {
  public static main([Ljava/lang/String;)V {
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    ldc "Hello, World!"
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
    return
  }
}
```

このまま [Jaspera](https://jal.yamad.jp/jaspera/) に貼り付けて実行できます。

## 空白とコメント

改行とインデントは命令の意味を変えません。このドキュメントでは一行に一命令を書き，メソッド本体を一段下げます。ラベルはメソッド宣言と同じ深さに置きます。

`//` から行末まではコメントです。複数行のコメントには `/* ... */` を使います。文字列は二重引用符で囲みます。

## クラス宣言

```jal
public final class examples/Empty (major_version=55, minor_version=0) {
}
```

クラス名は JVM 内部名です。パッケージ区切りには `/` を使います。括弧内には `名前=値` の形でメタデータを書き，複数指定する場合はコンマで区切ります。

| 名前 | 指定するもの |
| --- | --- |
| `major_version` | クラスファイルのメジャーバージョン |
| `minor_version` | クラスファイルのマイナーバージョン |
| `super_class` | 親クラスの内部名。通常，省略時は `java/lang/Object` |
| `interfaces` | 実装するインターフェースの内部名 |

バージョン番号の意味は [クラスファイルの見方](./class-file-model.md) を参照してください。

## フィールド宣言

```jal
private count:I
public static final MESSAGE:Ljava/lang/String; = "ready"
```

フィールド名の後ろに `:` と型記述子を書きます。`Ljava/lang/String;` の末尾のセミコロンは記述子の一部です。`I` にはセミコロンを付ける必要はありません。

`= 値` はクラスファイルの定数値属性を指定します。Java の任意の初期化式とは異なります。インスタンスフィールドへの代入はコンストラクタなどで `putfield` を使います。詳しくは [クラス，フィールド，メソッド](./classes-and-members.md) で説明します。

## メソッド宣言

```jal
public static add(II)I {
  iload_0
  iload_1
  iadd
  ireturn
}
```

メソッド名の直後に，引数型を囲む `()` と戻り型を書きます。上の例は二つの `int` を受け取り，その和を返します。`static` なので引数はスロット 0 と 1 に入ります。

インスタンスメソッドではスロット 0 が `this` です。同じ引数なら `iload_1` と `iload_2` で読み出します。`iload_0` で参照型の `this` を読み出すことはできません。

抽象メソッドには空の `{}` を付けます。宣言の例は [インターフェースと抽象メソッド](./classes-and-members.md#インターフェースと抽象メソッド) を参照してください。コンストラクタ名は `<init>`，クラス初期化メソッド名は `<clinit>` です。

## メンバー参照

```text
java/lang/System->out:Ljava/io/PrintStream;
java/io/PrintStream->println(Ljava/lang/String;)V
```

`->` の左側は参照するクラスまたはインターフェースの内部名です。右側はメンバー名と記述子です。フィールドでは `:` を挟み，メソッドでは引数の括弧を続けます。

## ラベル

```jal
public static positive(I)Z {
  iload_0
  ifle NonPositive
  iconst_1
  ireturn
NonPositive:
  iconst_0
  ireturn
}
```

`NonPositive:` は命令の位置に名前を付けるラベルです。ラベル自身はバイトコードを生成しません。`ifle` はスタックから整数を取り出し，0 以下なら指定した位置へ分岐します。
