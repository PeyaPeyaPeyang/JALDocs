---
title: メソッド呼び出し
description: 呼び出し命令の選択と，引数・戻り値の受け渡し。
---

# メソッド呼び出し

メソッド参照には，参照先のクラスまたはインターフェース，メソッド名，記述子を書きます。

```text
java/io/PrintStream->println(Ljava/lang/String;)V
```

メソッド名だけでなく，記述子も参照の一部です。`println(I)V` と `println(Ljava/lang/String;)V` は別のメソッドを指定します。

## 対象と引数を順に積む

```jal
getstatic java/lang/System->out:Ljava/io/PrintStream;
ldc "hello"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

インスタンスメソッドを呼ぶ前には，対象オブジェクトを積み，その上に宣言順で引数を積みます。この例の呼び出し直前は，下から `System.out`，`"hello"` の順です。

呼び出し命令は対象と引数を消費します。正常に戻ると，戻り型が `V` 以外なら戻り値を積みます。対象や引数より下にあった値は残ります。

## 呼び出し命令を選ぶ

| 命令 | 用途 |
| --- | --- |
| `invokestatic` | static メソッド。対象オブジェクトは積まない |
| `invokevirtual` | クラスのインスタンスメソッド。実際の対象クラスに応じて実装を選ぶ |
| `invokeinterface` | インターフェースのインスタンスメソッド |
| `invokespecial` | コンストラクタ，親クラスの実装を指定する呼び出しなど |
| `invokedynamic` | ブートストラップメソッドで呼び出し先を結び付ける動的呼び出し |

通常のインスタンス呼び出しと，コンストラクタや親実装の呼び出しを区別してください。private メソッドの呼び出しにも `invokespecial` が使われますが，private なら常にこの命令しか使えないという規則ではありません。

## static メソッド

```jal
public static maximum()I {
  bipush 10
  bipush 20
  invokestatic java/lang/Math->max(II)I
  ireturn
}
```

`max` に渡す二つの整数だけを積みます。戻り値 `20` は呼び出し元のスタックに積まれ，この例ではそのまま返します。

## コンストラクタ

```jal
public static builder()Ljava/lang/StringBuilder; {
  new java/lang/StringBuilder
  dup
  invokespecial java/lang/StringBuilder-><init>()V
  areturn
}
```

`new` は未初期化の参照を積みます。コンストラクタは参照を一つ消費し，値を返しません。`dup` で残した同じオブジェクトへの参照を，初期化後に `areturn` で返しています。

## インターフェース経由

```jal
public static addItem(Ljava/util/List;)V {
  aload_0
  ldc "item"
  invokeinterface java/util/List->add(Ljava/lang/Object;)Z
  pop
  return
}
```

`List.add` の戻り型は `boolean` ですが，スタック上では `int` です。ここでは使わないため `pop` で捨てます。`long` や `double` の戻り値なら `pop2` を使います。

## 呼び出し後と例外

呼び出し先が例外を投げ，正常に戻らなければ，通常の戻り値は積まれません。該当する例外ハンドラへ移るか，呼び出し元へ例外が伝わります。[例外処理](../control/exceptions.md)を参照してください。

使わない戻り値を明示的に捨てると，後続のスタックを追いやすくなります。ただし，`return` の直前に値が残っていること自体を，JVM が常に検証エラーにするわけではありません。戻るときはフレームごと破棄されます。分岐の合流や後続の命令に必要な型・高さが合うことと，読みやすさのための書き方は区別します。
