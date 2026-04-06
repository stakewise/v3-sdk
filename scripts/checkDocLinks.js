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

const getSlugs = () => {
  try {
    const output = execSync(
      `grep -r "^slug:" ${srcDir} --include="*.md"`,
      { encoding: 'utf-8' }
    )

    return output
      .split('\n')
      .filter(Boolean)
      .map((line) => line.replace(/.*slug:\s*/, '').trim().toLowerCase())
  }
  catch {
    return []
  }
}

const getUrls = () => {
  const rootDir = path.resolve(__dirname, '..')

  try {
    const output = execSync(
      `grep -roh "https://docs\\.stakewise\\.io/[^\\"' )\\\`>]*" ${rootDir} `
      + '--include="*.ts" --include="*.tsx" --include="*.md" --include="*.mdx" '
      + '--exclude-dir=node_modules',
      { encoding: 'utf-8' }
    )

    return [ ...new Set(
      output
        .split('\n')
        .map((url) => url.replace(/\\n$/, '').replace(/[.,;)]+$/, ''))
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

  const slugs = getSlugs()
  const broken = []
  const otherUrls = []

  // SDK links — check against local slugs
  for (const url of urls) {
    const urlPath = url.replace(docsUrl, '').toLowerCase()

    if (urlPath.startsWith('/sdk/api/')) {
      if (!slugs.includes(urlPath)) {
        broken.push(url)
      }
    }
    else {
      otherUrls.push(url)
    }
  }

  // Other links — check against live sitemap
  if (otherUrls.length) {
    const sitemap = await fetchSitemap()

    for (const url of otherUrls) {
      const normalized = url.replace(/\/$/, '').toLowerCase()

      if (!sitemap.includes(normalized)) {
        broken.push(url)
      }
    }
  }

  if (broken.length) {
    broken.forEach((url) => console.log(url))
    console.log(`\n🚫 Found ${broken.length} broken link(s)!`)
    process.exit(1)
  }

  console.log('✅ All docs links are valid.')

  // Warn if staged md files have slug changes
  try {
    const stagedFiles = execSync('git diff --cached --name-only -- "src/**/*.md"', { encoding: 'utf-8' })
      .split('\n')
      .filter(Boolean)

    const hasSlugChanges = stagedFiles.some((file) => {
      try {
        execSync(`grep -q "^slug:" "${file}"`, { stdio: 'pipe' })

        return true
      }
      catch {
        return false
      }
    })

    if (hasSlugChanges) {
      const warn = (text) => console.log(`\x1b[33m${text}\x1b[0m`)

      console.log()
      warn('⚠️SDK docs were changed! ⚠️')
      warn("Don't forget to run: pnpm sync:docs")
    }
  }
  catch {}
}

checkDocLinks()
