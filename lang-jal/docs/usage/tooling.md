---
title: ツール
description: JAL CLI Compiler、Javasm IntelliJ Plugin、Gradle Plugin の使い方。
---

# ツール

JAL は CLI、IntelliJ IDEA、Gradle から利用できます。小さな検証は CLI、日常的な編集は Javasm、プロジェクト組み込みは Gradle プラグインが向いています。

## JAL CLI Compiler

リリースページから JAL CLI Compiler を取得し、展開したディレクトリの `bin` を PATH に追加します。

```bash
jalc MyProgram.jal
```

出力先を指定する場合:

```bash
jalc MyProgram.jal --output build/classes
jalc examples --output build/examples.jar
```

`--output` にディレクトリを指定すると class ファイルを出力し、jar パスを指定すると jar を作成します。

## Javasm IntelliJ Plugin

[Javasm](https://plugins.jetbrains.com/plugin/27944-javasm) は IntelliJ IDEA 向けの JAL プラグインです。`.jal` ファイルを通常のエディタで眺めるだけでなく、補完、参照移動、デバッグ支援を IDE の中で利用できるようにします。

<iframe width="384px" height="319px" src="https://plugins.jetbrains.com/embeddable/card/27944"></iframe>

インストールは JetBrains Marketplace から行えます。IntelliJ IDEA の **Settings | Plugins | Marketplace** で `Javasm` を検索して導入するか、上のカードから Marketplace ページを開いてください。プラグインの開発リポジトリは [PeyaPeyaPeyang/Javasm](https://github.com/PeyaPeyaPeyang/Javasm) です。

### エディタ支援

Javasm は JAL を JVM 命令に近い低レベルなソースとして扱いつつ、手書きしづらい部分を IDE で補助します。

| 機能 | 内容 |
| --- | --- |
| 命令補完 | `iload`、`invokevirtual`、`return` などの JVM 命令名を入力途中で補完します。 |
| ホバー説明 | 命令にカーソルを合わせると、命令の意味をエディタ内で確認できます。 |
| ラベル移動 | 分岐先や例外ハンドラで使うラベル参照から、対応するラベル定義へ移動できます。 |
| メンバー参照の可読性 | `java/io/PrintStream->println(Ljava/lang/String;)V` のような JAL の参照表記を、Java プロジェクト内で読みやすく扱えます。 |

### デバッグ支援

Javasm は IntelliJ IDEA の標準 JVM デバッガと連携します。JAL から生成したクラスを Java と同じ感覚で実行し、ブレークポイント、ステップ実行、変数確認を使って挙動を追えます。

Stack Viewer では、選択中の命令やデバッグ中の位置に対して、オペランドスタックとローカル変数の状態を確認できます。JVM バイトコードでは、命令ごとにスタックの積み下ろしが正しいかを追う必要があるため、実行前後のスタック状態を見ながら調整できる点が重要です。

JAL コンパイラは StackMapFrame を自動生成しますが、命令列そのもののスタック整合性はソースを書く側が意識する必要があります。Javasm は、補完と Stack Viewer によって「書く」「読む」「実行して確認する」作業を IntelliJ IDEA 内で完結しやすくします。

## Gradle Plugin

Gradle ビルドに組み込む場合は [jal-gradle-plugin](https://github.com/PeyaPeyaPeyang/jal-gradle-plugin) を利用します。Java プロジェクト内で `.jal` を管理したい場合に適しています。

## 関連リンク

- [JAL language repository](https://github.com/PeyaPeyaPeyang/JavaAssemblyLanguage)
- [Javasm repository](https://github.com/PeyaPeyaPeyang/Javasm)
- [JAL CLI Compiler releases](https://github.com/PeyaPeyaPeyang/LangJAL/releases)
- [Javasm IntelliJ Plugin](https://plugins.jetbrains.com/plugin/27944-javasm)
