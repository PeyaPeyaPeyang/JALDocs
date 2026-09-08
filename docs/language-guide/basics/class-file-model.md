---
title: JVM クラスファイルの見方
description: クラスファイル，定数プール，バイトコードとバージョン番号。
---

# JVM クラスファイルの見方

`.class` ファイルは，JVM が読み込むクラスやインターフェースの定義です。クラス名，親クラス，フィールド，メソッドなどを含みます。具象メソッドの本体は，`Code` 属性にバイトコードとして格納されます。

JAL では，この構造をテキストで記述します。CPU の機械語を直接書くのではなく，JVM の命令とデータ形式を指定します。

## メソッドごとに命令を実行する

```jal
public class Arithmetic (major_version=55, minor_version=0) {
  public static five()I {
    iconst_2
    iconst_3
    iadd
    ireturn
  }
}
```

`five` を呼ぶと，新しいフレームが作られます。フレームはその呼び出しのオペランドスタックとローカル変数を持ちます。`iadd` はスタック上の二つの整数を加算し，`ireturn` は結果を呼び出し元へ渡してフレームを破棄します。

呼び出すたびに別のフレームを使うため，再帰呼び出しでもローカル変数は呼び出しごとに分かれます。

## 定数プールに参照を記録する

クラスファイルには，数値や文字列，クラス，フィールド，メソッドなどを表す定数プールがあります。

```jal
getstatic java/lang/System->out:Ljava/io/PrintStream;
ldc "ready"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

この命令列では，`System.out` のフィールド参照，文字列 `"ready"`，`println` のメソッド参照を使います。定数プールのインデックスはコンパイラが割り当てるため，JAL では番号を指定しません。実行時には，JVM が名前と記述子をもとに参照を解決します。

## バージョン番号は実行環境に合わせる

| Java のリリース | メジャーバージョン |
| --- | --- |
| 8 | 52 |
| 11 | 55 |
| 17 | 61 |
| 21 | 65 |
| 23 | 67 |

このドキュメントの例では，出力形式を明確にするため `major_version=55, minor_version=0` を指定します。Jaspera の実行環境でも扱える形式です。

バージョン番号を下げても，新しい API が古い JVM で使えるようにはなりません。また，新しい番号を書くだけで，そのリリースの全機能に対応できるわけでもありません。使用する命令・属性・API と，コンパイラ・実行環境の対応をそれぞれ確認します。

## ソース名とクラス名

クラスファイルの内部名は JAL のクラス宣言で決まります。`examples/Arithmetic` なら，クラスパスのルートから見た配置は `examples/Arithmetic.class` です。`java` コマンドでは `examples.Arithmetic` と指定します。

ソースファイルもクラス名に合わせて配置すると管理しやすくなりますが，ファイル名だけを変更してもクラス宣言は変わりません。

クラスファイルの構造は [JVM 仕様 第4章](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-4.html) に定義されています。
