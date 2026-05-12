---
title: オブジェクトと配列
description: new、コンストラクタ呼び出し、配列作成、配列アクセスをスタックの動きから理解する。
---

# オブジェクトと配列

オブジェクトと配列は、JAL ではどちらも参照値として扱います。ローカル変数に保存するときは `astore`、読み出すときは `aload`、戻り値として返すときは `areturn` を使います。一方で、作成やフィールドアクセス、配列要素アクセスではそれぞれ専用の命令があります。

## オブジェクトを作る

JVM でオブジェクトを作る基本形は、`new`、`dup`、`invokespecial <init>` の組み合わせです。

```jal
new java/lang/StringBuilder
dup
invokespecial java/lang/StringBuilder-><init>()V
astore_1
```

`new` は未初期化のオブジェクト参照を積みます。`invokespecial` でコンストラクタを呼ぶとき、その参照が消費されます。初期化後の参照をローカル変数に残したいので、事前に `dup` で複製します。

引数付きコンストラクタなら、`this` に相当する参照の後に引数を積みます。

```jal
new java/lang/StringBuilder
dup
ldc "prefix"
invokespecial java/lang/StringBuilder-><init>(Ljava/lang/String;)V
astore_1
```

## インスタンスメソッドを呼ぶ

インスタンスメソッドでは、対象オブジェクトを最初に積み、その後に引数を積みます。

```jal
aload_1
ldc " value"
invokevirtual java/lang/StringBuilder->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
pop
```

`append` は `StringBuilder` を返します。この戻り値を使わないなら `pop` で捨てます。戻り値を使うなら、次の呼び出しにそのままつなげられます。

```jal
aload_1
ldc " value"
invokevirtual java/lang/StringBuilder->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
invokevirtual java/lang/StringBuilder->toString()Ljava/lang/String;
areturn
```

## インスタンスフィールド

インスタンスフィールドを読むには、対象オブジェクトをスタックに積みます。

```jal
aload_0
getfield Point->x:I
ireturn
```

書き込む場合は、対象オブジェクトと値をこの順に積みます。

```jal
aload_0
iload_1
putfield Point->x:I
```

`putfield` の後、スタックには何も残りません。

## プリミティブ配列

プリミティブ配列は `newarray` で作ります。先に長さを積みます。

```jal
iconst_5
newarray I
astore_1
```

これは `new int[5]` に相当します。`newarray` の引数は要素型です。

| JAL | Java の配列 |
| --- | --- |
| `newarray I` | `int[]` |
| `newarray Z` | `boolean[]` |
| `newarray J` | `long[]` |
| `newarray D` | `double[]` |

要素を書き込むときは、配列参照、インデックス、値を積みます。

```jal
aload_1
iconst_0
bipush 42
iastore
```

読み出すときは、配列参照とインデックスを積みます。

```jal
aload_1
iconst_0
iaload
ireturn
```

## 参照型配列

参照型配列は `anewarray` を使います。

```jal
iconst_3
anewarray java/lang/String
astore_1
```

要素の読み書きには `aaload` と `aastore` を使います。

```jal
aload_1
iconst_0
ldc "first"
aastore

aload_1
iconst_0
aaload
areturn
```

配列型の記述子では `String[]` は `[Ljava/lang/String;` と書きますが、`anewarray` の引数には要素型の内部名を書く形になります。

## 多次元配列

多次元配列は `multianewarray` を使います。作りたい各次元の長さを積み、配列型記述子と次元数を指定します。

```jal
iconst_2
iconst_3
multianewarray [[I 2
astore_1
```

これは `new int[2][3]` に相当します。`[[I` は int の 2 次元配列、最後の `2` は初期化する次元数です。

## 配列長

配列長は `arraylength` で取得します。

```jal
aload_0
arraylength
ireturn
```

`arraylength` は配列参照を 1 つ消費し、int の長さを積みます。

## 配列初期化での dup

配列を作ってすぐ複数の要素を設定する場合、`dup` を使うと配列参照を何度も使えます。

```jal
iconst_3
newarray I
dup
iconst_0
bipush 10
iastore
dup
iconst_1
bipush 20
iastore
dup
iconst_2
bipush 30
iastore
astore_1
```

各 `iastore` は配列参照を消費します。`dup` がなければ、1 回目の書き込みの後に配列参照がなくなり、次の要素を書けません。

## null と型チェック

参照型では `aconst_null`、`checkcast`、`instanceof` もよく使います。

```jal
aconst_null
areturn
```

```jal
aload_0
checkcast java/lang/String
areturn
```

```jal
aload_0
instanceof java/lang/String
ireturn
```

`instanceof` の戻り値は boolean 相当ですが、JVM では int として扱われるため `ireturn` を使います。

## オブジェクトと配列の読み方

オブジェクトや配列を含む命令列では、参照がどこで消費されるかを見るのが重要です。

| 命令 | 消費するもの | 積むもの |
| --- | --- | --- |
| `new` | なし | 未初期化参照 |
| `invokespecial <init>` | 対象参照と引数 | 通常なし |
| `getfield` | 対象参照 | フィールド値 |
| `putfield` | 対象参照と値 | なし |
| `newarray` | 長さ | 配列参照 |
| `iaload` | 配列参照と index | int 要素 |
| `iastore` | 配列参照、index、値 | なし |
| `arraylength` | 配列参照 | int 長 |

この表を横に置いて読むと、`dup` が必要な場所や `pop` すべき戻り値が見つけやすくなります。
