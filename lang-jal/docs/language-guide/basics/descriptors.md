---
title: 型記述子とメソッド記述子
description: JVM の型記述子，配列型，メソッド記述子を Java の型と対応させて読む。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# 型記述子とメソッド記述子

JAL では Java の型名ではなく，JVM の型記述子を使います。最初は `Ljava/lang/String;` や `[I` が読みにくく見えますが，規則は単純です。型記述子を読めるようになると，フィールド，メソッド，命令の意味をかなり速く追えるようになります。

## プリミティブ型

プリミティブ型は 1 文字で表します。

| 記述子 | Java の型 | 主な命令接頭辞 |
| --- | --- | --- |
| `V` | `void` | 戻り値専用 |
| `Z` | `boolean` | `i` 系で扱うことが多い |
| `B` | `byte` | `i` 系で扱うことが多い |
| `C` | `char` | `i` 系で扱うことが多い |
| `S` | `short` | `i` 系で扱うことが多い |
| `I` | `int` | `iload`, `iadd`, `ireturn` |
| `J` | `long` | `lload`, `ladd`, `lreturn` |
| `F` | `float` | `fload`, `fadd`, `freturn` |
| `D` | `double` | `dload`, `dadd`, `dreturn` |

`boolean`，`byte`，`char`，`short` は，演算時には `int` と同じように扱われる場面が多くあります。たとえば boolean を返すメソッドでも，戻り命令は `ireturn` です。

<InstructionTrace
  trace={ `
  public isPositive(I)Z {
  ↑ - | 0: this; 1: value
    iload_0
    ↑ this | 0: this; 1: value
    ifle False
    ↑ - | 0: this; 1: value
    iconst_1
    ↑ 1 | 0: this; 1: value
    ireturn
    ↑ - | 0: this; 1: value

  False:
  ↑ - | 0: this; 1: value
    iconst_0
    ↑ 0 | 0: this; 1: value
    ireturn
    ↑ - | 0: this; 1: value
  }
`}
/>

## オブジェクト型

オブジェクト型は `L` で始まり，`;` で終わります。パッケージ区切りは Java ソースの `.` ではなく JVM 内部名の `/` です。

| Java の型 | JVM 記述子 |
| --- | --- |
| `java.lang.Object` | `Ljava/lang/Object;` |
| `java.lang.String` | `Ljava/lang/String;` |
| `java.io.PrintStream` | `Ljava/io/PrintStream;` |
| `com.example.User` | `Lcom/example/User;` |

フィールドでは次のように使います。

<InstructionTrace
  trace={ `
  private name:Ljava/lang/String;
  private output:Ljava/io/PrintStream;
`}
/>

命令の接頭辞では，参照型は `a` 系で扱います。`a` は address/reference のような意味で，オブジェクト参照や配列参照をロード，ストア，返却するときに使います。

<InstructionTrace
  trace={ `
  aload_0
  ↑ this | 0: this
  getfield Person->name:Ljava/lang/String;
  ↑ this.name | 0: this
  areturn
  ↑ - | 0: this
`}
/>

## 配列型

配列型は，要素型の前に `[` を付けます。多次元配列は `[` を重ねます。

| Java の型 | JVM 記述子 |
| --- | --- |
| `int[]` | `[I` |
| `int[][]` | `[[I` |
| `String[]` | `[Ljava/lang/String;` |
| `Object[][]` | `[[Ljava/lang/Object;` |

配列そのものは参照型なので，ローカル変数に入れるときは `astore`，読み出すときは `aload` を使います。配列要素を読み書きするときは，要素型に応じた `iaload`，`iastore`，`aaload`，`aastore` などを使います。

<InstructionTrace
  trace={ `
  iconst_3
  ↑ 3 | -
  newarray I
  ↑ int[3] | -
  astore_1
  ↑ - | 1: int[3]

  aload_1
  ↑ int[3] | 1: int[3]
  iconst_0
  ↑ int[3]; 0 | 1: int[3]
  bipush 42
  ↑ int[3]; 0; 42 | 1: int[3]
  iastore
  ↑ - | 1: int[3]
`}
/>

この例では，`astore_1` が配列参照を保存し，`iastore` が int 要素を書き込みます。

## メソッド記述子

メソッド記述子は，引数の型を `()` の中に並べ，その後ろに戻り型を書きます。

```text
(引数型...)戻り型
```

よく使う例は次の通りです。

| Java 風の意味 | JVM メソッド記述子 |
| --- | --- |
| `void run()` | `()V` |
| `int add(int, int)` | `(II)I` |
| `String get()` | `()Ljava/lang/String;` |
| `void main(String[])` | `([Ljava/lang/String;)V` |
| `boolean contains(Object)` | `(Ljava/lang/Object;)Z` |

JAL のメソッド定義では，メソッド名の直後にこの記述子を書きます。

<InstructionTrace
  trace={ `
  public static main([Ljava/lang/String;)V {
  ↑ - | 0: args
    return
    ↑ - | 0: args
  }
`}
/>

メソッド呼び出しでも同じ記述子を使います。

<InstructionTrace
  trace={ `
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  ↑ - | -
`}
/>

これは `PrintStream.println(String): void` を呼ぶ，という意味です。

## 記述子を読む練習

次の記述子を Java 風に読むと，次のようになります。

| 記述子 | 読み方 |
| --- | --- |
| `(I)V` | int を 1 つ受け取り，void を返す |
| `([I)I` | int 配列を受け取り，int を返す |
| `(Ljava/lang/String;I)Z` | String と int を受け取り，boolean を返す |
| `([[D)[D` | double の 2 次元配列を受け取り，double 配列を返す |

読み方のコツは，まず `()` の外側を見ることです。戻り型を確認してから，引数を左から 1 つずつ切り出します。オブジェクト型は `L...;` まで，配列型は `[` の数を数えてから要素型を読みます。

## 迷いやすい点

`Ljava/lang/String;` の末尾の `;` は忘れやすい部分です。オブジェクト型では必須ですが，プリミティブ型や配列の `[` 自体には付けません。

<InstructionTrace
  trace={ `
  // 正しい
  private name:Ljava/lang/String;
  private numbers:[I;

  // 誤りになりやすい
  private name:Ljava/lang/String
  private numbers:[I;
`}
/>

また，クラス名の参照と型記述子は似ていますが，同じではありません。メンバー参照の左側に出てくるクラス名は内部名です。

<InstructionTrace
  trace={ `
  // クラス内部名
  java/io/PrintStream

  // 型記述子
  Ljava/io/PrintStream;
`}
/>

JAL ではこの 2 つが同じ行に並ぶことがあります。

<InstructionTrace
  trace={ `
  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ↑ System.out | -
`}
/>

`java/lang/System` はフィールドを持つクラス，`Ljava/io/PrintStream;` はフィールドの型です。
