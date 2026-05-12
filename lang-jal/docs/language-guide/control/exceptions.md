---
title: 例外処理
description: JAL の try-catch-finally ディレクティブ。
---

# 例外処理

JAL では例外テーブルをラベル付きディレクティブとして記述できます。保護範囲、catch ハンドラ、finally 相当の合流先を JVM に近い形で明示します。

```jal
ProtectedBlock: [~ protectedStart,
  java/io/IOException: ioHandler -> cleanup,
  java/lang/Exception: generalHandler -> cleanup
]
```

要素の意味:

| 要素 | 意味 |
| --- | --- |
| `[~ protectedStart` | 保護範囲の開始ラベル。 |
| `ExceptionType: handler` | 例外型とハンドララベル。 |
| `-> cleanup` | finally 相当の後処理ラベル。 |

## 例

```jal
protectedStart:
  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ldc "Executing protected code"
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  goto cleanup

ioHandler:
  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ldc "IOException caught"
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  goto cleanup

generalHandler:
  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ldc "Exception caught"
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V

cleanup:
  return
```

実際の例外範囲では、開始・終了・ハンドラを表すラベルが明確になるように命名すると、制御フローと例外テーブルを追いやすくなります。
