---
title: スタックとローカル変数
description: JVM のオペランドスタック、ローカル変数スロット、名前ヒントの読み方。
---

# スタックとローカル変数

JAL のメソッド本体を理解するには、オペランドスタックとローカル変数スロットの 2 つを追う必要があります。命令は値をスタックに積み、必要な値を取り出し、結果を積み直します。ローカル変数は、途中結果や引数を保存するスロットです。

## オペランドスタック

次のメソッドを考えます。

```jal
public static add(II)I {
  iload_0
  iload_1
  iadd
  ireturn
}
```

命令ごとのスタックは次のように変わります。

| 命令 | 実行後のスタック |
| --- | --- |
| `iload_0` | `arg0` |
| `iload_1` | `arg0`, `arg1` |
| `iadd` | `arg0 + arg1` |
| `ireturn` | 空になる |

`iadd` は int を 2 つ取り出して、int の結果を 1 つ積みます。`ireturn` は戻り値を取り出して呼び出し元へ返します。

## ローカル変数スロット

ローカル変数スロットは番号で指定します。`iload_0` はスロット 0 から int を読み、`istore_1` はスロット 1 に int を保存します。

```jal
iconst_0
istore_1

iload_1
bipush 10
iadd
istore_1
```

この例では、スロット 1 に 0 を入れ、その後 10 を足して同じスロットへ戻しています。

## static と instance の違い

static メソッドでは引数がスロット 0 から始まります。

```jal
public static twice(I)I {
  iload_0
  iconst_2
  imul
  ireturn
}
```

インスタンスメソッドではスロット 0 が `this` です。最初の引数はスロット 1 になります。

```jal
public twice(I)I {
  iload_1
  iconst_2
  imul
  ireturn
}
```

インスタンスフィールドを読むときは、`this` を `aload_0` で積みます。

```jal
aload_0
getfield Counter->value:I
```

## long と double は 2 スロット

`long` と `double` はローカル変数スロットを 2 つ使います。これは JVM の重要なルールです。

```jal
public static mix(JI)I {
  iload_2
  ireturn
}
```

この static メソッドでは、`J` の引数がスロット 0 と 1 を使うため、次の `I` 引数はスロット 2 に入ります。`double` でも同じです。

インスタンスメソッドなら、さらにスロット 0 の `this` があるため配置が変わります。

```jal
public mix(JI)I {
  iload_3
  ireturn
}
```

この場合、スロット 0 が `this`、スロット 1 と 2 が `long`、スロット 3 が `int` です。

## 名前ヒント

JAL ではロードやストアにローカル変数情報を添えられます。

```jal
iconst_0
istore_1 [I -> count]

iload count
```

名前ヒントを使うと、スロット番号だけのコードより意図が読みやすくなります。特にループ変数や一時変数が増えるメソッドでは、変数名を付けることでスタックの追跡が楽になります。

名前は可読性のための情報ですが、型やスコープのヒントを残せるため、IDE やデバッグ時にも役立ちます。

```jal
astore_2 [Ljava/lang/String; -> message]
aload message
```

## スタック操作命令

JVM では、同じ値を複数回使うために `dup` をよく使います。配列初期化やオブジェクト初期化で特に重要です。

```jal
iconst_3
newarray I
dup
iconst_0
bipush 10
iastore
astore_1
```

`newarray` の結果は配列参照です。`iastore` は配列参照、インデックス、値を消費します。最後に配列参照をローカル変数へ保存したいので、先に `dup` で参照を複製しています。

| 命令 | 用途 |
| --- | --- |
| `dup` | スタックトップを複製する |
| `dup2` | 1 つの 2 ワード値、または 2 つの 1 ワード値を複製する |
| `swap` | 上位 2 要素を入れ替える |
| `pop` | 上位 1 要素を捨てる |
| `pop2` | 2 ワード分を捨てる |

## スタックを壊しやすいパターン

メソッド呼び出しでは、呼び出し対象と引数がすべてスタックから消費されます。

```jal
getstatic java/lang/System->out:Ljava/io/PrintStream;
ldc "hello"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

`invokevirtual` は `PrintStream` の参照と `String` 引数を消費します。戻り型が `V` なので、呼び出し後のスタックには何も残りません。

戻り値があるメソッドなら、呼び出し後に戻り値が積まれます。

```jal
ldc "abc"
invokevirtual java/lang/String->length()I
ireturn
```

この場合、`length()` の戻り値 int がスタックに残り、`ireturn` がそれを返します。

## 読み書きのチェックリスト

メソッドの命令列がうまく読めないときは、次を確認します。

1. static メソッドか instance メソッドか
2. 引数がどのスロットに入るか
3. `long` と `double` が 2 スロットを使っていないか
4. 各命令がスタックから何を消費するか
5. 分岐先でもスタックの形が合っているか
6. 戻り命令とメソッド記述子の戻り型が一致しているか

JAL では StackMapFrame が自動生成されますが、スタックの整合性そのものは命令列の意味として重要です。まず人間が読んで筋が通る形にしておくと、検証エラーや実行時エラーを避けやすくなります。
