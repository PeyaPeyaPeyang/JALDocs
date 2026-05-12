---
title: 制御フロー
description: ラベル、条件分岐、ループ、switch の書き方。
---

# 制御フロー

JAL の制御フローはラベルとジャンプ命令で表現します。Java の `if`、`while`、`switch` に相当する構造も、最終的には JVM 命令として書きます。

## ラベル

ラベルは行頭に `Name:` の形で置きます。

```jal
LoopStart:
  iload_1
  bipush 101
  if_icmpge LoopEnd
  iinc 1 1
  goto LoopStart

LoopEnd:
  return
```

## 条件分岐

単一の値を 0 や null と比較する命令:

```jal
ifeq label
ifne label
iflt label
ifle label
ifgt label
ifge label
ifnull label
ifnonnull label
```

2 つの値を比較する命令:

```jal
if_icmpeq label
if_icmpne label
if_icmplt label
if_icmple label
if_icmpgt label
if_icmpge label
if_acmpeq label
if_acmpne label
```

## FizzBuzz の分岐例

```jal
iload_1
bipush 15
irem
ifne NotFizzBuzz

getstatic java/lang/System->out:Ljava/io/PrintStream;
ldc "FizzBuzz"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
goto LoopIncrement

NotFizzBuzz:
```

`irem` の結果が 0 でなければ `NotFizzBuzz` へ進み、0 なら文字列を出力してループ末尾へジャンプします。

## switch

連続した整数ケースには `tableswitch`、疎な整数ケースには `lookupswitch` を使います。

```jal
tableswitch 1 {
  CaseOne,
  CaseTwo,
  CaseThree
} default DefaultCase
```

```jal
lookupswitch {
  10 : CaseTen,
  100 : CaseHundred,
  default : DefaultCase
}
```

各ケース末尾では、必要に応じて `goto EndSwitch` を置いて明示的に合流させます。
