---
title: マクロ
description: "JAL の #define マクロ，関数形式マクロ，複数行マクロ，展開ルール。"
---

# マクロ

`#define` は，名前に対応するソースをコンパイル前に展開します。定数やクラス名，繰り返す命令列に別名を付けられます。

展開後のソースを通常の JAL として解析します。命令が消費する値や型の規則は，展開した命令列と同じです。

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
    ldc value \
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V

public class PrintExample {
  public static main([Ljava/lang/String;)V {
    PRINT_STRING("Hello")
    return
  }
}
```

`PRINT_STRING("Hello")` は三つの命令に展開されます。マクロ自体の呼び出し用フレームは作りません。展開された `invokevirtual` は通常どおり `println` を呼び出します。

## 展開ルール

- マクロ定義行は出力から取り除かれますが，行番号を保つため改行は残ります。
- マクロの置換結果の中に別のマクロ名が含まれる場合，さらに展開されます。
- 文字列リテラル，`//` コメント，`/* ... */` コメントの内部では展開されません。
- 現在サポートされるプリプロセッサディレクティブは `#define` のみです。`#include` などはエラーになります。
- マクロ名とパラメータ名には，通常の識別子と同じく英字，`$`，`_` で始まり，英数字，`$`，`_` を続けられます。

## 注意点

マクロ引数に型はありません。型の検査は展開後の命令列に対して行われます。ラベルを含むマクロを同じメソッドで複数回使うと，ラベル名が重複する場合があります。制御フローをまとめるときは，展開後の名前とジャンプ先も確認してください。
