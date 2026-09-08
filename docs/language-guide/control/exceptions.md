---
title: 例外処理
description: 保護範囲と例外ハンドラをラベルで指定する。
---

# 例外処理

JAL の例外処理は，クラスファイルの例外テーブルを指定する記法です。保護範囲の開始・終了と，例外発生時の移動先をラベルで書きます。

## 例外を捕捉する

```jal
public class SafeDivision (major_version=55, minor_version=0) {
  public static divide(II)I {
  TryStart: [~ TryEnd, java/lang/ArithmeticException: Failed]
    iload_0
    iload_1
    idiv
  TryEnd:
    ireturn
  Failed:
    pop
    iconst_0
    ireturn
  }
}
```

二つの整数を割り，0 除算による `ArithmeticException` が発生した場合は `0` を返します。

| 記法 | 意味 |
| --- | --- |
| `TryStart:` | 保護範囲の開始位置。この位置の命令を含む |
| `[~ TryEnd, ...]` | 保護範囲の終了位置。`TryEnd` の位置の命令は含まない |
| `java/lang/ArithmeticException: Failed` | 対応する例外を `Failed` で処理する |

例外ハンドラに移ると，それまでのオペランドスタックは破棄され，例外オブジェクト一つが積まれます。この例では例外を使わないため，`pop` で捨てています。内容を参照したければ `astore` で保存します。

通常の実行がハンドラへ流れ込まないようにしてください。この例では正常経路が `ireturn` で終了します。処理を続ける例なら `goto` でハンドラを飛び越えます。

## 複数の例外型

```text
TryStart: [~ TryEnd,
  java/io/FileNotFoundException: Missing,
  java/io/IOException: Failed
]
```

ハンドラは例外テーブルの順に調べられます。先に広い型を置くと，後ろの狭い型のハンドラに届かなくなる場合があります。上の例では，`FileNotFoundException` をその親型の `IOException` より先に置いています。

## `->` は全例外を受けるハンドラを指定する

```text
TryStart: [~ TryEnd -> Cleanup]
```

この記法は，指定した保護範囲に，例外型を限定しないハンドラを登録します。`Cleanup` には例外オブジェクトが一つ積まれた状態で移ります。

Java の `finally` のように，正常終了，`return`，捕捉済み例外の後に自動で後処理を挿入する指定ではありません。正常経路からの後処理呼び出しや，例外を保存して後処理の後で `athrow` する命令は，別途書く必要があります。ハンドラ内部まで保護したければ，その範囲も別に指定します。

## 例外を投げ直す

ハンドラで受け取った例外は，ローカル変数に保存して後から投げ直せます。次はハンドラ本体の断片です。

```jal
astore_2
aload_2
athrow
```

`athrow` は参照を消費して例外を送出します。`null` を渡すと `NullPointerException` が発生します。
