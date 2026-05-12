---
title: 構文ガイド
description: JAL ファイルの基本構造，型記述子，クラス，フィールド，メソッドの書き方。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# 構文ガイド

JAL ソースは 1 ファイルにつき 1 つのクラスまたはインターフェースを定義します。構文は JVM クラスファイルに近く，クラスメタデータ，フィールド，メソッド，命令列を明示的に書きます。

この近さは機械語やアセンブリ言語の入門にも役立ちます。Java のソースコードからは見えにくい class ファイルの構造を，命令列，型記述子，メンバー参照として直接確認できます。x86 などの実機向けアセンブリに進む前に，より単純な JVM のモデルで命令実行の流れを追えます。

<InstructionTrace
  trace={ `
  public class HelloWorld (
    major_version=55,
    minor_version=0,
    super_class=java/lang/Object) {

    public static main([Ljava/lang/String;)V {
      return
    }
  }
`}
/>

## クラス

クラスはアクセス修飾子，属性，`class` または `interface`，クラス名，任意のメタデータ，本文で構成されます。

<InstructionTrace
  trace={ `
  public final class Example (
    major_version=55,
    minor_version=0,
    interfaces=java/lang/Cloneable) {
  }
`}
/>

主なクラスメタデータ:

| 名前 | 意味 |
| --- | --- |
| `major_version` | Java クラスファイルのメジャーバージョン。`45` は Java 1.0/1.1，`55` は Java 11，`61` は Java 17，`71` は Java 27。 |
| `minor_version` | クラスファイルのマイナーバージョン。通常は `0`。 |
| `super_class` | 親クラス。省略時は `java/lang/Object`。 |
| `interfaces` | 実装するインターフェースの一覧。 |

## フィールド

フィールドは `name : descriptor` の形で書き，スカラー値で初期化できます。

<InstructionTrace
  trace={ `
  private count:I = 0;
  public static final MESSAGE:Ljava/lang/String; = "ready";
  volatile current:I;
`}
/>

よく使う属性は `public`，`private`，`protected`，`static`，`final`，`volatile`，`transient` です。

## メソッド

メソッドは JVM のメソッド記述子を使います。`(II)I` は int を 2 つ受け取り int を返す，`([Ljava/lang/String;)V` は `String[]` を受け取り `void` を返す，という意味です。

<InstructionTrace
  trace={ `
  public add(II)I {
  ↑ - | 0: this; 1: arg0; 2: arg1
    iload_0
    ↑ this | 0: this; 1: arg0; 2: arg1
    iload_1
    ↑ this; arg0 | 0: this; 1: arg0; 2: arg1
    iadd
    ↑ this + arg0 | 0: this; 1: arg0; 2: arg1
    ireturn
    ↑ - | 0: this; 1: arg0; 2: arg1
  }
`}
/>

コンストラクタは `<init>`，クラス初期化子は `<clinit>` です。

<InstructionTrace
  trace={ `
  public <init>()V {
  ↑ - | 0: this
    aload_0
    ↑ this | 0: this
    invokespecial java/lang/Object-><init>()V
    ↑ - | 0: this
    return
    ↑ - | 0: this
  }
`}
/>

## 型記述子

JAL は JVM と同じ型記述子を使います。

| 記述子 | Java 型 |
| --- | --- |
| `V` | `void` |
| `Z` | `boolean` |
| `B` | `byte` |
| `C` | `char` |
| `S` | `short` |
| `I` | `int` |
| `J` | `long` |
| `F` | `float` |
| `D` | `double` |
| `Ljava/lang/String;` | `java.lang.String` |
| `[I` | `int[]` |
| `[[Ljava/lang/Object;` | `java.lang.Object[][]` |

## メンバー参照

フィールドとメソッドは `ClassName->member` の形で参照します。

<InstructionTrace
  trace={ `
  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ↑ System.out | -
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  ↑ - | -
`}
/>

クラス名は JVM 内部名を使うため，パッケージ区切りは `.` ではなく `/` です。
