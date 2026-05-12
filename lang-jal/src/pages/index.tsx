import {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowRight,
  faBookOpen,
  faBolt,
  faCircleQuestion,
  faCodeBranch,
  faCompassDrafting,
  faCube,
  faDownload,
  faFileCode,
  faGear,
  faGraduationCap,
  faLayerGroup,
  faMagnifyingGlass,
  faPlay,
  faTerminal,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import {faGithub, faJava} from '@fortawesome/free-brands-svg-icons';
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
  ↑ - | 0: value
}
↑ - | 0: value
`;

const branchTrace = `
.L_check:
↑ - | 0: count; 1: writer
  iload count
  ↑ count | 0: count; 1: writer
  ifle .L_done
  ↑ - | 0: count; 1: writer
  aload writer
  ↑ writer | 0: count; 1: writer
  ldc "verified"
  ↑ writer; "verified" | 0: count; 1: writer
  invokevirtual java/io/PrintStream->println(Ljava/lang/String;)V
  ↑ - | 0: count; 1: writer
  goto .L_check
  ↑ - | 0: count; 1: writer

.L_done:
↑ - | 0: count; 1: writer
  return
  ↑ - | 0: count; 1: writer
`;

const featureItems = [
  {
    icon: faCompassDrafting,
    title: '機械語入門の足場になる',
    body: 'JVM は x86 などの実機向けアーキテクチャより単純なモデルで，スタック，ローカル変数，分岐，呼び出しを追いやすい仮想機械です。JAL はその構造を直接書いて観察できます。',
  },
  {
    icon: faLayerGroup,
    title: 'StackMapFrame を自動生成',
    body: '現代の Java クラスファイルで必要になる StackMapFrame をコンパイラが計算します。手書きバイトコードで起きがちな VerifyError を減らします。',
  },
  {
    icon: faBolt,
    title: 'IDE と一緒に使える',
    body: 'Javasm IntelliJ Plugin で補完，ホバー説明，ラベル移動，JVM デバッガ連携を利用できます。.jal ファイルを普段の Java 開発に近い感覚で扱えます。',
  },
];

const workflowItems = [
  {label: 'Write', description: '.jal で命令，ラベル，型記述子を明示', icon: faFileCode},
  {label: 'Compile', description: 'jalc が class または jar を生成', icon: faGear},
  {label: 'Inspect', description: 'IDE と JVM デバッガで動作を確認', icon: faMagnifyingGlass},
];

const metricItems = [
  {label: 'Java 1.0 - 27', detail: 'class file versions', icon: faJava},
  {label: 'CLI / Gradle', detail: 'build integration', icon: faTerminal},
  {label: 'IntelliJ', detail: 'editor support', icon: faBolt},
];

const legacyTiles = [
  {label: 'Go JAL', icon: faPlay},
  {label: 'JAL + IntelliJ', icon: faBolt},
  {label: 'StackMapFrame', icon: faLayerGroup},
  {label: 'Bytecode One', icon: faCube},
  {label: 'JAL Academy', icon: faGraduationCap},
  {label: 'JAL Magazine', icon: faBookOpen},
];

const toolingItems = [
  {label: 'ツール導入', href: '/docs/usage/tooling', icon: faWandMagicSparkles, internal: true},
  {label: 'Javasm Plugin', href: 'https://plugins.jetbrains.com/plugin/27944-javasm', icon: faBolt},
  {label: 'Compiler Releases', href: 'https://github.com/PeyaPeyaPeyang/LangJAL/releases', icon: faGithub},
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
  const logoUrl = useBaseUrl('/img/jal-logo.svg');

  return (
    <header className={styles.hero}>
      <div className={styles.retroFrame}>
        <div className={styles.retroBar}>
          <div className={styles.retroBarInner}>
            <div className={styles.retroBrand}>
              <img className={styles.logoMark} src={logoUrl} alt="" />
              <span>Jal<span className={styles.trademark}>™</span></span>
            </div>
            <nav className={styles.retroNav} aria-label="Primary">
              <Link to="/docs/intro">
                <IconLabel className={styles.navLabel} icon={faDownload}>
                  ダウンロード
                </IconLabel>
              </Link>
              <Link to="/docs/language-guide/basics/syntax">
                <IconLabel className={styles.navLabel} icon={faCircleQuestion}>
                  ヘルプ
                </IconLabel>
              </Link>
            </nav>
            <label className={styles.retroSearch}>
              <span>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span>検索</span>
              </span>
              <input aria-label="検索" />
            </label>
          </div>
        </div>
        <div className={styles.heroInner}>
          <section className={styles.heroCopy}>
            <Heading as="h1" className={styles.heroTitle}>
              あなたとJAL,
              <br />
              今すぐアセンブ
              <br />
              ル
            </Heading>
            <div className={styles.actions}>
              <Link className={styles.downloadButton} to="/docs/intro">
                <IconLabel className={styles.buttonLabel} icon={faDownload}>
                  無料Jalのダウンロード
                </IconLabel>
              </Link>
            </div>
            <div className={styles.legacyLinks}>
              <Link to="/docs/language-guide/basics/syntax">
                <IconLabel className={styles.inlineLinkLabel} icon={faBookOpen}>
                  JALとは
                </IconLabel>
              </Link>
              <Link to="/docs/usage/tooling">
                <IconLabel className={styles.inlineLinkLabel} icon={faTerminal}>
                  JALの有無のチェック
                </IconLabel>
              </Link>
              <Link to="/docs/language-guide/runtime/instructions">
                <IconLabel className={styles.inlineLinkLabel} icon={faCodeBranch}>
                  サポート情報
                </IconLabel>
              </Link>
            </div>
          </section>
          <aside className={styles.developerBox}>
            <strong>
              <IconLabel className={styles.developerHeading} icon={faTerminal}>
                開発者向け
              </IconLabel>
            </strong>
            <Link to="/docs/usage/tooling">
              <IconLabel className={styles.developerLinkLabel} icon={faGear}>
                JAL CLI / Gradle / Javasm
              </IconLabel>
            </Link>
            <Link to="/docs/language-guide/runtime/instructions">
              <IconLabel className={styles.developerLinkLabel} icon={faCodeBranch}>
                命令リファレンス
              </IconLabel>
            </Link>
          </aside>
        </div>
        <div className={styles.heroBottom}>
          <strong>JALについて</strong>
          <div className={styles.tileRow}>
            {legacyTiles.map((tile) => (
              <div className={styles.legacyTile} key={tile.label}>
                <FontAwesomeIcon className={styles.tileIcon} icon={tile.icon} />
                <span>{tile.label}</span>
              </div>
            ))}
          </div>
        </div>
        <a className={styles.scrollPrompt} href="#overview">
          <span>さらに詳しく</span>
          <span aria-hidden="true">
            <FontAwesomeIcon icon={faArrowDown} />
          </span>
        </a>
        <div className={styles.oracleLikeLogo} aria-label="LANGJAL">
          LANGJAL
        </div>
      </div>
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
            <span>Java Assembly Language</span>
          </div>
          <h2>機械語の入口に，JVM バイトコードを。</h2>
          <p>
            JAL は JVM の命令セットに近いまま，ラベル，名前付きローカル変数，読みやすいメンバー参照，
            自動 StackMapFrame 生成を備えたテキストアセンブリ言語です。x86 などの実機向けアセンブリへ進む前に，
            より単純な JVM のモデルで命令，スタック，分岐，呼び出しを学べます。
          </p>
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
        <section className={styles.heroVisual} aria-label="JAL example">
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
        <h2 id="features-heading">アセンブリの考え方を学びやすくする基本機能</h2>
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
          <h2>命令は JVM に近く，参照は読みやすく。</h2>
          <p>
            フィールドとメソッドの参照は ClassName-&gt;member の形で分離されます。
            JVM 記述子はそのまま使えるため，Java の型とバイトコードの対応を追いやすくなります。
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
        <h2 id="workflow-heading">小さく書いて，すぐ class に落とす。</h2>
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
          jalc で .jal を class や jar にコンパイルできます。IntelliJ IDEA では Javasm がエディタと
          デバッグ体験を補完し，Gradle プラグインでビルドへ組み込めます。
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
      title={`${siteConfig.title} - Java Assembly Language`}
      description="JAL is a readable assembly language for the Java Virtual Machine."
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
