import pkg from '../../packages/react/package.json'

/** The published version of @pance/react. Read at build time, so the site never shows a stale number. */
export const VERSION: string = pkg.version

export const LINKS = {
  github: 'https://github.com/lermajonathan/pance-ds',
  changelog: 'https://github.com/lermajonathan/pance-ds/blob/main/CHANGELOG.md',
  governance: 'https://github.com/lermajonathan/pance-ds/blob/main/GOVERNANCE.md',
  npmReact: 'https://www.npmjs.com/package/@pance/react',
  npmTokens: 'https://www.npmjs.com/package/@pance/tokens',
  figma: 'https://www.figma.com/community/file/1694091498392766646',
} as const
