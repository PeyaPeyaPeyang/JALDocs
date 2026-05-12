---
title: 書き方の指針
description: 読みやすい JAL を書くためのラベル、ローカル変数、メソッド分割、コメントの指針。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# 書き方の指針

JAL は JVM に近い形で書けるため、短いコードでも情報量が多くなります。動くことだけを優先してスロット番号やラベル名を雑にすると、あとからスタックや分岐を追うのが難しくなります。ここでは、読みやすく保守しやすい JAL を書くための実用的な指針をまとめます。

## ラベル名は役割で付ける

ラベルは制御フローを読むための目印です。`L1`、`L2` のような名前でも動きますが、少し大きいメソッドでは意味が追いにくくなります。

<InstructionTrace
  trace={ `
  LoopStart:
  ↑ - | 1: i
    iload_1
    ↑ i | 1: i
    bipush 100
    ↑ i; 100 | 1: i
    if_icmpgt LoopEnd
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

条件分岐では、否定側や合流点の名前も意識します。

<InstructionTrace
  trace={ `
  ifne NotFizzBuzz
  ↑ - | -
  ...
  ↑ - | -
  goto LoopIncrement
  ↑ - | -

  NotFizzBuzz:
  ↑ - | -
`}
/>

ラベル名から「何のための場所か」が分かると、分岐命令を読むたびに全体を探し直す必要が減ります。

## ローカル変数に名前を残す

スロット番号だけのコードは JVM には自然ですが、人間には読みづらいことがあります。JAL のローカル変数情報を使って、主要な値に名前を付けます。

<InstructionTrace
  trace={ `
  iconst_0
  ↑ 0 | -
  istore_1 [I -> index]
  ↑ - | index: 0

  aload_0
  ↑ this | 0: this; index: 0
  astore_2 [Ljava/lang/String; -> currentName]
  ↑ - | index: 0; currentName: this
`}
/>

名前を付ける対象は、引数、ループカウンタ、配列参照、例外オブジェクト、一時的でも意味を持つ中間結果です。逆に、直後に 1 回だけ使う値にまで名前を付ける必要はありません。

## メソッドは短く保つ

JAL の長いメソッドは、Java の長いメソッドよりも読みにくくなりがちです。スタックの状態、ローカル変数、ラベル、例外ハンドラを同時に追う必要があるためです。

次のような区切りでメソッド分割を検討します。

| 分割の目安 | 例 |
| --- | --- |
| まとまった計算 | `sum([I)I` |
| 文字列出力 | `printLine(Ljava/lang/String;)V` |
| 条件判定 | `isFizzBuzz(I)Z` |
| 配列操作 | `swap([III)V` |

小さいメソッドに分けると呼び出し命令は増えますが、学習用や検証用の JAL では読みやすさの価値が大きくなります。

## コメントはスタックではなく意図を書く

各命令の直訳コメントは、すぐにノイズになります。

<InstructionTrace
  trace={ `
  // count を 1 増やす
  ↑ - | 1: count
  iinc 1 1
  ↑ - | 1: count + 1
`}
/>

この程度なら有用です。一方で、次のようなコメントは命令名と同じことを繰り返しているだけです。

<InstructionTrace
  trace={ `
  // iload_1 で 1 番のローカルをロードする
  ↑ - | 1: value
  iload_1
  ↑ value | 1: value
`}
/>

コメントは、なぜその分岐があるのか、なぜ `dup` が必要なのか、どの Java 的な処理に対応するのかを説明するために使うと効果的です。

<InstructionTrace
  trace={ `
  // iastore が配列参照を消費するため、初期化後に保存する参照を残す。
  ↑ int[] | -
  dup
  ↑ int[]; int[] | -
  iconst_0
  ↑ int[]; int[]; 0 | -
  bipush 10
  ↑ int[]; int[]; 0; 10 | -
  iastore
  ↑ int[] | -
`}
/>

## 命令の短縮形を使い分ける

`iload_0` から `iload_3`、`istore_0` から `istore_3` のような短縮形は読みやすく、JVM 命令としても自然です。

<InstructionTrace
  trace={ `
  iload_0
  ↑ left | 0: left; 1: right
  iload_1
  ↑ left; right | 0: left; 1: right
  iadd
  ↑ left + right | 0: left; 1: right
  ireturn
  ↑ - | 0: left; 1: right
`}
/>

スロット番号が 4 以上になる場合や、名前ヒントを使う場合は通常形を使います。

<InstructionTrace
  trace={ `
  iload 5
  ↑ value | 5: value
  istore 6 [I -> result]
  ↑ - | 5: value; result: value
`}
/>

同じメソッド内では、短縮形と名前付き参照が混ざりすぎないようにします。引数や主要ローカルに名前を付けるなら、後続でもその名前を使うほうが読みやすくなります。

## スタックの合流点を単純にする

分岐が合流するラベルでは、スタックの状態をそろえます。複雑な値をスタックに残したまま複数経路を合流させるより、ローカル変数に保存してから合流させるほうが読みやすい場合があります。

<InstructionTrace
  trace={ `
    iload_0
    ↑ condition | 0: condition
    ifeq ElsePath
    ↑ - | 0: condition
  
    iconst_1
    ↑ 1 | 0: condition
    istore_1 [I -> result]
    ↑ - | 0: condition; result: 1
    goto Join
    ↑ - | 0: condition; result: 1

  ElsePath:
    ↑ - | 0: condition
    iconst_0
    ↑ 0 | 0: condition
    istore_1 [I -> result]
    ↑ - | 0: condition; result: 0

    Join:
    ↑ - | 0: condition; result: int
    iload result
    ↑ result | 0: condition; result: int
    ireturn
    ↑ - | 0: condition; result: int
`}
/>

命令数は少し増えますが、`Join` の時点でスタックが空であることが明確です。

## サンプルは Java 風の目的を添える

学習用の JAL では、「この命令列は Java でいう何に相当するか」を本文で説明すると理解しやすくなります。

<InstructionTrace
  trace={ `
  aload_1
  ↑ array | 1: array
  arraylength
  ↑ array.length | 1: array
  istore_2 [I -> length]
  ↑ - | 1: array; length: array.length
`}
/>

これは Java 風に書けば `int length = array.length;` です。JAL は低レイヤを学ぶための言語でもあるため、Java の見た目と JVM の命令列を対応させる説明が役立ちます。

## 例外処理では範囲を明確にする

例外処理では、保護範囲、ハンドラ、後処理のラベル名をそろえます。

<InstructionTrace
  trace={ `
  TryStart:
  ↑ - | -
    ...
    ↑ - | -
    goto Finally
    ↑ - | -

  IoCatch:
  ↑ IOException | -
    astore_1 [Ljava/io/IOException; -> error]
    ↑ - | error: IOException
    goto Finally
    ↑ - | error: IOException

  Finally:
  ↑ - | -
    return
    ↑ - | -
`}
/>

例外ハンドラの先頭では、スタック上の例外オブジェクトを `astore` するか `pop` します。これをラベル直後の定型として書くと、スタック状態が読みやすくなります。

## 最後に見るチェックリスト

JAL ファイルを書いたあと、次を確認します。

1. クラス名、ファイル名、出力したい class 名が一致しているか
2. `major_version` が想定する実行環境に合っているか
3. static と instance のスロット配置を取り違えていないか
4. `long` と `double` の 2 スロットを考慮しているか
5. 分岐の合流点でスタックがそろっているか
6. 呼び出し後の戻り値を使うか、`pop` しているか
7. return 命令がメソッド記述子の戻り型と合っているか

このチェックは、JAL をアセンブリ入門として使うときにも有効です。命令を並べるだけでなく、機械が読む状態を一貫させる練習になります。
