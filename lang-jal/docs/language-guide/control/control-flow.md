---
title: 制御フロー
description: ラベル、条件分岐、ループ、switch の書き方。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# 制御フロー

JAL の制御フローはラベルとジャンプ命令で表現します。Java の `if`、`while`、`switch` に相当する構造も、最終的には JVM 命令として書きます。

## ラベル

ラベルは行頭に `Name:` の形で置きます。

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
    iinc 1 1
    ↑ - | 1: i + 1
    goto LoopStart
    ↑ - | 1: i + 1

  LoopEnd:
  ↑ - | 1: i
    return
    ↑ - | 1: i
`}
/>

## 条件分岐

単一の値を 0 や null と比較する命令:

<InstructionTrace
  trace={ `
  ifeq label
  ↑ - | -
  ifne label
  ↑ - | -
  iflt label
  ↑ - | -
  ifle label
  ↑ - | -
  ifgt label
  ↑ - | -
  ifge label
  ↑ - | -
  ifnull label
  ↑ - | -
  ifnonnull label
  ↑ - | -
`}
/>

2 つの値を比較する命令:

<InstructionTrace
  trace={ `
  if_icmpeq label
  ↑ - | -
  if_icmpne label
  ↑ - | -
  if_icmplt label
  ↑ - | -
  if_icmple label
  ↑ - | -
  if_icmpgt label
  ↑ - | -
  if_icmpge label
  ↑ - | -
  if_acmpeq label
  ↑ - | -
  if_acmpne label
  ↑ - | -
`}
/>

## FizzBuzz の分岐例

<InstructionTrace
  trace={ `
  iload_1
  ↑ i | 1: i
  bipush 15
  ↑ i; 15 | 1: i
  irem
  ↑ i % 15 | 1: i
  ifne NotFizzBuzz
  ↑ - | 1: i

  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ↑ System.out | 1: i
  ldc "FizzBuzz"
  ↑ System.out; "FizzBuzz" | 1: i
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  ↑ - | 1: i
  goto LoopIncrement
  ↑ - | 1: i

  NotFizzBuzz:
  ↑ - | 1: i
`}
/>

`irem` の結果が 0 でなければ `NotFizzBuzz` へ進み、0 なら文字列を出力してループ末尾へジャンプします。

## switch

連続した整数ケースには `tableswitch`、疎な整数ケースには `lookupswitch` を使います。

<InstructionTrace
  trace={ `
  tableswitch 1 {
    CaseOne,
    CaseTwo,
    CaseThree
  } default DefaultCase
  ↑ - | -
`}
/>

<InstructionTrace
  trace={ `
  lookupswitch {
    10 : CaseTen,
    100 : CaseHundred,
    default : DefaultCase
  }
  ↑ - | -
`}
/>

各ケース末尾では、必要に応じて `goto EndSwitch` を置いて明示的に合流させます。
