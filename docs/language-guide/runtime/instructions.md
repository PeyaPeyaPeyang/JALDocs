---
title: 命令の分類
description: 用途と値の型から JVM 命令を探す。
---

# 命令の分類

JAL では `iload` や `invokevirtual` など，JVM 命令の名前を使います。このページは用途別の案内です。個々の命令のスタック変化と使用例は，[Jaspera](https://jal.yamad.jp/jaspera/) の「命令」パネルで検索できます。

## 定数を積む

| 命令 | 積む値 |
| --- | --- |
| `aconst_null` | `null` |
| `iconst_m1`，`iconst_0`〜`iconst_5` | −1〜5 の `int` |
| `bipush n` | −128〜127 の整数を `int` として積む |
| `sipush n` | −32768〜32767 の整数を `int` として積む |
| `lconst_0`，`lconst_1` | 0 または 1 の `long` |
| `fconst_0`〜`fconst_2` | 0〜2 の `float` |
| `dconst_0`，`dconst_1` | 0 または 1 の `double` |
| `ldc` | 文字列などの定数プールの値 |

`bipush` で積んだ値も，スタック上では `byte` ではなく `int` です。クラスファイルには定数プールのインデックス幅による `ldc_w` と，`long`・`double` 用の `ldc2_w` もあります。

## 値の型と命令名

| 接頭辞 | 主に扱う型 | 例 |
| --- | --- | --- |
| `i` | `int` | `iload`，`istore`，`iadd` |
| `l` | `long` | `lload`，`lstore`，`ladd` |
| `f` | `float` | `fload`，`fstore`，`fadd` |
| `d` | `double` | `dload`，`dstore`，`dadd` |
| `a` | オブジェクト・配列の参照 | `aload`，`astore`，`areturn` |

ロードとストアには `iload 2` のような通常形と，スロット 0〜3 を指定する `iload_2` などの短縮形があります。参照を足し算する `aadd` のような命令はありません。

## 計算する

`add`，`sub`，`mul`，`div`，`rem`，`neg` に型の接頭辞を付けます。`isub` は二つの整数の差，`ddiv` は二つの `double` の商を求めます。

整数の除算は小数部分を 0 に向かって切り捨てます。`idiv` と `ldiv` で 0 除算すると `ArithmeticException` になります。浮動小数点の除算は同じ扱いではなく，無限大や NaN になる場合があります。

`iinc スロット 増分` はローカル変数の `int` を直接増減し，スタックを変えません。ビット演算には `iand`，`ior`，`ixor` など，型変換には `i2l`，`d2i` などがあります。

## スタック・配列・呼び出し

| 目的 | 命令と説明 |
| --- | --- |
| 複製・交換・破棄 | `dup`，`swap`，`pop` など。[カテゴリによる制約](./stack-and-locals.md)あり |
| オブジェクト生成 | `new` とコンストラクタ呼び出し |
| 配列生成 | `newarray`，`anewarray`，`multianewarray` |
| 配列アクセス | `iaload`，`iastore`，`aaload`，`aastore` など |
| フィールド | `getstatic`，`putstatic`，`getfield`，`putfield` |
| メソッド呼び出し | `invokestatic`，`invokevirtual`，`invokespecial`，`invokeinterface`，`invokedynamic` |
| 分岐 | `if*`，`goto`，`tableswitch`，`lookupswitch` |
| 例外を投げる | `athrow` |

[オブジェクトと配列](./objects-and-arrays.md)，[メソッド呼び出し](./method-invocation.md)，[制御フロー](../control/control-flow.md)に具体例があります。

## メソッドから戻る

| 戻り型 | 命令 |
| --- | --- |
| `V` | `return` |
| `I`，`Z`，`B`，`C`，`S` | `ireturn` |
| `J` | `lreturn` |
| `F` | `freturn` |
| `D` | `dreturn` |
| クラス型・配列型 | `areturn` |

戻り命令はフレームを終了します。単なるラベルへのジャンプとは異なります。命令の厳密な動作・制約・例外は [JVM 仕様 第6章](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-6.html) を参照してください。
