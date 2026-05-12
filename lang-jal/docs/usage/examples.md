---
title: サンプル
description: HelloWorld、FizzBuzz、配列、switch の JAL サンプル。
---

# サンプル

このリポジトリの `examples/` には、JAL の基本パターンを確認できるサンプルがあります。

## HelloWorld

```jal
public class HelloWorld (
  major_version=55,
  minor_version=0) {

  public static main([Ljava/lang/String;)V {
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    ldc "Hello, World!"
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
    return
  }
}
```

ポイント:

- `getstatic` で `System.out` を取得する
- `ldc` で文字列定数を積む
- `invokevirtual` で `PrintStream.println` を呼ぶ
- `return` で `void` メソッドから戻る

## FizzBuzz

```jal
LoopStart:
  iload_1
  bipush 101
  if_icmpge LoopEnd

  iload_1
  bipush 15
  irem
  ifne NotFizzBuzz

  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ldc "FizzBuzz"
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  goto LoopIncrement
```

FizzBuzz では、`irem`、条件分岐、ラベル、`goto` によるループをまとめて確認できます。

## 配列

```jal
iconst_5
newarray I
dup
iconst_0
iconst_5
iastore
astore_1
```

配列サンプルでは、配列参照を `dup` で残しながら `iastore` で要素を書き込みます。

## switch

`SwitchExample.jal` では `tableswitch` の使い方を確認できます。連続した整数ケースでは `tableswitch`、値が飛び飛びの場合は `lookupswitch` を選びます。

## 実行

CLI コンパイラを使う場合:

```bash
jalc examples/HelloWorld.jal --output build/classes
```

jar として出力する場合:

```bash
jalc examples --output build/examples.jar
```
