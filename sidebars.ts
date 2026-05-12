import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  jalSidebar: [
    'README',
    'intro',
    {
      type: 'category',
      label: 'チュートリアルと使い方',
      link: {
        type: 'doc',
        id: 'usage/README',
      },
      items: ['usage/README', 'usage/tutorial', 'usage/tooling', 'usage/examples'],
    },
    {
      type: 'category',
      label: '言語ガイド',
      link: {
        type: 'doc',
        id: 'language-guide/README',
      },
      items: [
        'language-guide/README',
        {
          type: 'category',
          label: '基礎',
          link: {
            type: 'doc',
            id: 'language-guide/basics/README',
          },
          items: [
            'language-guide/basics/README',
            'language-guide/basics/syntax',
            'language-guide/basics/class-file-model',
            'language-guide/basics/descriptors',
            'language-guide/basics/classes-and-members',
          ],
        },
        {
          type: 'category',
          label: '実行モデル',
          link: {
            type: 'doc',
            id: 'language-guide/runtime/README',
          },
          items: [
            'language-guide/runtime/README',
            'language-guide/runtime/stack-and-locals',
            'language-guide/runtime/instructions',
            'language-guide/runtime/objects-and-arrays',
            'language-guide/runtime/method-invocation',
          ],
        },
        {
          type: 'category',
          label: '制御と検証',
          link: {
            type: 'doc',
            id: 'language-guide/control/README',
          },
          items: [
            'language-guide/control/README',
            'language-guide/control/control-flow',
            'language-guide/control/exceptions',
            'language-guide/control/stackmap-and-verification',
            'language-guide/control/style-guide',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
