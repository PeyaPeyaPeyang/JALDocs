---
title: 型記述子とメソッド記述子
description: JVM の型を表す文字列と，引数・戻り値の読み方。
---

# 型記述子とメソッド記述子

記述子は，クラスファイルで型を表す文字列です。JAL のフィールド宣言，メソッド宣言，メンバー参照に使います。

## 基本の型

| 記述子 | 型 |
| --- | --- |
| `Z` | `boolean` |
| `B` | `byte` |
| `C` | `char` |
| `S` | `short` |
| `I` | `int` |
| `J` | `long` |
| `F` | `float` |
| `D` | `double` |

`V` はメソッドの戻り値がないことを表します。引数やフィールドの型には使えません。

`boolean`，`byte`，`char`，`short` は，オペランドスタック上の計算では `int` として扱います。これらを返すメソッドの戻り命令も `ireturn` です。配列へのアクセスなどには型ごとの命令があります。

## クラス型と配列型

クラス型は `L内部名;` と書きます。たとえば `java.lang.String` は `Ljava/lang/String;` です。最後の `;` までが型記述子です。

配列は要素型の前に `[` を付けます。

| Java の型 | 記述子 |
| --- | --- |
| `String` | `Ljava/lang/String;` |
| `int[]` | `[I` |
| `int[][]` | `[[I` |
| `String[]` | `[Ljava/lang/String;` |
| `Object[][]` | `[[Ljava/lang/Object;` |

`[I` に末尾の `;` はありません。`[Ljava/lang/String;` の `;` は，要素であるクラス型を閉じる記号です。

## メソッドの引数と戻り値

```text
(引数の型を順に並べる)戻り型
```

引数同士をコンマで区切りません。クラス型は `;` まで，配列型は `[` とその後ろの要素型を合わせて一つと読みます。

| 記述子 | 意味 |
| --- | --- |
| `()V` | 引数なし，戻り値なし |
| `(II)I` | `int` を二つ受け取り，`int` を返す |
| `([Ljava/lang/String;)V` | `String[]` を一つ受け取り，戻り値なし |
| `(Ljava/lang/String;I)Z` | `String` と `int` を受け取り，`boolean` を返す |
| `([[D)[D` | `double[][]` を受け取り，`double[]` を返す |

メソッド名や `static` は記述子に含まれません。インスタンスメソッドの `this` も，引数型の一覧には書きません。

```jal
public static add(II)I {
  iload_0
  iload_1
  iadd
  ireturn
}
```

## 内部名と記述子を区別する

```text
getstatic java/lang/System->out:Ljava/io/PrintStream;
```

左側の `java/lang/System` はクラスの内部名です。右側の `Ljava/io/PrintStream;` はフィールドの型記述子です。`new java/lang/StringBuilder` のように内部名を取る命令と，`multianewarray [[I 2` のように配列記述子を取る命令があります。

記述子の文法は [JVM 仕様 §4.3](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-4.html#jvms-4.3) に定義されています。ローカル変数のスロット配置は [スタックとローカル変数](../runtime/stack-and-locals.md) を参照してください。
