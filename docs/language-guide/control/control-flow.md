---
title: 制御フロー
description: ラベル，条件分岐，ループ，switch の記法。
---

# 制御フロー

命令は通常，上から順に実行します。分岐命令は，ラベルで指定した位置へ実行を移します。ラベルは同じメソッドの中で参照し，ラベル自身はバイトコードを生成しません。

## 条件によって分岐する

```jal
public static positive(I)Z {
  iload_0
  ifle NonPositive
  iconst_1
  ireturn
NonPositive:
  iconst_0
  ireturn
}
```

`ifle` は整数を一つ取り出し，0 以下なら分岐します。条件を満たさなければ直後の命令へ進みます。どちらの経路でも，比較に使った値はスタックから取り出されます。

| 命令 | 比較するもの |
| --- | --- |
| `ifeq`，`ifne`，`iflt`，`ifle`，`ifgt`，`ifge` | `int` と 0 |
| `if_icmp*` | 二つの `int` |
| `ifnull`，`ifnonnull` | 参照と `null` |
| `if_acmpeq`，`if_acmpne` | 二つの参照が同じかどうか |

二つの整数を下から `a, b` と積んだ場合，`if_icmplt` は `a < b` で分岐します。参照の比較は同じオブジェクトを指すかの比較であり，文字列の内容を比べる操作ではありません。

`long` は `lcmp`，浮動小数点は `fcmp*`・`dcmp*` で比較結果の `int` を作り，続く条件分岐で使います。浮動小数点の比較では NaN の扱いに応じて `g` と `l` を選びます。

## ループ

```jal
public static sum()I {
  iconst_0
  istore_0
  iconst_1
  istore_1
Loop:
  iload_1
  bipush 10
  if_icmpgt Done
  iload_0
  iload_1
  iadd
  istore_0
  iinc 1 1
  goto Loop
Done:
  iload_0
  ireturn
}
```

1 から 10 までを加算して `55` を返します。スロット 0 は合計，スロット 1 は加算する数です。`goto` は条件なしで分岐します。各周回で `Loop` に戻る時点のスタックは空です。

## switch

`tableswitch` は連続する整数の範囲を扱います。最初の数が最小値で，列挙したラベルに順番に対応します。

```jal
public static table(I)I {
  iload_0
  tableswitch 1 {
    One,
    Two
  } default Other
One:
  bipush 10
  ireturn
Two:
  bipush 20
  ireturn
Other:
  iconst_m1
  ireturn
}
```

`lookupswitch` はキーとラベルの組を指定します。比較する `int` を一つ消費する点は同じです。キーは重複させず，昇順に書きます。

```jal
public static lookup(I)I {
  iload_0
  lookupswitch {
    10: Ten,
    100: Hundred,
    default: Other
  }
Ten:
  iconst_1
  ireturn
Hundred:
  iconst_2
  ireturn
Other:
  iconst_m1
  ireturn
}
```

ラベルはブロックを自動で終了しません。ケースの最後から次のケースへ進めたくない場合は，戻り命令か `goto` を書きます。分岐が合流する場合の条件は [StackMapFrame と検証](./stackmap-and-verification.md) を参照してください。
