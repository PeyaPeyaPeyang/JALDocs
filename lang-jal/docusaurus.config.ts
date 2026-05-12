import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'JAL',
  tagline: 'Readable JVM assembly for modern Java bytecode',
  favicon: 'img/jal-logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://peyapeyapeyang.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/JavaAssemblyLanguage/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'PeyaPeyaPeyang',
  projectName: 'JavaAssemblyLanguage',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/PeyaPeyaPeyang/JavaAssemblyLanguage/tree/main/docs/lang-jal/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    function jalPrismPlugin() {
      return {
        name: 'jal-prism',
        getClientModules() {
          return [require.resolve('./src/prism/jal')];
        },
      };
    },
  ],

  themeConfig: {
    image: 'img/jal-logo.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'JAL',
      logo: {
        alt: 'JAL Logo',
        src: 'img/jal-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'jalSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://plugins.jetbrains.com/plugin/27944-javasm',
          label: 'Javasm Plugin',
          position: 'right',
        },
        {
          href: 'https://github.com/PeyaPeyaPeyang/JavaAssemblyLanguage',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'はじめに',
              to: '/docs/intro',
            },
            {
              label: '構文ガイド',
              to: '/docs/language-guide/basics/syntax',
            },
          ],
        },
        {
          title: 'Tools',
          items: [
            {
              label: 'Javasm IntelliJ Plugin',
              href: 'https://plugins.jetbrains.com/plugin/27944-javasm',
            },
            {
              label: 'JAL CLI Compiler',
              href: 'https://github.com/PeyaPeyaPeyang/LangJAL/releases',
            },
            {
              label: 'Gradle Plugin',
              href: 'https://github.com/PeyaPeyaPeyang/jal-gradle-plugin',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Javasm GitHub',
              href: 'https://github.com/PeyaPeyaPeyang/Javasm',
            },
            {
              label: 'Language GitHub',
              href: 'https://github.com/PeyaPeyaPeyang/JavaAssemblyLanguage',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PeyaPeyaPeyang.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
