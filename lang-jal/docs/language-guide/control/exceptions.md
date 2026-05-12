---
title: 例外処理
description: JAL の try-catch-finally ディレクティブ。
---

import InstructionTrace from '@site/src/components/InstructionTrace';

# 例外処理

JAL では例外テーブルをラベル付きディレクティブとして記述できます。保護範囲，catch ハンドラ，finally 相当の合流先を JVM に近い形で明示します。

<InstructionTrace
  trace={ `
  ProtectedBlock: [~ protectedStart,
    java/io/IOException: ioHandler -> cleanup,
    java/lang/Exception: generalHandler -> cleanup
  ]
  ↑ - | -
`}
/>

要素の意味:

| 要素 | 意味 |
| --- | --- |
| `[~ protectedStart` | 保護範囲の開始ラベル。 |
| `ExceptionType: handler` | 例外型とハンドララベル。 |
| `-> cleanup` | finally 相当の後処理ラベル。 |

## 例

<InstructionTrace
  trace={ `
  protectedStart:
  ↑ - | -
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    ↑ System.out | -
    ldc "Executing protected code"
    ↑ System.out; "Executing protected code" | -
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
    ↑ - | -
    goto cleanup
    ↑ - | -

  ioHandler:
  ↑ IOException | -
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    ↑ IOException; System.out | -
    ldc "IOException caught"
    ↑ IOException; System.out; "IOException caught" | -
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
    ↑ IOException | -
    goto cleanup
    ↑ IOException | -

  generalHandler:
  ↑ Exception | -
    getstatic java/lang/System->out:Ljava/io/PrintStream;
    ↑ Exception; System.out | -
    ldc "Exception caught"
    ↑ Exception; System.out; "Exception caught" | -
    invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
    ↑ Exception | -

  cleanup:
  ↑ - | -
    return
    ↑ - | -
`}
/>

実際の例外範囲では，開始・終了・ハンドラを表すラベルが明確になるように命名すると，制御フローと例外テーブルを追いやすくなります。
