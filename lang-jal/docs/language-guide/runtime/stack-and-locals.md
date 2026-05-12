---
title: スタックとローカル変数
description: JVM のオペランドスタック、ローカル変数スロット、名前ヒントの読み方。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# スタックとローカル変数

JAL のメソッド本体を理解するには、オペランドスタックとローカル変数スロットの 2 つを追う必要があります。命令は値をスタックに積み、必要な値を取り出し、結果を積み直します。ローカル変数は、途中結果や引数を保存するスロットです。

## オペランドスタック

次のメソッドを考えます。

<InstructionTrace
  trace={ `
  public static add(II)I {
  ↑ - | 0: arg0; 1: arg1
    iload_0
    ↑ arg0 | 0: arg0; 1: arg1
    iload_1
    ↑ arg0; arg1 | 0: arg0; 1: arg1
    iadd
    ↑ arg0 + arg1 | 0: arg0; 1: arg1
    ireturn
    ↑ - | 0: arg0; 1: arg1
  }
  ↑ - | 0: arg0; 1: arg1
`}
/>

命令ごとのスタックは次のように変わります。

| 命令 | 実行後のスタック |
| --- | --- |
| `iload_0` | `arg0` |
| `iload_1` | `arg0`, `arg1` |
| `iadd` | `arg0 + arg1` |
| `ireturn` | 空になる |

`iadd` は int を 2 つ取り出して、int の結果を 1 つ積みます。`ireturn` は戻り値を取り出して呼び出し元へ返します。

## ローカル変数スロット

ローカル変数スロットは番号で指定します。`iload_0` はスロット 0 から int を読み、`istore_1` はスロット 1 に int を保存します。

<InstructionTrace
  trace={ `
  iconst_0
  ↑ 0 | -
  istore_1
  ↑ - | 1: 0
  
  ↑ - | 1: 0
  iload_1
  ↑ 0 | 1: 0
  bipush 10
  ↑ 0; 10 | 1: 0
  iadd
  ↑ 10 | 1: 0
  istore_1
  ↑ - | 1: 10
`}
/>

この例では、スロット 1 に 0 を入れ、その後 10 を足して同じスロットへ戻しています。

## static と instance の違い

static メソッドでは引数がスロット 0 から始まります。

<InstructionTrace
  trace={ `
  public static twice(I)I {
  ↑ - | 0: value
    iload_0
    ↑ value | 0: value
    iconst_2
    ↑ value; 2 | 0: value
    imul
    ↑ value * 2 | 0: value
    ireturn
    ↑ - | 0: value
  }
  ↑ - | 0: value
`}
/>

インスタンスメソッドではスロット 0 が `this` です。最初の引数はスロット 1 になります。

<InstructionTrace
  trace={ `
  public twice(I)I {
  ↑ - | 0: this; 1: value
    iload_1
    ↑ value | 0: this; 1: value
    iconst_2
    ↑ value; 2 | 0: this; 1: value
    imul
    ↑ value * 2 | 0: this; 1: value
    ireturn
    ↑ - | 0: this; 1: value
  }
  ↑ - | 0: this; 1: value
`}
/>

インスタンスフィールドを読むときは、`this` を `aload_0` で積みます。

<InstructionTrace
  trace={ `
  aload_0
  ↑ this | 0: this
  getfield Counter->value:I
  ↑ this.value | 0: this
`}
/>

## long と double は 2 スロット

`long` と `double` はローカル変数スロットを 2 つ使います。これは JVM の重要なルールです。

<InstructionTrace
  trace={ `
  public static mix(JI)I {
  ↑ - | 0-1: longValue; 2: intValue
    iload_2
    ↑ intValue | 0-1: longValue; 2: intValue
    ireturn
    ↑ - | 0-1: longValue; 2: intValue
  }
  ↑ - | 0-1: longValue; 2: intValue
`}
/>

この static メソッドでは、`J` の引数がスロット 0 と 1 を使うため、次の `I` 引数はスロット 2 に入ります。`double` でも同じです。

インスタンスメソッドなら、さらにスロット 0 の `this` があるため配置が変わります。

<InstructionTrace
  trace={ `
  public mix(JI)I {
  ↑ - | 0: this; 1-2: longValue; 3: intValue
    iload_3
    ↑ intValue | 0: this; 1-2: longValue; 3: intValue
    ireturn
    ↑ - | 0: this; 1-2: longValue; 3: intValue
  }
  ↑ - | 0: this; 1-2: longValue; 3: intValue
`}
/>

この場合、スロット 0 が `this`、スロット 1 と 2 が `long`、スロット 3 が `int` です。

## 名前ヒント

JAL ではロードやストアにローカル変数情報を添えられます。

<InstructionTrace
  trace={ `
  iconst_0
  ↑ 0 | -
  istore_1 [I -> count]
  ↑ - | count: 0

  ↑ - | count: 0
  iload count
  ↑ count | count: 0
`}
/>

名前ヒントを使うと、スロット番号だけのコードより意図が読みやすくなります。特にループ変数や一時変数が増えるメソッドでは、変数名を付けることでスタックの追跡が楽になります。

名前は可読性のための情報ですが、型やスコープのヒントを残せるため、IDE やデバッグ時にも役立ちます。

<InstructionTrace
  trace={ `
  astore_2 [Ljava/lang/String; -> message]
  ↑ - | message: String
  aload message
  ↑ message | message: String
`}
/>

## スタック操作命令

JVM では、同じ値を複数回使うために `dup` をよく使います。配列初期化やオブジェクト初期化で特に重要です。

<InstructionTrace
  trace={ `
  iconst_3
  ↑ 3 | -
  newarray I
  ↑ int[3] | -
  dup
  ↑ int[3]; int[3] | -
  iconst_0
  ↑ int[3]; int[3]; 0 | -
  bipush 10
  ↑ int[3]; int[3]; 0; 10 | -
  iastore
  ↑ int[3] | -
  astore_1
  ↑ - | 1: int[3]
`}
/>

`newarray` の結果は配列参照です。`iastore` は配列参照、インデックス、値を消費します。最後に配列参照をローカル変数へ保存したいので、先に `dup` で参照を複製しています。

| 命令 | 用途 |
| --- | --- |
| `dup` | スタックトップを複製する |
| `dup2` | 1 つの 2 ワード値、または 2 つの 1 ワード値を複製する |
| `swap` | 上位 2 要素を入れ替える |
| `pop` | 上位 1 要素を捨てる |
| `pop2` | 2 ワード分を捨てる |

## スタックを壊しやすいパターン

メソッド呼び出しでは、呼び出し対象と引数がすべてスタックから消費されます。

<InstructionTrace
  trace={ `
  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ↑ System.out | -
  ldc "hello"
  ↑ System.out; "hello" | -
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  ↑ - | -
`}
/>

`invokevirtual` は `PrintStream` の参照と `String` 引数を消費します。戻り型が `V` なので、呼び出し後のスタックには何も残りません。

戻り値があるメソッドなら、呼び出し後に戻り値が積まれます。

<InstructionTrace
  trace={ `
  ldc "abc"
  ↑ "abc" | -
  invokevirtual java/lang/String->length()I
  ↑ 3 | -
  ireturn
  ↑ - | -
`}
/>

この場合、`length()` の戻り値 int がスタックに残り、`ireturn` がそれを返します。

## 読み書きのチェックリスト

メソッドの命令列がうまく読めないときは、次を確認します。

1. static メソッドか instance メソッドか
2. 引数がどのスロットに入るか
3. `long` と `double` が 2 スロットを使っていないか
4. 各命令がスタックから何を消費するか
5. 分岐先でもスタックの形が合っているか
6. 戻り命令とメソッド記述子の戻り型が一致しているか

JAL では StackMapFrame が自動生成されますが、スタックの整合性そのものは命令列の意味として重要です。まず人間が読んで筋が通る形にしておくと、検証エラーや実行時エラーを避けやすくなります。
