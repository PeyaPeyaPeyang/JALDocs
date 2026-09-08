---
title: CLI・IDE・Gradle
description: JAL をローカル環境でコンパイル・実行する方法。
---

# CLI・IDE・Gradle

ブラウザで試す場合は [Jaspera](https://jal.yamad.jp/jaspera/) を使えます。ここでは，手元の JVM や既存の Java プロジェクトで JAL を使う方法を説明します。

## CLI でコンパイルする

[LangJAL のリリース](https://github.com/JVMLand/LangJAL/releases)から，使用する OS 向けの配布物を取得します。展開したディレクトリの `bin` にある `jalc` を使います。PATH に追加すると，別のディレクトリからも呼び出せます。

```bash
jalc HelloWorld.jal --output build/classes
java -cp build/classes HelloWorld
```

実行には，出力したクラスファイル形式と使用する API に対応した Java が必要です。たとえば `major_version=55` の例は Java 11 の形式で出力されますが，コンパイラ自体に必要な実行環境とは別の条件です。

入力にディレクトリを指定すると，その中の JAL ファイルをコンパイルします。出力先が `.jar` なら JAR にまとめます。

```bash
jalc examples --output build/examples.jar
java -cp build/examples.jar HelloWorld
```

JAR を作っただけでは `java -jar` 用のエントリーポイントは指定されません。上の例では `-cp` とクラス名で起動しています。パッケージを持つクラスは，起動時には `examples.HelloWorld` のようにドット区切りで指定します。

`jalc --help` でオプションを確認できます。通常は行番号とスタックマップを出力します。検証用の情報を除くオプションは，生成結果と対象 JVM の条件を理解したうえで使ってください。

## IntelliJ IDEA で編集する

[Javasm](https://plugins.jetbrains.com/plugin/27944-javasm) は IntelliJ IDEA 用のプラグインです。命令補完，ラベルやメンバーへの参照移動，JAL の実行・デバッグを支援します。

IDE の **Settings → Plugins → Marketplace** で `Javasm` を検索し，インストールします。対応する IDE のバージョンは Marketplace の表示を確認してください。

Java プロジェクトに JAL ファイルを作り，ソースを置いたディレクトリをソースルートに指定します。`src/main/jal` は配置例であり，JAL の文法上の必須名ではありません。プラグインの実行アイコンから実行・デバッグできます。

Javasm の解析によるスタック表示と，JVM デバッガが取得する実行時の値は区別してください。型や命令から求めた表示が，そのまま実行時のオブジェクトの内容を表すわけではありません。

## Gradle のビルドに組み込む

[jal-gradle-plugin](https://github.com/PeyaPeyaPeyang/jal-gradle-plugin) を使うと，Gradle から JAL をコンパイルできます。プラグインの ID，バージョン，設定項目はリンク先の README に従ってください。ソースの配置とクラスの出力先を，既存の Java ビルドに合わせて設定します。
