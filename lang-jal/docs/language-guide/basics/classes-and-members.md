---
title: クラス、フィールド、メソッド
description: JAL におけるクラス定義、フィールド定義、コンストラクタ、static 初期化子の書き方。
---

# クラス、フィールド、メソッド

JAL のトップレベルはクラスまたはインターフェースです。Java ソースと似た単語を使いますが、書いているものは JVM クラスファイルに近い構造です。クラスの属性、フィールドの型、メソッド記述子を明示するため、Java コンパイラが普段隠している情報を自分で指定します。

## クラス宣言

最小のクラスは次のように書けます。

```jal
public class Empty (
  major_version=55,
  minor_version=0) {
}
```

`major_version` と `minor_version` は class ファイルのバージョンです。`super_class` を省略した場合は、通常 `java/lang/Object` を親クラスとして扱います。

```jal
public final class App (
  major_version=61,
  minor_version=0,
  super_class=java/lang/Object) {
}
```

クラス名や親クラス名は JVM 内部名で書きます。パッケージ付きのクラスなら `com/example/App` のように `/` を使います。

## インターフェース

インターフェースは `interface` で定義します。

```jal
public abstract interface Printer (
  major_version=55,
  minor_version=0) {

  public abstract print(Ljava/lang/String;)V
}
```

インターフェースの抽象メソッドは本体を持たない形で表現される場合があります。具体的な記法は、プロジェクト内のサポート範囲に合わせて既存のサンプルやテストとそろえてください。

## フィールド定義

フィールドは `名前:型記述子` の形で書きます。

```jal
private count:I = 0;
public static final MESSAGE:Ljava/lang/String; = "ready";
volatile current:I;
```

フィールドの型は JVM 型記述子です。`I` は int、`J` は long、`Ljava/lang/String;` は `String`、`[I` は int 配列です。

よく使う修飾子は次の通りです。

| 修飾子 | 意味 |
| --- | --- |
| `public` | 外部からアクセスできる |
| `private` | クラス内部からのみアクセスする |
| `protected` | 継承や同一パッケージでのアクセスを想定する |
| `static` | インスタンスではなくクラスに属する |
| `final` | 再代入しない定数的な値 |
| `volatile` | スレッド間での可視性を意識するフィールド |
| `transient` | シリアライズ対象外を示す |

## インスタンスメソッド

インスタンスメソッドでは、ローカル変数スロット 0 に `this` が入ります。

```jal
public getCount()I {
  aload_0
  getfield Counter->count:I
  ireturn
}
```

`aload_0` で `this` を積み、`getfield` がそのオブジェクトから `count` を読みます。`getfield` は対象オブジェクトをスタックから取り出すため、フィールド参照の前に必ず参照を積んでおく必要があります。

## static メソッド

static メソッドには `this` がありません。引数はスロット 0 から始まります。

```jal
public static add(II)I {
  iload_0
  iload_1
  iadd
  ireturn
}
```

同じ `(II)I` でも、インスタンスメソッドならスロット 1 と 2 が引数になります。static かどうかでスロット配置が変わる点は、JAL でよくあるつまずきです。

## コンストラクタ

コンストラクタは JVM では `<init>` という特殊メソッドです。通常、最初に `this` を積み、親クラスのコンストラクタを `invokespecial` で呼びます。

```jal
public <init>()V {
  aload_0
  invokespecial java/lang/Object-><init>()V
  return
}
```

フィールドを初期化する場合は、親コンストラクタ呼び出しの後に `putfield` を使います。

```jal
public <init>(I)V {
  aload_0
  invokespecial java/lang/Object-><init>()V

  aload_0
  iload_1
  putfield Counter->count:I
  return
}
```

`putfield` はスタックから「対象オブジェクト」と「代入する値」を取り出します。この例では `aload_0` で `this`、`iload_1` でコンストラクタ引数を積んでいます。

## static 初期化子

static フィールドの初期化やクラスロード時の処理は `<clinit>` に書きます。

```jal
private static total:I = 0;

static <clinit>()V {
  iconst_0
  putstatic Counter->total:I
  return
}
```

`putstatic` は対象オブジェクトを必要としません。フィールドに入れる値だけをスタックに積みます。

## フィールドアクセスの違い

フィールド命令は 4 種類あります。

| 命令 | 対象 | スタックに必要なもの |
| --- | --- | --- |
| `getfield` | インスタンスフィールド読み取り | 対象オブジェクト |
| `putfield` | インスタンスフィールド書き込み | 対象オブジェクト、値 |
| `getstatic` | static フィールド読み取り | なし |
| `putstatic` | static フィールド書き込み | 値 |

`System.out.println` の前に使う `getstatic` は、`System.out` が static フィールドだからです。

```jal
getstatic java/lang/System->out:Ljava/io/PrintStream;
ldc "hello"
invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
```

## メンバーを書くときの基準

クラス、フィールド、メソッドを書くときは、Java ソースの見た目ではなく JVM が必要とする情報をそろえることを意識します。

| 書くもの | 確認すること |
| --- | --- |
| クラス | class ファイルバージョン、親クラス、インターフェース |
| フィールド | static か instance か、型記述子、初期値 |
| メソッド | static か instance か、引数と戻り値、戻り命令 |
| コンストラクタ | 親コンストラクタ呼び出し、`this` の扱い |

JAL の記述は明示的なので、最初にこの表を確認してから命令列を書くと、スタックやローカル変数のずれを減らせます。
