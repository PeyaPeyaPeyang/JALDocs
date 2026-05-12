---
title: 命令
description: JAL でよく使う JVM 命令のカテゴリ別リファレンス。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# 命令

JAL の命令は JVM バイトコードのニーモニックを基本にしています。命令は 1 行に 1 つ書くのが読みやすい形式です。セミコロンは書けますが，必須ではありません。

## 定数を積む

<InstructionTrace
  trace={ `
  aconst_null
  ↑ null | -
  iconst_m1
  ↑ -1 | -
  iconst_0
  ↑ 0 | -
  iconst_5
  ↑ 5 | -
  bipush 100
  ↑ 100 | -
  sipush 10000
  ↑ 10000 | -
  ldc "Hello"
  ↑ "Hello" | -
`}
/>

小さい整数は `iconst_*`，byte 範囲は `bipush`，short 範囲は `sipush`，文字列や定数プールに載る値は `ldc` を使います。

## ロードとストア

<InstructionTrace
  trace={ `
  iload_0
  ↑ int0 | 0: int0
  iload 5
  ↑ int5 | 5: int5
  aload_1
  ↑ ref1 | 1: ref1
  istore_2
  ↑ - | 2: int
  astore 10
  ↑ - | 10: ref
`}
/>

`i` は int，`l` は long，`f` は float，`d` は double，`a` は参照型です。`_0` から `_3` までの短縮形と，任意スロットを指定する通常形があります。

ローカル変数には名前や型のヒントを付けられます。

<InstructionTrace
  trace={ `
  istore_1 [I -> counter]
  ↑ - | counter: int
  aload_2 [-> message]
  ↑ message | 2: message
  iload counter
  ↑ counter | counter: int
`}
/>

## スタック操作

<InstructionTrace
  trace={ `
  dup
  ↑ value; value | -
  dup2
  ↑ value1; value2; value1; value2 | -
  swap
  ↑ second; first | -
  pop
  ↑ - | -
  pop2
  ↑ - | -
`}
/>

JVM はスタックマシンなので，演算前に値を積み，演算後の結果をスタックから返すか保存します。

## 算術

<InstructionTrace
  trace={ `
  iadd
  ↑ left + right | -
  isub
  ↑ left - right | -
  imul
  ↑ left * right | -
  idiv
  ↑ left / right | -
  irem
  ↑ left % right | -
  iinc 1 1
  ↑ - | 1: value + 1
`}
/>

型ごとに命令名が分かれています。long は `ladd`，float は `fadd`，double は `dadd` のように接頭辞が変わります。

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
`}
/>

プリミティブ配列は `newarray`，参照配列は `anewarray`，多次元配列は `multianewarray` を使います。アクセス命令も型ごとに `iaload`，`iastore`，`aaload`，`aastore` のように分かれます。

## フィールドとメソッド

<InstructionTrace
  trace={ `
  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ↑ System.out | -
  putfield Example->count:I
  ↑ - | -
  invokestatic java/lang/Math->sqrt(D)D
  ↑ sqrt(value) | -
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  ↑ - | -
`}
/>

命令名は JVM の呼び出し形式に対応します。コンストラクタや private メソッド，super 呼び出しは `invokespecial` を使います。

## 戻り値

<InstructionTrace
  trace={ `
  ireturn
  ↑ - | -
  lreturn
  ↑ - | -
  freturn
  ↑ - | -
  dreturn
  ↑ - | -
  areturn
  ↑ - | -
  return
  ↑ - | -
`}
/>

戻り命令はメソッド記述子の戻り型と一致させます。`V` のメソッドでは `return` を使います。
