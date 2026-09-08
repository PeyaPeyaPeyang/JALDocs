# LangJAL ドキュメント

[公開サイト](https://jal.yamad.jp/)のソースです。JAL の構文と JVM 命令を説明します。ブラウザで編集・実行する環境は，別プロジェクトの [Jaspera](https://jal.yamad.jp/jaspera/) です。

## 開発

Node.js 20 以降と pnpm を使います。

```bash
pnpm install --frozen-lockfile
pnpm start
```

記事は `docs/`，トップページは `src/pages/index.tsx`，ナビゲーションは `docusaurus.config.ts` と `sidebars.ts` にあります。

## 検証

```bash
pnpm run typecheck
pnpm run build
```

ビルド時に内部リンクを検査します。出力先は `build/` です。`pnpm run serve` で生成したサイトを確認できます。

掲載したクラス・メソッドの例は，現行 LangJAL の CLI クラスパスを `LANGJAL_CLASSPATH` に設定して検証できます。必要なら `JAVA_HOME` も指定します。

```bash
node scripts/check-examples.mjs
```

この検査は `jal` コードブロックから完全なクラスとメソッドを抽出し，コンパイル後に JVM の検証を行います。メソッドだけの例は検証用クラスで囲みます。命令だけの断片，文法の模式図，既知の実装制約を示す `text` ブロックは対象外です。検査は出力値の正しさや全ブラウザでの動作を保証しません。

公開サイトのルートはこのドキュメント，`/jaspera/` は Jaspera の配信先です。URL の役割を変える際は両プロジェクトのリンクを確認してください。
