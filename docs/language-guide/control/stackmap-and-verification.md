---
title: StackMapFrame と検証
description: JVM 検証，StackMapFrame，自動生成される情報，JAL で意識すべきスタック整合性。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# StackMapFrame と検証

現代の JVM では，class ファイルを読み込むときにバイトコード検証が行われます。検証では，各命令でスタックやローカル変数の型が破綻していないか，分岐先で状態が合っているか，初期化前のオブジェクトを不正に使っていないかなどが確認されます。

JAL は StackMapFrame の自動生成を重視しています。Jasmin などの古いスタイルの Java アセンブラで面倒になりやすい部分を手で書かずに済むようにし，命令列そのものに集中できるようにしています。

## StackMapFrame とは

StackMapFrame は，メソッド内の特定位置におけるローカル変数とオペランドスタックの型情報です。JVM はこの情報を使って，分岐や例外ハンドラを含むメソッドを効率よく検証します。

JAL では通常，StackMapFrame を直接書く必要はありません。命令列，メソッド記述子，ローカル変数情報，分岐構造から，必要なフレームをコンパイラが組み立てます。

## それでも意識すること

自動生成されるのは StackMapFrame であって，間違った命令列が正しい意味に直されるわけではありません。各経路でスタックの形や型が一致している必要があります。

たとえば，同じラベルに合流する 2 つの経路がある場合，合流点のスタックの高さと型が合っていなければなりません。

<InstructionTrace
  trace={ `
    iload_0
    ↑ condition | 0: condition
    ifeq ElsePath
    ↑ - | 0: condition
  
    iconst_1
    ↑ 1 | 0: condition
    goto Join
    ↑ 1 | 0: condition

  ElsePath:
    ↑ - | 0: condition
    iconst_0
    ↑ 0 | 0: condition

  Join:
    ↑ result | 0: condition
    ireturn
    ↑ - | 0: condition
`}
/>

この例では，どちらの経路でも `Join` に来た時点で int が 1 つ積まれているため，`ireturn` できます。

一方，片方の経路だけ値を積むと破綻します。

<InstructionTrace
  trace={ `
    iload_0
    ↑ condition | 0: condition
    ifeq Join
    ↑ - | 0: condition
  
    iconst_1
    ↑ 1 | 0: condition

  Join:
    ↑ missing-or-int | 0: condition
    ireturn
    ↑ verification error | 0: condition
`}
/>

`ifeq Join` で直接来た場合，`Join` には戻り値がありません。StackMapFrame を自動生成しても，メソッドとして正しくありません。

## 分岐先の型を合わせる

スタックの高さだけでなく，型も合っている必要があります。

<InstructionTrace
  trace={ `
  iload_0
    ↑ condition | 0: condition
    ifeq StringPath
    ↑ - | 0: condition
  
    new java/lang/StringBuilder
    ↑ builder | 0: condition
    dup
    ↑ builder; builder | 0: condition
    invokespecial java/lang/StringBuilder-><init>()V
    ↑ builder | 0: condition
    goto Join
    ↑ builder | 0: condition

  StringPath:
    ↑ - | 0: condition
    ldc "text"
    ↑ "text" | 0: condition

  Join:
    ↑ reference | 0: condition
    areturn
    ↑ - | 0: condition
`}
/>

どちらも参照型を返していますが，合流点で具体的にどの型として扱えるかは JVM の型推論に関わります。意図が単純なら，合流前に共通の型にそろえる，または合流させずにそれぞれ `areturn` するほうが読みやすい場合があります。

<InstructionTrace
  trace={ `
  iload_0
    ↑ condition | 0: condition
    ifeq StringPath
    ↑ - | 0: condition
  
    new java/lang/StringBuilder
    ↑ builder | 0: condition
    dup
    ↑ builder; builder | 0: condition
    invokespecial java/lang/StringBuilder-><init>()V
    ↑ builder | 0: condition
    invokevirtual java/lang/StringBuilder->toString()Ljava/lang/String;
    ↑ result | 0: condition
    areturn
    ↑ - | 0: condition

  StringPath:
    ↑ - | 0: condition
    ldc "text"
    ↑ "text" | 0: condition
    areturn
    ↑ - | 0: condition
`}
/>

## 例外ハンドラの入口

例外ハンドラに制御が移ると，スタックには捕捉された例外オブジェクトが積まれた状態になります。ハンドラの先頭では，その例外を保存するか，不要なら捨てます。

<InstructionTrace
  trace={ `
  ioHandler:
  ↑ IOException | -
    astore_1 [Ljava/io/IOException; -> error]
    ↑ - | error: IOException
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    ↑ System.out | error: IOException
    ldc "IOException caught"
    ↑ System.out; "IOException caught" | error: IOException
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
    ↑ - | error: IOException
    goto cleanup
    ↑ - | error: IOException
`}
/>

例外オブジェクトを使わない場合でも，スタックに残したまま通常の `return` へ進むと整合性が崩れます。

<InstructionTrace
  trace={ `
  generalHandler:
  ↑ Exception | -
    pop
    ↑ - | -
    goto cleanup
    ↑ - | -
`}
/>

## コンストラクタと未初期化オブジェクト

`new` の直後の参照は，コンストラクタが呼ばれるまで未初期化状態です。通常はすぐ `dup` して `<init>` を呼びます。

<InstructionTrace
  trace={ `
  new java/lang/StringBuilder
  ↑ uninitialized builder | -
  dup
  ↑ uninitialized builder; uninitialized builder | -
  invokespecial java/lang/StringBuilder-><init>()V
  ↑ builder | -
  astore_1
  ↑ - | 1: builder
`}
/>

未初期化のまま通常のメソッドを呼ぶ，フィールドへ保存する，複雑な分岐で扱う，といった形は避けます。まず初期化を完了させてから，通常の参照として使うのが安全です。

## ローカル変数情報の役割

JAL のローカル変数情報は可読性とデバッグの助けになります。

<InstructionTrace
  trace={ `
  istore_1 [I -> index]
  ↑ - | index: int
  astore_2 [Ljava/lang/String; -> name]
  ↑ - | index: int; name: String
`}
/>

StackMapFrame の自動生成に必要な型推論は命令からも行えますが，名前や型のヒントがあると，コードを読む人にとって意図が明確になります。大きいメソッドでは特に，ローカル変数に名前を付けることを推奨します。

## 検証エラーを避けるための習慣

検証エラーは，JAL の構文エラーよりも原因を見つけにくいことがあります。次の習慣を持つと，問題を早めに見つけやすくなります。

1. 分岐の合流点では，スタックの高さと型をそろえる
2. `V` メソッドから戻る前に余分な値を残さない
3. 戻り型に合った return 命令を使う
4. 例外ハンドラ先頭の例外オブジェクトを処理する
5. `new` したオブジェクトは複雑な分岐前に初期化する
6. 使わないメソッド戻り値は `pop` する

JAL は StackMapFrame を手で管理しなくてよいようにしますが，JVM のスタックマシンとして意味の通る命令列を書くことは変わりません。
