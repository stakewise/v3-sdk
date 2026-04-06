import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// eslint-disable-next-line no-restricted-syntax
const docsUrl = 'https://docs.stakewise.io'

const srcDir = path.resolve(__dirname, '../src')

const fetchSitemap = () => {
  const sitemapUrl = `${docsUrl}/sitemap.xml`

  return new Promise((resolve, reject) => {
    https
      .get(sitemapUrl, (res) => {
        let data = ''

        res.on('data', (chunk) => data += chunk)
        res.on('end', () => {
          const matches = data.match(/<loc>([^<]+)/g) || []

          const urls = matches.map((match) => {
            return match
              .replace('<loc>', '')
              .replace(/\/$/, '')
              .toLowerCase()
          })

          resolve(urls)
        })
      })
      .on('error', reject)
  })
}

const getSdkApiSlugs = () => {
  try {
    const output = execSync(
      `grep -r "^slug:" "${srcDir}" --include="*.md"`,
      { encoding: 'utf-8' }
    )

    const slugs = output
      .split('\n')
      .filter(Boolean)
      .map((line) => line.replace(/.*slug:\s*/, '').trim().toLowerCase())

    const brokenSlugs = slugs.filter((slug) => !slug.startsWith('/'))

    if (brokenSlugs.length) {
      console.log('🚫 Slugs must start with /:')
      brokenSlugs.forEach((slug) => console.log(`${slug}`))
      process.exit(1)
    }

    return slugs.filter((slug) => slug.startsWith('/sdk/api/'))
  }
  catch {
    return []
  }
}

const getUrls = () => {
  const rootDir = path.resolve(__dirname, '..')

  try {
    const output = execSync(
      `grep -roh "https://docs\\.stakewise\\.io/[^\\"' )\\\`>]*" "${rootDir}" `
      + '--include="*.ts" --include="*.tsx" --include="*.md" --include="*.mdx" '
      + '--exclude-dir=node_modules',
      { encoding: 'utf-8' }
    )

    return [ ...new Set(
      output
        .split('\n')
        .map((url) => url.replace(/[.,;)]+$/, ''))
        .filter((url) => url && url !== docsUrl && url !== `${docsUrl}/`)
    )]
  }
  catch {
    return []
  }
}

const checkDocLinks = async () => {
  const urls = getUrls()

  if (!urls.length) {
    console.log('No docs links found.')

    return
  }

  const slugs = getSdkApiSlugs()
  const broken = []

  let sitemap = null

  for (const url of urls) {
    const urlPath = url.replace(docsUrl, '').replace(/[#?].*$/, '').replace(/\/$/, '').toLowerCase()

    if (slugs.includes(urlPath)) {
      continue
    }

    // Not found in local slugs — check against live sitemap
    if (!sitemap) {
      sitemap = await fetchSitemap()
    }

    if (!sitemap.includes(`${docsUrl}${urlPath}`)) {
      broken.push(url)
    }
  }

  if (broken.length) {
    broken.forEach((url) => console.log(url))
    console.log(`\n🚫 Found ${broken.length} broken link(s)!`)
    process.exit(1)
  }

  console.log('✅ All docs links are valid.')

  // Warn if staged md files were changed
  try {
    const stagedMd = execSync('git diff --cached --name-only -- "src/**/*.md" "documentation/**/*.md"', { encoding: 'utf-8' }).trim()

    if (stagedMd) {
      const warn = (text) => console.log(`\x1b[33m${text}\x1b[0m`)

      console.log()
      warn('⚠️SDK docs were changed! ⚠️')
      warn("Don't forget to run: pnpm sync:docs")
    }
  }
  catch {}
}

checkDocLinks()
