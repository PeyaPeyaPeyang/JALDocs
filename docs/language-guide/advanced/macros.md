---
title: マクロ
description: "JAL の #define マクロ，関数形式マクロ，複数行マクロ，展開ルール。"
---

# マクロ

JAL はコンパイル前に簡単なプリプロセッサを実行し，`#define` で定義したマクロをソース中へ展開できます。マクロは命令ニーモニック，命令引数，クラス名，複数命令のまとまりなどに利用できます。

マクロは展開後に通常の JAL として解析されます。つまり，マクロ自体が新しい JVM 命令や型規則を追加するわけではありません。

## オブジェクト形式マクロ

```jal
#define NAME replacement
```

`NAME` と完全に一致する識別子だけが `replacement` に置換されます。識別子の一部は置換されません。

```jal
#define CLASS_NAME DefineExample
#define MESSAGE "Defined by #define"
#define GET_STDOUT getstatic java/lang/System->out:Ljava/io/PrintStream;

public class CLASS_NAME {
  public static main([Ljava/lang/String;)V {
    GET_STDOUT
    ldc MESSAGE
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
    return
  }
}
```

この例では，`CLASS_NAME` はクラス名に，`MESSAGE` は `ldc` の引数に，`GET_STDOUT` は命令列に展開されます。

## 複数行マクロ

行末に `\` を置くと，次の行を同じ `#define` として継続できます。

```jal
#define PRINT_MESSAGE \
getstatic java/lang/System->out:Ljava/io/PrintStream; \
ldc "Printed from a multi-line #define" \
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V

public class MultiLineDefine {
  public static main([Ljava/lang/String;)V {
    PRINT_MESSAGE
    return
  }
}
```

複数命令を 1 つの名前にまとめたい場合は，複数行マクロにすると定義側を読みやすく保てます。

## 関数形式マクロ

```jal
#define NAME(param1, param2) replacement
```

呼び出し時は `NAME(arg1, arg2)` のように書きます。引数の数が定義と一致する場合，置換テキスト内のパラメータ名が対応する引数へ置換されます。

```jal
#define PRINT_STRING(value) \
    getstatic java/lang/System->out:Ljava/io/PrintStream; \
    value \
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V

public class PrintExample {
  public static main([Ljava/lang/String;)V {
    PRINT_STRING(ldc "Hello")
    return
  }
}
```

関数形式マクロは，似た命令列を複数箇所で使うときに便利です。ただし，展開後のスタック状態が正しいかは呼び出し側で確認します。

## 展開ルール

- マクロ定義行は出力から取り除かれますが，行番号を保つため改行は残ります。
- マクロの置換結果の中に別のマクロ名が含まれる場合，さらに展開されます。
- 文字列リテラル，`//` コメント，`/* ... */` コメントの内部では展開されません。
- 現在サポートされるプリプロセッサディレクティブは `#define` のみです。`#include` などはエラーになります。
- マクロ名とパラメータ名には，通常の識別子と同じく英字，`$`，`_` で始まり，英数字，`$`，`_` を続けられます。

## 注意点

マクロは単純な展開機能なので，スコープや型検査を持ちません。短い命令列の別名や定型的な出力処理には向いていますが，複雑な制御フローを隠しすぎると展開後のスタック状態を追いにくくなります。
