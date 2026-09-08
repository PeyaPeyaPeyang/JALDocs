---
title: オブジェクトと配列
description: 参照の生成，初期化，配列要素へのアクセス。
---

# オブジェクトと配列

オブジェクトも配列も，命令からは参照を通じて扱います。参照の保存には `astore`，読み出しには `aload`，返却には `areturn` を使います。

## オブジェクトを作る

```jal
public static create()Ljava/lang/StringBuilder; {
  new java/lang/StringBuilder
  dup
  ldc "prefix"
  invokespecial java/lang/StringBuilder-><init>(Ljava/lang/String;)V
  areturn
}
```

`new` の直後の参照は未初期化です。`dup` で同じ参照を残し，文字列を引数としてコンストラクタを呼びます。呼び出しが正常に終わると，残した参照を初期化済みの `StringBuilder` として使えます。

コンストラクタは値を返しません。`new` 自体がコンストラクタを実行するわけでもありません。

## プリミティブ配列を作る

```jal
public static numbers()[I {
  iconst_3
  newarray I
  dup
  iconst_0
  bipush 42
  iastore
  areturn
}
```

長さ 3 の `int[]` を作り，添字 0 に `42` を代入して返します。ほかの要素は初期値の `0` です。

`iastore` は下から配列参照，添字，値の三つを消費します。`dup` で配列参照を残しているため，代入後にその参照を返せます。

`newarray` の要素型には `Z`，`B`，`C`，`S`，`I`，`J`，`F`，`D` を指定します。配列長は `int` として先に積みます。

## 参照型配列を作る

```jal
public static names()[Ljava/lang/String; {
  iconst_2
  anewarray Ljava/lang/String;
  dup
  iconst_0
  ldc "first"
  aastore
  areturn
}
```

`anewarray Ljava/lang/String;` は `String[]` を作ります。要素の初期値は `null` です。`aastore` で代入する参照は，実際の配列の要素型に代入可能でなければなりません。型が合わない場合は `ArrayStoreException` になります。

## 配列を読む

```jal
public static first([I)I {
  aload_0
  iconst_0
  iaload
  ireturn
}
```

`iaload` は配列参照と添字を取り出して，指定された `int` 要素を積みます。長さを調べるには `arraylength` を使います。

配列参照が `null` なら `NullPointerException`，添字が範囲外なら `ArrayIndexOutOfBoundsException` になります。生成時の長さが負なら `NegativeArraySizeException` です。

## 多次元配列

```jal
public static matrix()[[I {
  iconst_2
  iconst_3
  multianewarray [[I 2
  areturn
}
```

これは外側の長さが 2，内側の長さが 3 の `int[][]` を作ります。最後の `2` は確保する次元数です。次元数は 1 以上で，記述子に含まれる `[` の数以下にします。たとえば `multianewarray [[I 1` は外側だけを確保し，各要素は `null` のままです。

## null と型検査

`aconst_null` は `null` を積みます。`checkcast` は参照が指定した型として使えるかを検査し，成功時には同じ参照を残します。別のオブジェクトへの変換やコピーは行いません。`null` はこの検査に成功します。

`instanceof` は，指定した型のインスタンスなら `1`，そうでなければ `0` を `int` として積みます。`null` の結果は `0` です。

フィールドの読み書きは [クラス，フィールド，メソッド](../basics/classes-and-members.md)，初期化前の参照の制約は [StackMapFrame と検証](../control/stackmap-and-verification.md) に説明があります。
