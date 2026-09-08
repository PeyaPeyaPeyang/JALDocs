---
title: サンプル
description: 出力，ループ，配列，switch を JAL で試す。
---

# サンプル

[Jaspera](https://jal.yamad.jp/jaspera/) の `example` フォルダーには，出力，分岐，配列などのプログラムがあります。サンプルは編集して試せます。再読み込みすると元の内容に戻るため，残したい変更はファイルへ保存してください。

## 1 から 10 までを足す

次のコードはクラス全体です。JAL ファイルに貼り付けて実行すると `55` を表示します。

```jal
public class Sum (major_version=55, minor_version=0) {
  public static main([Ljava/lang/String;)V {
    iconst_0
    istore_1
    iconst_1
    istore_2
  Loop:
    iload_2
    bipush 10
    if_icmpgt Done
    iload_1
    iload_2
    iadd
    istore_1
    iinc 2 1
    goto Loop
  Done:
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    iload_1
    invokevirtual java/io/PrintStream->println(I)V
    return
  }
}
```

スロット 0 は `main` の引数です。スロット 1 に合計，スロット 2 に加算する数を置いています。`bipush 10` を変えると，最後に加える数が変わります。`int` で表せる範囲を超えた加算は桁あふれするため，大きい値での結果には注意してください。

## 処理別の例

| 試したいこと | コード例 |
| --- | --- |
| 文字列を出力する | [最初のプログラム](./tutorial.mdx) |
| 配列を作り，要素を設定する | [オブジェクトと配列](../language-guide/runtime/objects-and-arrays.md) |
| 値によってジャンプ先を選ぶ | [制御フローの switch](../language-guide/control/control-flow.md#switch) |
| 0 除算を捕捉する | [例外処理](../language-guide/control/exceptions.md) |
| マクロを展開する | [マクロ](../language-guide/advanced/macros.md) |

ローカルで動かす場合は `jalc Sum.jal --output build/classes` でコンパイルし，`java -cp build/classes Sum` で実行します。LangJAL リポジトリの [examples](https://github.com/JVMLand/LangJAL/tree/main/examples) にもサンプルがあります。

## メソッドだけの例を実行する

メソッドだけを示した例には，実行用の `main` を追加します。たとえば [制御フロー](../language-guide/control/control-flow.md) の `lookup(I)I` を試すなら，次のように呼び出せます。

```jal
public class LookupDemo (major_version=55, minor_version=0) {
  public static lookup(I)I {
    iload_0
    lookupswitch {
      10: Ten,
      100: Hundred,
      default: Other
    }
  Ten:
    iconst_1
    ireturn
  Hundred:
    iconst_2
    ireturn
  Other:
    iconst_m1
    ireturn
  }

  public static main([Ljava/lang/String;)V {
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    bipush 10
    invokestatic LookupDemo->lookup(I)I
    invokevirtual java/io/PrintStream->println(I)V
    return
  }
}
```

引数 `10` を渡すと結果は `1` です。`100` に変えると `2`，どちらでもない値なら `-1` を表示します。ほかのメソッドを試すときは，呼び出し先の名前・記述子と，渡す値・出力方法も合わせて変更してください。
