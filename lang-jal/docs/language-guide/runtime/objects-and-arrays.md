---
title: オブジェクトと配列
description: new、コンストラクタ呼び出し、配列作成、配列アクセスをスタックの動きから理解する。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# オブジェクトと配列

オブジェクトと配列は、JAL ではどちらも参照値として扱います。ローカル変数に保存するときは `astore`、読み出すときは `aload`、戻り値として返すときは `areturn` を使います。一方で、作成やフィールドアクセス、配列要素アクセスではそれぞれ専用の命令があります。

## オブジェクトを作る

JVM でオブジェクトを作る基本形は、`new`、`dup`、`invokespecial <init>` の組み合わせです。

<InstructionTrace
  trace={ `
  new java/lang/StringBuilder
  ↑ builder | -
  dup
  ↑ builder; builder | -
  invokespecial java/lang/StringBuilder-><init>()V
  ↑ builder | -
  astore_1
  ↑ - | 1: builder
`}
/>

`new` は未初期化のオブジェクト参照を積みます。`invokespecial` でコンストラクタを呼ぶとき、その参照が消費されます。初期化後の参照をローカル変数に残したいので、事前に `dup` で複製します。

引数付きコンストラクタなら、`this` に相当する参照の後に引数を積みます。

<InstructionTrace
  trace={ `
  new java/lang/StringBuilder
  ↑ builder | -
  dup
  ↑ builder; builder | -
  ldc "prefix"
  ↑ builder; builder; "prefix" | -
  invokespecial java/lang/StringBuilder-><init>(Ljava/lang/String;)V
  ↑ builder | -
  astore_1
  ↑ - | 1: builder
`}
/>

## インスタンスメソッドを呼ぶ

インスタンスメソッドでは、対象オブジェクトを最初に積み、その後に引数を積みます。

<InstructionTrace
  trace={ `
  aload_1
  ↑ builder | 1: builder
  ldc "value"
  ↑ builder; "value" | 1: builder
  invokevirtual java/lang/StringBuilder->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
  ↑ builder | 1: builder
  pop
  ↑ - | 1: builder
`}
/>

`append` は `StringBuilder` を返します。この戻り値を使わないなら `pop` で捨てます。戻り値を使うなら、次の呼び出しにそのままつなげられます。

<InstructionTrace
  trace={ `
  aload_1
  ↑ builder | 1: builder
  ldc "value"
  ↑ builder; "value" | 1: builder
  invokevirtual java/lang/StringBuilder->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
  ↑ builder | 1: builder
  invokevirtual java/lang/StringBuilder->toString()Ljava/lang/String;
  ↑ result | 1: builder
  areturn
  ↑ - | 1: builder
`}
/>

## インスタンスフィールド

インスタンスフィールドを読むには、対象オブジェクトをスタックに積みます。

<InstructionTrace
  trace={ `
  aload_0
  ↑ this | 0: this
  getfield Point->x:I
  ↑ this.x | 0: this
  ireturn
  ↑ - | 0: this
`}
/>

書き込む場合は、対象オブジェクトと値をこの順に積みます。

<InstructionTrace
  trace={ `
  aload_0
  ↑ this | 0: this; 1: x
  iload_1
  ↑ this; x | 0: this; 1: x
  putfield Point->x:I
  ↑ - | 0: this; 1: x
`}
/>

`putfield` の後、スタックには何も残りません。

## プリミティブ配列

プリミティブ配列は `newarray` で作ります。先に長さを積みます。

<InstructionTrace
  trace={ `
  iconst_5
  ↑ 5 | -
  newarray I
  ↑ int[5] | -
  astore_1
  ↑ - | 1: int[5]
`}
/>

これは `new int[5]` に相当します。`newarray` の引数は要素型です。

| JAL | Java の配列 |
| --- | --- |
| `newarray I` | `int[]` |
| `newarray Z` | `boolean[]` |
| `newarray J` | `long[]` |
| `newarray D` | `double[]` |

要素を書き込むときは、配列参照、インデックス、値を積みます。

<InstructionTrace
  trace={ `
  aload_1
  ↑ int[] | 1: int[]
  iconst_0
  ↑ int[]; 0 | 1: int[]
  bipush 42
  ↑ int[]; 0; 42 | 1: int[]
  iastore
  ↑ - | 1: int[]
`}
/>

読み出すときは、配列参照とインデックスを積みます。

<InstructionTrace
  trace={ `
  aload_1
  ↑ int[] | 1: int[]
  iconst_0
  ↑ int[]; 0 | 1: int[]
  iaload
  ↑ int[0] | 1: int[]
  ireturn
  ↑ - | 1: int[]
`}
/>

## 参照型配列

参照型配列は `anewarray` を使います。

<InstructionTrace
  trace={ `
  iconst_3
  ↑ 3 | -
  anewarray java/lang/String
  ↑ String[3] | -
  astore_1
  ↑ - | 1: String[3]
`}
/>

要素の読み書きには `aaload` と `aastore` を使います。

<InstructionTrace
  trace={ `
  aload_1
  ↑ String[] | 1: String[]
  iconst_0
  ↑ String[]; 0 | 1: String[]
  ldc "first"
  ↑ String[]; 0; "first" | 1: String[]
  aastore
  ↑ - | 1: String[]

  aload_1
  ↑ String[] | 1: String[]
  iconst_0
  ↑ String[]; 0 | 1: String[]
  aaload
  ↑ String[0] | 1: String[]
  areturn
  ↑ - | 1: String[]
`}
/>

配列型の記述子では `String[]` は `[Ljava/lang/String;` と書きますが、`anewarray` の引数には要素型の内部名を書く形になります。

## 多次元配列

多次元配列は `multianewarray` を使います。作りたい各次元の長さを積み、配列型記述子と次元数を指定します。

<InstructionTrace
  trace={ `
  iconst_2
  ↑ 2 | -
  iconst_3
  ↑ 2; 3 | -
  multianewarray [[I 2
  ↑ int[2][3] | -
  astore_1
  ↑ - | 1: int[2][3]
`}
/>

これは `new int[2][3]` に相当します。`[[I` は int の 2 次元配列、最後の `2` は初期化する次元数です。

## 配列長

配列長は `arraylength` で取得します。

<InstructionTrace
  trace={ `
  aload_0
  ↑ array | 0: array
  arraylength
  ↑ array.length | 0: array
  ireturn
  ↑ - | 0: array
`}
/>

`arraylength` は配列参照を 1 つ消費し、int の長さを積みます。

## 配列初期化での dup

配列を作ってすぐ複数の要素を設定する場合、`dup` を使うと配列参照を何度も使えます。

<InstructionTrace
  trace={ `
  iconst_3
  ↑ 3 | -
  newarray I
  ↑ int[3] | -
  dup
  ↑ int[3]; int[3] | -
  iconst_0
  ↑ int[3]; int[3]; 0 | -
  bipush 10
  ↑ int[3]; int[3]; 0; 10 | -
  iastore
  ↑ int[3] | -
  dup
  ↑ int[3]; int[3] | -
  iconst_1
  ↑ int[3]; int[3]; 1 | -
  bipush 20
  ↑ int[3]; int[3]; 1; 20 | -
  iastore
  ↑ int[3] | -
  dup
  ↑ int[3]; int[3] | -
  iconst_2
  ↑ int[3]; int[3]; 2 | -
  bipush 30
  ↑ int[3]; int[3]; 2; 30 | -
  iastore
  ↑ int[3] | -
  astore_1
  ↑ - | 1: int[3]
`}
/>

各 `iastore` は配列参照を消費します。`dup` がなければ、1 回目の書き込みの後に配列参照がなくなり、次の要素を書けません。

## null と型チェック

参照型では `aconst_null`、`checkcast`、`instanceof` もよく使います。

<InstructionTrace
  trace={ `
  aconst_null
  ↑ null | -
  areturn
  ↑ - | -
`}
/>

<InstructionTrace
  trace={ `
  aload_0
  ↑ value | 0: value
  checkcast java/lang/String
  ↑ (String) value | 0: value
  areturn
  ↑ - | 0: value
`}
/>

<InstructionTrace
  trace={ `
  aload_0
  ↑ value | 0: value
  instanceof java/lang/String
  ↑ value instanceof String | 0: value
  ireturn
  ↑ - | 0: value
`}
/>

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
