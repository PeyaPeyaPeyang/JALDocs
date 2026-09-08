import {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBolt,
  faCompassDrafting,
  faFileCode,
  faGear,
  faLayerGroup,
  faMagnifyingGlass,
  faTerminal,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import {faGithub, faJava} from '@fortawesome/free-brands-svg-icons';
import HomepageRetroHero from '@site/src/components/HomepageRetroHero';
import InstructionTrace from '@site/src/components/InstructionTrace';

import styles from './index.module.css';

const twiceTrace = `
public static twice(I)I {
↑ - | 0: value
  iload_0
  ↑ value | 0: value
  iconst_2
  ↑ value; 2 | 0: value
  imul
  ↑ value * 2 | 0: value
  ireturn
}

`;

const branchTrace = `
public static countdown(I)V {
Loop:
  iload_0
  ↑ count | 0: count
  ifle Done
  ↑ - | 0: count
  getstatic java/lang/System->out:Ljava/io/PrintStream;
  ↑ System.out | 0: count
  iload_0
  ↑ System.out; count | 0: count
  invokevirtual java/io/PrintStream->println(I)V
  ↑ - | 0: count
  iinc 0 -1
  ↑ - | 0: count - 1
  goto Loop
Done:
  return
}
`;

const featureItems = [
  {
    icon: faCompassDrafting,
    title: '命令と値の関係を読む',
    body: '命令がどの値を取り出し，何を残すのか。スタックとローカル変数を追いながら，計算や分岐の仕組みを学びます。',
  },
  {
    icon: faLayerGroup,
    title: 'StackMapFrame を自動生成',
    body: '通常のコンパイルでは，検証に使う型情報を命令列から生成します。分岐の合流点で必要な条件は，言語ガイドで説明します。',
  },
  {
    icon: faBolt,
    title: 'ブラウザで試せる',
    body: 'Jaspera は JAL のサンドボックス実行環境です。編集して実行し，ブレークポイントで止めてフレームの状態を確認できます。',
  },
];

const workflowItems = [
  {label: '読む', description: 'ドキュメントで構文と命令の意味を調べる', icon: faFileCode},
  {label: '試す', description: 'Jaspera でコードを変更して実行する', icon: faGear},
  {label: '確かめる', description: 'ステップ実行で値と制御の流れを追う', icon: faMagnifyingGlass},
];

const metricItems = [
  {label: '.jal → .class', detail: 'JVM バイトコードを生成', icon: faJava},
  {label: 'CLI / Gradle', detail: 'ローカルでコンパイル', icon: faTerminal},
  {label: 'IntelliJ', detail: 'Javasm による編集支援', icon: faBolt},
];

const toolingItems = [
  {label: 'ツール導入', href: '/docs/usage/tooling', icon: faWandMagicSparkles, internal: true},
  {label: 'Javasm Plugin', href: 'https://plugins.jetbrains.com/plugin/27944-javasm', icon: faBolt},
  {label: 'Compiler Releases', href: 'https://github.com/JVMLand/LangJAL/releases', icon: faGithub},
];

function IconLabel({
  icon,
  children,
  className,
}: {
  icon: IconDefinition;
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <span className={className}>
      <FontAwesomeIcon icon={icon} />
      <span>{children}</span>
    </span>
  );
}

function HomepageHeader(): ReactNode {
  return (
    <header className={styles.hero}>
      <HomepageRetroHero />
    </header>
  );
}

function ModernIntro(): ReactNode {
  const logoUrl = useBaseUrl('/img/jal-logo.svg');

  return (
    <section className={styles.modernIntro} id="overview">
      <div className={styles.modernIntroInner}>
        <div className={styles.modernCopy}>
          <div className={styles.brandLine}>
            <img className={styles.modernLogo} src={logoUrl} alt="" />
            <span>JVM Assembly Language</span>
          </div>
          <h2>LangJAL を読み，Jaspera で動かす。</h2>
          <p>
            LangJAL は JVM 向けのアセンブリ言語 JAL と，そのコンパイラ・逆アセンブラを提供します。
            このサイトでは，JAL の書き方と命令の動作を調べられます。
            実際にコードを編集・実行するには，ブラウザ内のサンドボックス Jaspera を使ってください。
          </p>
          <p><a href="https://jal.yamad.jp/jaspera/">Jaspera を開く</a> · <Link to="/docs/usage/jaspera">使い方を読む</Link></p>
          <dl className={styles.metrics}>
            {metricItems.map((item) => (
              <div key={item.label}>
                <dt>
                  <IconLabel className={styles.metricLabel} icon={item.icon}>
                    {item.label}
                  </IconLabel>
                </dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <section className={styles.heroVisual} aria-label="整数を2倍にする JAL の例">
          <div className={styles.bytecodeMap} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <InstructionTrace trace={twiceTrace} />
        </section>
      </div>
    </section>
  );
}

function FeatureGrid(): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="features-heading">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Language</span>
        <h2 id="features-heading">JAL で学べること</h2>
      </div>
      <div className={styles.grid}>
        {featureItems.map((item, index) => (
          <article className={styles.feature} key={item.title}>
            <div className={styles.featureTop}>
              <span className={styles.featureIndex}>0{index + 1}</span>
              <FontAwesomeIcon className={styles.featureIcon} icon={item.icon} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SyntaxPreview(): ReactNode {
  return (
    <section className={`${styles.section} ${styles.syntaxSection}`}>
      <div className={styles.split}>
        <div>
          <span className={styles.eyebrow}>Syntax</span>
          <h2>クラス名と型を指定して呼び出す</h2>
          <p>
            フィールドやメソッドは，クラス名・メンバー名・型記述子で参照します。
            この例は，引数の整数を表示するたびに 1 減らし，0 以下になると終了します。
          </p>
          <Link className={styles.textLink} to="/docs/language-guide/runtime/instructions">
            <IconLabel className={styles.textLinkLabel} icon={faArrowRight}>
              命令リファレンスへ
            </IconLabel>
          </Link>
        </div>
        <div className={styles.inlineCode}>
          <InstructionTrace trace={branchTrace} />
        </div>
      </div>
    </section>
  );
}

function Workflow(): ReactNode {
  return (
    <section className={styles.workflow} aria-labelledby="workflow-heading">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Workflow</span>
        <h2 id="workflow-heading">説明と実行結果を行き来する</h2>
      </div>
      <div className={styles.timeline}>
        {workflowItems.map((item) => (
          <article className={styles.timelineItem} key={item.label}>
            <h3>
              <IconLabel className={styles.timelineLabel} icon={item.icon}>
                {item.label}
              </IconLabel>
            </h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ToolingBand(): ReactNode {
  return (
    <section className={styles.tooling}>
      <div>
        <span className={styles.eyebrow}>Tooling</span>
        <h2>CLI，Gradle，IntelliJ から利用</h2>
        <p>
          手元の JVM で実行する場合は，jalc でクラスファイルや JAR を生成できます。
          IntelliJ IDEA 用の Javasm と，Gradle のビルドに組み込むプラグインもあります。
        </p>
      </div>
      <div className={styles.toolLinks}>
        {toolingItems.map((item) =>
          item.internal ? (
            <Link key={item.label} to={item.href}>
              <IconLabel className={styles.toolLinkLabel} icon={item.icon}>
                {item.label}
              </IconLabel>
              <FontAwesomeIcon className={styles.toolLinkArrow} icon={faArrowRight} />
            </Link>
          ) : (
            <a href={item.href} key={item.label}>
              <IconLabel className={styles.toolLinkLabel} icon={item.icon}>
                {item.label}
              </IconLabel>
              <FontAwesomeIcon className={styles.toolLinkArrow} icon={faArrowRight} />
            </a>
          ),
        )}
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const [navbarVisible, setNavbarVisible] = useState(false);

  useEffect(() => {
    function updateNavbarVisibility(): void {
      const overview = document.getElementById('overview');

      if (overview === null) {
        setNavbarVisible(false);
        return;
      }

      const navbarHeight = 64;
      const revealOffset = navbarHeight + 24;
      setNavbarVisible(overview.getBoundingClientRect().top <= revealOffset);
    }

    updateNavbarVisibility();
    window.addEventListener('scroll', updateNavbarVisibility, {passive: true});
    window.addEventListener('resize', updateNavbarVisibility);

    return () => {
      window.removeEventListener('scroll', updateNavbarVisibility);
      window.removeEventListener('resize', updateNavbarVisibility);
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('home-navbar-hidden');
    document.body.classList.toggle('home-navbar-visible', navbarVisible);

    return () => {
      document.body.classList.remove('home-navbar-hidden', 'home-navbar-visible');
    };
  }, [navbarVisible]);

  return (
    <Layout
      title={`${siteConfig.title} - JVM Assembly Language`}
      description="JAL の構文と JVM 命令のドキュメント。Jaspera で編集・実行しながら学べます。"
      wrapperClassName={navbarVisible ? 'homePageNoNavbar navbarVisible' : 'homePageNoNavbar'}>
      <HomepageHeader />
      <main>
        <ModernIntro />
        <FeatureGrid />
        <SyntaxPreview />
        <Workflow />
        <ToolingBand />
      </main>
    </Layout>
  );
}
