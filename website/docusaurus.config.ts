import { themes as prismThemes } from 'prism-react-renderer'
import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'


const config: Config = {
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.ico',
  onBrokenMarkdownLinks: 'warn',
  title: 'StakeWise V3 SDK',
  url: 'https://sdk.stakewise.io/',
  tagline: `
    The official SDK designed for effortless data retrieval from the StakeWise platform. <br />
    This SDK provides a streamlined interface over GraphQL requests and contract interactions.
  `,
  i18n: {
    defaultLocale: 'en',
    locales: [ 'en' ],
  },
  plugins: [
    [
      'content-docs',
      {
        id: 'setup',
        path: 'setup',
        routeBasePath: 'setup',
        sidebarPath: './setupSidebars.ts',
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          path: '../src/methods',
          include: [ '**/*.md', '**/*.mdx' ],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/og-image.png',
    algolia: {
      appId: 'FYI6QM8V89',
      indexName: 'sdk-stakewise',
      apiKey: 'dec9ccf3df7b0d443b5d0f5f1b1a1775',
    },
    navbar: {
      title: 'StakeWise',
      logo: {
        alt: 'StakeWise logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          label: 'Setup',
          position: 'left',
          activeBaseRegex: `/setup/`,
          to: '/setup/prerequisites',
        },
        {
          label: 'API',
          position: 'left',
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
        },
        {
          label: 'GitHub',
          position: 'right',
          href: 'https://github.com/stakewise/v3-sdk',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'Setup',
              to: '/setup/prerequisites',
            },
            {
              label: 'Api',
              to: '/introduction',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Telegram',
              href: 'https://t.me/stakewise_io',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/2BSdr2g',
            },
            {
              label: 'X',
              href: 'https://x.com/stakewise_io',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Contact us',
              href: 'mailto:info@stakewise.io',
            },
            {
              label: 'v3 Docs',
              href: 'https://docs.stakewise.io/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/stakewise/v3-sdk',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} StakeWise.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}


export default config
