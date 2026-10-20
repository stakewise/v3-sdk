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

const buildMarkdown = () => {
  const report = readJson(`${kind}-report.json`)
  const coverage = readJson('coverage/coverage-summary.json')

  if (!report) {
    return `${title}\n\nNo report: the tests did not run.`
  }

  const skipped = report.numPendingTests + (report.numTodoTests || 0)
  const finishTime = Math.max(report.startTime, ...report.testResults.map(({ endTime }: { endTime: number }) => endTime))
  const seconds = ((finishTime - report.startTime) / 1000).toFixed(1)
  const counts = `${report.numPassedTests} passed, ${report.numFailedTests} failed, ${skipped} skipped, ${seconds}s`

  if (kind === 'fork' || !coverage) {
    return [ title, '', counts ].join('\n')
  }

  const rows = [ 'lines', 'branches', 'functions', 'statements' ].map((metric) => {
    const { pct, covered, total } = coverage.total[metric]

    return `| ${metric} | ${pct}% | ${covered} / ${total} |`
  })

  const head = [ '', '### Coverage (reported, not enforced)', '', '| Metric | % | Covered |', '| --- | --- | --- |' ]

  return [ title, '', counts, ...head, ...rows ].join('\n')
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
