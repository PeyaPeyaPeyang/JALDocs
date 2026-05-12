---
title: メソッド呼び出し
description: invokevirtual、invokespecial、invokestatic、invokeinterface の違いとスタックの並べ方。
---

# メソッド呼び出し

JAL のメソッド呼び出しは、JVM の呼び出し命令に直接対応します。どの命令を使うかは、呼び出すメソッドが static か、インスタンスメソッドか、コンストラクタか、インターフェース経由かで変わります。

## 呼び出しの基本形

メソッド参照は次の形です。

```text
ClassName->methodName(ArgumentTypes)ReturnType
```

例:

```jal
java/io/PrintStream->println(Ljava/lang/String;)V
java/lang/Math->max(II)I
java/lang/String->length()I
```

クラス名は JVM 内部名で、パッケージ区切りは `/` です。引数と戻り値はメソッド記述子で書きます。

## invokestatic

static メソッドは `invokestatic` で呼びます。対象オブジェクトは不要で、引数だけをスタックに積みます。

```jal
bipush 10
bipush 20
invokestatic java/lang/Math->max(II)I
ireturn
```

この例では、`max` が 2 つの int を消費し、int の戻り値を 1 つ積みます。

## invokevirtual

通常のインスタンスメソッドは `invokevirtual` で呼びます。最初に対象オブジェクトを積み、その後に引数を積みます。

```jal
getstatic java/lang/System->out:Ljava/io/PrintStream;
ldc "hello"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

`println` の呼び出し時、スタックには下から `PrintStream`、`String` の順に値があります。呼び出し後はどちらも消費されます。戻り型が `V` なので、結果は残りません。

戻り値がある場合は、戻り値がスタックに積まれます。

```jal
ldc "hello"
invokevirtual java/lang/String->length()I
ireturn
```

## invokespecial

`invokespecial` は主にコンストラクタ、private メソッド、super 呼び出しで使います。

```jal
aload_0
invokespecial java/lang/Object-><init>()V
return
```

コンストラクタ呼び出しでは、対象オブジェクトを積んでから `<init>` を呼びます。オブジェクトを新しく作る場合は、`new` と `dup` と組み合わせます。

```jal
new java/lang/StringBuilder
dup
invokespecial java/lang/StringBuilder-><init>()V
areturn
```

`dup` がないと、コンストラクタ呼び出しで参照が消費され、返すための参照が残りません。

## invokeinterface

インターフェース型を通じた呼び出しは `invokeinterface` を使います。

```jal
aload_1
ldc "item"
invokeinterface java/util/List->add(Ljava/lang/Object;)Z
pop
```

戻り値の `Z` は boolean ですが、スタック上では int 相当です。この例では結果を使わないため `pop` しています。

## 呼び出し前のスタック順

メソッド呼び出しで最も大事なのは、スタックに値を積む順番です。

| 呼び出し | スタックに積むもの |
| --- | --- |
| static メソッド | 引数 1、引数 2、... |
| instance メソッド | 対象オブジェクト、引数 1、引数 2、... |
| コンストラクタ | 未初期化オブジェクト、引数 1、引数 2、... |
| interface メソッド | 対象オブジェクト、引数 1、引数 2、... |

引数は Java のメソッド呼び出しと同じ左から右の順に積みます。呼び出し命令が必要な個数をまとめて消費します。

## 戻り値の扱い

戻り値があるメソッドを呼んだ後、その値はスタックに残ります。使わないなら捨てる必要があります。

```jal
aload_1
ldc "x"
invokevirtual java/lang/StringBuilder->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
pop
```

戻り値を続けて使うなら、そのまま次の命令につなげられます。

```jal
aload_1
ldc "x"
invokevirtual java/lang/StringBuilder->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
invokevirtual java/lang/StringBuilder->toString()Ljava/lang/String;
areturn
```

戻り型と戻り命令も一致させます。

| 戻り型 | 戻り命令 |
| --- | --- |
| `V` | `return` |
| `I`, `Z`, `B`, `C`, `S` | `ireturn` |
| `J` | `lreturn` |
| `F` | `freturn` |
| `D` | `dreturn` |
| オブジェクト、配列 | `areturn` |

## オーバーロード

Java では同じメソッド名でも引数型が違えば別メソッドです。JVM でも、メソッド名と記述子の組み合わせで解決します。

```jal
invokevirtual java/io/PrintStream->println(I)V
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
invokevirtual java/io/PrintStream->println()V
```

`println` という名前だけでは不十分で、どの型を渡すかを記述子で明確にします。JAL ではこの違いがソース上にそのまま出ます。

## よくあるミス

インスタンスメソッドなのに対象オブジェクトを積み忘れると、呼び出し命令が必要なスタックを満たせません。

```jal
// 対象の PrintStream がない
ldc "hello"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

正しくは `System.out` などの対象を先に積みます。

```jal
getstatic java/lang/System->out:Ljava/io/PrintStream;
ldc "hello"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

もう 1 つの典型的なミスは、戻り値を放置することです。`V` メソッドから戻る直前に余分な値が残っていると、メソッド全体のスタック整合性が崩れます。使わない戻り値は `pop` し、使う戻り値は次の命令で消費するようにします。
