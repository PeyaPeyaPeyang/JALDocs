---
title: 命令
description: JAL でよく使う JVM 命令のカテゴリ別リファレンス。
---

# 命令

JAL の命令は JVM バイトコードのニーモニックを基本にしています。命令は 1 行に 1 つ書くのが読みやすい形式です。セミコロンは書けますが、必須ではありません。

## 定数を積む

```jal
aconst_null
iconst_m1
iconst_0
iconst_5
bipush 100
sipush 10000
ldc "Hello"
```

小さい整数は `iconst_*`、byte 範囲は `bipush`、short 範囲は `sipush`、文字列や定数プールに載る値は `ldc` を使います。

## ロードとストア

```jal
iload_0
iload 5
aload_1
istore_2
astore 10
```

`i` は int、`l` は long、`f` は float、`d` は double、`a` は参照型です。`_0` から `_3` までの短縮形と、任意スロットを指定する通常形があります。

ローカル変数には名前や型のヒントを付けられます。

```jal
istore_1 [I -> counter]
aload_2 [-> message]
iload counter
```

## スタック操作

```jal
dup
dup2
swap
pop
pop2
```

JVM はスタックマシンなので、演算前に値を積み、演算後の結果をスタックから返すか保存します。

## 算術

```jal
iadd
isub
imul
idiv
irem
iinc 1 1
```

型ごとに命令名が分かれています。long は `ladd`、float は `fadd`、double は `dadd` のように接頭辞が変わります。

## 配列

```jal
iconst_5
newarray I
dup
iconst_0
iconst_5
iastore
```

プリミティブ配列は `newarray`、参照配列は `anewarray`、多次元配列は `multianewarray` を使います。アクセス命令も型ごとに `iaload`、`iastore`、`aaload`、`aastore` のように分かれます。

## フィールドとメソッド

```jal
getstatic java/lang/System->out:Ljava/io/PrintStream;
putfield Example->count:I
invokestatic java/lang/Math->sqrt(D)D
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

命令名は JVM の呼び出し形式に対応します。コンストラクタや private メソッド、super 呼び出しは `invokespecial` を使います。

## 戻り値

```jal
ireturn
lreturn
freturn
dreturn
areturn
return
```

戻り命令はメソッド記述子の戻り型と一致させます。`V` のメソッドでは `return` を使います。
