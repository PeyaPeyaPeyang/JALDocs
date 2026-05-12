---
title: JVM クラスファイルの見方
description: JAL を読む前提になる JVM クラスファイル、スタックマシン、定数プールの考え方。
---

# JVM クラスファイルの見方

JAL は Java のソースコードを書くための言語ではなく、JVM が実行する `.class` ファイルの構造をテキストで表すための言語です。Java の `class`、フィールド、メソッド、命令列は、コンパイル後には JVM クラスファイルという単位に変換されます。JAL ではその変換後の姿に近いものを直接書きます。

Java から見ると低レベルですが、x86 や ARM の機械語と比べると、JVM はかなり整理された実行モデルを持っています。レジスタの割り当てや OS の ABI を考える前に、スタック、ローカル変数、分岐、メソッド呼び出しという基本要素を観察できます。

## クラスファイルの単位

JAL ファイルは、基本的に 1 つの JVM クラスまたはインターフェースに対応します。

```jal
public class Counter (
  major_version=55,
  minor_version=0,
  super_class=java/lang/Object) {

  private value:I = 0;

  public get()I {
    aload_0
    getfield Counter->value:I
    ireturn
  }
}
```

この例には、クラスメタデータ、フィールド、メソッドが含まれています。JVM はメソッドの中にある命令列を実行し、フィールドやメソッド参照はクラスファイル内の情報として解決します。

## スタックマシンとして考える

JVM はスタックマシンです。多くの命令は「値をスタックに積む」「スタックから値を取り出して計算する」「結果をまたスタックに積む」という形で動きます。

```jal
iconst_2
iconst_3
iadd
ireturn
```

この命令列の流れは次のように読めます。

| 命令 | スタックの変化 |
| --- | --- |
| `iconst_2` | `2` を積む |
| `iconst_3` | `3` を積む |
| `iadd` | `2` と `3` を取り出し、`5` を積む |
| `ireturn` | `5` を戻り値として返す |

Java の `return 2 + 3;` は 1 行ですが、JVM では値を積む順番と演算の順番が明確になります。JAL を読むときは、各行のあとに「今スタックに何が残っているか」を追うのが基本です。

## ローカル変数スロット

JVM のローカル変数は名前ではなくスロット番号で管理されます。インスタンスメソッドではスロット 0 に `this` が入り、引数はその後ろに並びます。static メソッドには `this` がないため、最初の引数がスロット 0 になります。

```jal
public add(II)I {
  iload_0
  iload_1
  iadd
  ireturn
}
```

この `add` は static でなければ、`iload_0` は `this` になってしまいます。インスタンスメソッドで 2 つの int 引数を足すなら、通常は `iload_1` と `iload_2` を読みます。

```jal
public addTo(I)I {
  iload_1
  aload_0
  getfield Counter->value:I
  iadd
  ireturn
}
```

JAL ではローカル変数情報のヒントも書けますが、実行時の実体はあくまでスロットです。名前は可読性やデバッグのための補助と考えると混乱しにくくなります。

## 定数プールと参照

JVM クラスファイルには、文字列、クラス名、フィールド参照、メソッド参照などを入れる定数プールがあります。JAL では定数プールの番号を手で管理せず、読みやすい形で参照を書きます。

```jal
getstatic java/lang/System->out:Ljava/io/PrintStream;
ldc "ready"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

`java/lang/System->out:Ljava/io/PrintStream;` は `System.out` フィールドを指します。`java/io/PrintStream->println(Ljava/lang/String;)V` は `PrintStream.println(String): void` を指します。JAL の記法は、JVM の内部名、メンバー名、型記述子を 1 つにまとめたものです。

## バージョンを指定する意味

`major_version` は出力する class ファイルの JVM バージョンを表します。たとえば `55` は Java 11、`61` は Java 17、`71` は Java 27 です。

```jal
public class Example (
  major_version=61,
  minor_version=0) {
}
```

新しいバージョンを指定すると、新しい JVM 仕様の class ファイルとして扱われます。古い実行環境で動かしたい場合は、その環境が読めるバージョンに合わせる必要があります。学習用のサンプルでは Java 11 相当の `major_version=55` を使うと、比較的新しい環境で扱いやすくなります。

## JAL を読む順番

初めて JAL ファイルを読むときは、次の順番で見ると構造をつかみやすくなります。

1. クラス名、`major_version`、`super_class` を見る
2. フィールドで状態を確認する
3. `main` や公開メソッドから読む
4. 各メソッドのローカル変数スロットを把握する
5. スタックの増減を命令ごとに追う
6. ラベルと分岐で制御フローを確認する

JAL は 1 行ごとの意味が明確なぶん、全体像を見ずに命令列だけを追うと迷いやすくなります。クラスファイル全体の形を先に押さえてから、メソッドの中へ入るのが読みやすい進め方です。
