---
title: サンプル
description: HelloWorld、FizzBuzz、配列、switch の JAL サンプル。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# サンプル

このリポジトリの `examples/` には、JAL の基本パターンを確認できるサンプルがあります。

## HelloWorld

<InstructionTrace
  trace={ `
  public class HelloWorld (
    major_version=55,
    minor_version=0) {
    public static main([Ljava/lang/String;)V {
    ↑ - | 0: args
      getstatic java/lang/System->out:Ljava/io/PrintStream;
      ↑ System.out | 0: args
      ldc "Hello, World!"
      ↑ System.out; "Hello, World!" | 0: args
      invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
      ↑ - | 0: args
      return
      ↑ - | 0: args
    }
    ↑ - | 0: args
  }
  ↑ - | -
`}
/>

ポイント:

- `getstatic` で `System.out` を取得する
- `ldc` で文字列定数を積む
- `invokevirtual` で `PrintStream.println` を呼ぶ
- `return` で `void` メソッドから戻る

## FizzBuzz

<InstructionTrace
  trace={ `
  LoopStart:
  ↑ - | 1: i
    iload_1
    ↑ i | 1: i
    bipush 101
    ↑ i; 101 | 1: i
    if_icmpge LoopEnd
    ↑ - | 1: i
  
    ↑ - | 1: i
    iload_1
    ↑ i | 1: i
    bipush 15
    ↑ i; 15 | 1: i
    irem
    ↑ i % 15 | 1: i
    ifne NotFizzBuzz
    ↑ - | 1: i
  
    ↑ - | 1: i
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    ↑ System.out | 1: i
    ldc "FizzBuzz"
    ↑ System.out; "FizzBuzz" | 1: i
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
    ↑ - | 1: i
    goto LoopIncrement
    ↑ - | 1: i
`}
/>

FizzBuzz では、`irem`、条件分岐、ラベル、`goto` によるループをまとめて確認できます。

## 配列

<InstructionTrace
  trace={ `
  iconst_5
  ↑ 5 | -
  newarray I
  ↑ int[5] | -
  dup
  ↑ int[5]; int[5] | -
  iconst_0
  ↑ int[5]; int[5]; 0 | -
  iconst_5
  ↑ int[5]; int[5]; 0; 5 | -
  iastore
  ↑ int[5] | -
  astore_1
  ↑ - | 1: int[5]
`}
/>

配列サンプルでは、配列参照を `dup` で残しながら `iastore` で要素を書き込みます。

## switch

`SwitchExample.jal` では `tableswitch` の使い方を確認できます。連続した整数ケースでは `tableswitch`、値が飛び飛びの場合は `lookupswitch` を選びます。

## 実行

CLI コンパイラを使う場合:

```bash
jalc examples/HelloWorld.jal --output build/classes
```

jar として出力する場合:

```bash
jalc examples --output build/examples.jar
```
