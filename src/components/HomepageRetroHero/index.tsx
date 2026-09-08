import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from "@theme/Heading";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faBookOpen,
  faBolt,
  faCircleQuestion,
  faCodeBranch,
  faCube,
  faDownload,
  faGear,
  faGraduationCap,
  faLayerGroup,
  faMagnifyingGlass,
  faPlay,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./styles.module.css";

const legacyTiles = [
  { label: "Go JAL", icon: faPlay, href: "https://jal.yamad.jp/jaspera/" },
  { label: "Javasm・CLI", icon: faBolt, href: "/docs/usage/tooling" },
  {
    label: "スタックマップ",
    icon: faLayerGroup,
    href: "/docs/language-guide/control/stackmap-and-verification",
  },
  {
    label: "命令を調べる",
    icon: faCube,
    href: "/docs/language-guide/runtime/instructions",
  },
  {
    label: "チュートリアル",
    icon: faGraduationCap,
    href: "/docs/usage/tutorial",
  },
  {
    label: "構文ガイド",
    icon: faBookOpen,
    href: "/docs/language-guide/basics/syntax",
  },
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

export default function HomepageRetroHero(): ReactNode {
  const logoUrl = useBaseUrl("/img/jal-logo.svg");

  return (
    <div className={styles.retroFrame}>
      <div className={styles.retroBar}>
        <div className={styles.retroBarInner}>
          <div className={styles.retroBrand}>
            <img className={styles.logoMark} src={logoUrl} alt="" />
            <span>Jal</span>
          </div>
          <nav className={styles.retroNav} aria-label="メインメニュー">
            <Link to="/docs/usage/tooling">
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
          <form
            className={styles.retroSearch}
            action="https://www.google.com/search"
            method="get"
            role="search"
          >
            <input type="hidden" name="as_sitesearch" value="jal.yamad.jp" />
            <input
              type="search"
              name="q"
              aria-label="サイト内検索"
              placeholder="検索"
              required
            />
            <button type="submit" aria-label="検索">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
        </div>
      </div>
      <div className={styles.heroInner}>
        <section className={styles.heroCopy}>
          <Heading as="h1" className={styles.heroTitle}>
            あなたとJAL,
            <br />
            今すぐアセンブ
            <br />ル
          </Heading>
          <div className={styles.actions}>
            <Link className={styles.downloadButton} to="/docs/usage/tooling">
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
            <IconLabel
              className={styles.developerLinkLabel}
              icon={faCodeBranch}
            >
              命令リファレンス
            </IconLabel>
          </Link>
        </aside>
      </div>
      <div className={styles.heroBottom}>
        <strong>JALについて</strong>
        <div className={styles.tileRow}>
          {legacyTiles.map((tile) => (
            <Link className={styles.legacyTile} to={tile.href} key={tile.label}>
              <FontAwesomeIcon className={styles.tileIcon} icon={tile.icon} />
              <span>{tile.label}</span>
            </Link>
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
  );
}
