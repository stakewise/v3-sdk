import { Octokit } from '@octokit/rest'
import { readFileSync, appendFileSync } from 'node:fs'


const kind = process.argv[2]
const title = kind === 'unit' ? '## Unit tests' : '## Fork tests'
const marker = `<!-- tests-comment:${kind} -->`

const readJson = (filePath = '') => {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  }
  catch {
    return undefined
  }
}

const readLcov = () => {
  try {
    return readFileSync('coverage/lcov.info', 'utf-8')
  }
  catch {
    return ''
  }
}

const getCoveredLines = (record: string) => {
  const counts = new Map<string, number>()
  const branches = new Map<string, number[]>()

  record.split('\n').forEach((row) => {
    const [ type, data = '' ] = row.split(':')
    const [ line, ...values ] = data.split(',')

    if (type === 'DA') {
      counts.set(line, Number(values[0]))
    }

    if (type === 'BRDA') {
      const taken = values[2] === '-' ? 0 : Number(values[2])

      branches.set(line, [ ...(branches.get(line) || []), taken ])
    }
  })

  const lines = new Set([ ...counts.keys(), ...branches.keys() ])

  return [ ...lines ].map((line) => {
    const lineBranches = branches.get(line)

    return lineBranches ? lineBranches.every(Boolean) : Boolean(counts.get(line))
  })
}

const getCoverage = () => {
  const lines = readLcov().split('end_of_record').flatMap(getCoveredLines)
  const covered = lines.filter(Boolean).length
  const total = lines.length
  const percent = total ? (Math.floor(covered / total * 10_000) / 100).toFixed(2) : ''

  return { covered, total, percent }
}

const buildMarkdown = () => {
  const report = readJson(`${kind}-report.json`)
  const { covered, total, percent } = getCoverage()

  if (!report) {
    return `${title}\n\nNo report: the tests did not run.`
  }

  const skipped = report.numPendingTests + (report.numTodoTests || 0)
  const finishTime = Math.max(report.startTime, ...report.testResults.map(({ endTime }: { endTime: number }) => endTime))
  const seconds = ((finishTime - report.startTime) / 1000).toFixed(1)
  const counts = `${report.numPassedTests} passed, ${report.numFailedTests} failed, ${skipped} skipped, ${seconds}s`

  if (kind === 'fork' || !total) {
    return [ title, '', counts ].join('\n')
  }

  const coverageLine = `Coverage: ${percent}% (${covered} of ${total} lines of code)`

  return [ title, '', counts, '', coverageLine ].join('\n')
}

const {
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  GITHUB_EVENT_PATH,
  GITHUB_STEP_SUMMARY,
} = process.env

const markdown = buildMarkdown()
const [ owner, repo ] = (GITHUB_REPOSITORY || '').split('/')
const pullNumber = readJson(GITHUB_EVENT_PATH)?.pull_request?.number

console.log(markdown)

if (GITHUB_STEP_SUMMARY) {
  appendFileSync(GITHUB_STEP_SUMMARY, `${markdown}\n`)
}

if (!GITHUB_TOKEN || !owner || !repo || !pullNumber) {
  console.log('Skipping the PR comment: no token, repository or pull request')
  process.exit(0)
}

try {
  const body = `${marker}\n${markdown}`
  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  const issue = { owner, repo, issue_number: pullNumber }

  const comments = await octokit.paginate(octokit.rest.issues.listComments, { ...issue, per_page: 100 })
  const existing = comments.find((comment) => comment.body?.startsWith(marker))

  if (existing) {
    await octokit.rest.issues.updateComment({ owner, repo, body, comment_id: existing.id })
  }
  else {
    await octokit.rest.issues.createComment({ ...issue, body })
  }
}
catch (error) {
  console.log(`::warning::Could not write the PR comment: ${error instanceof Error ? error.message : error}`)
}
