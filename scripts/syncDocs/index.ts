import path from 'path'
import fs from 'fs-extra'
import { glob } from 'glob'
import simpleGit from 'simple-git'
import { execSync } from 'child_process'

import log from './log'
import createPullRequest from './createPullRequest'


const branchName = 'sync-sdk'

const srcPath = `${process.cwd()}/src`
const docsRepoPath = `${process.cwd()}/docs`
const documentationPath = `${process.cwd()}/documentation`
const docsRepoUrl = 'git@github.com:stakewise/stakewise-docs.git'

const getGitUserName = () => {
  try {
    return execSync('git config user.name', { encoding: 'utf-8' }).trim()
  }
  catch {
    return 'unknown'
  }
}

const getGitHubToken = () => {
  try {
    const output = execSync(
      'echo "protocol=https\nhost=github.com" | git credential fill',
      { encoding: 'utf-8', shell: '/bin/sh' },
    )
    const match = output.match(/password=(.+)/)

    return match?.[1]?.trim()
  }
  catch {
    return undefined
  }
}

const commitAuthor = getGitUserName()
const syncDocsToken = getGitHubToken()

const changeTargetPath = (path: string) => path
  .replace('services/', 'API/')
  .replace('methods/', 'API/')
  .replace('requests/', '')
  .replace('transactions/', '01-transactions/')
  .replace('/vault/', '/01-vault/')
  .replace('/boost/', '/02-boost/')
  .replace('/osToken/', '/03-osToken/')
  .replace('/rewardSplitter/', '/04-rewardSplitter/')
  .replace('/distributorRewards/', '/05-distributorRewards/')
  .replace('/utils/', '/06-utils/')
  .replace(/([^/]+)\/\1\.md$/, '$1.md')

;(async () => {
  let git = simpleGit()

  log.info('🤖 Start of documentation synchronization...')

  if (!syncDocsToken) {
    log.error('GitHub token not found. Make sure your git credentials for github.com are configured.')
    process.exit(1)
  }

  try {
    const isExist = await fs.pathExists(docsRepoPath)

    if (isExist) {
      await fs.emptyDir(docsRepoPath)
      log.info(`🧹 Old docs folder has been deleted.`)
    }

    await git.clone(docsRepoUrl, docsRepoPath)
    log.success('The documentation repository has been cloned.')

    git = simpleGit(docsRepoPath)

    const apiFiles = await glob(['**/*.md', '**/*.mdx'], {
      cwd: srcPath
    })

    const documentationFiles = await glob(['**/*.md', '**/*.mdx', '**/_category_.json'], {
      cwd: documentationPath
    })

    const filesCount = documentationFiles.length + apiFiles.length

    log.info(`🔢 Found ${filesCount} files to sync`)

    const localBranches = await git.branchLocal()
    const remoteBranches = await git.listRemote(['--heads', 'origin', branchName])

    if (localBranches.all.includes(branchName)) {
      log.info(`🗑️ Local branch '${branchName}' exists, deleting...`)

      await git.deleteLocalBranch(branchName, true)
      log.success(`Local branch '${branchName}' deleted.`)
    }

    if (remoteBranches.includes(`refs/heads/${branchName}`)) {
      log.info(`🗑️ Remote branch '${branchName}' exists, deleting...`)

      await git.push('origin', `:${branchName}`)
      log.success(`Remote branch '${branchName}' deleted.`)
    }

    await git.checkoutLocalBranch(branchName)
    log.success(`🔄 Created new branch '${branchName}'.`)

    await fs.emptyDir(`${docsRepoPath}/docs/sdk`)
    log.info(`🧹 SDK folder in docs has been cleaned up.`)

    for (const file of apiFiles) {
      const sourceFile = `${srcPath}/${file}`
      const targetFile = changeTargetPath(`${docsRepoPath}/docs/sdk/${file}`)

      await fs.ensureDir(path.dirname(targetFile))
      await fs.copy(sourceFile, targetFile)
    }

    for (const file of documentationFiles) {
      const sourceFile = `${documentationPath}/${file}`
      const targetFile = `${docsRepoPath}/docs/sdk/${file}`

      await fs.ensureDir(path.dirname(targetFile))
      await fs.copy(sourceFile, targetFile)
    }

    log.success('Files are copied')

    log.info(`👤 Commit author: ${commitAuthor}`)

    await git.add('.')

    const date = new Date().toLocaleDateString('ru-RU')
    const title = `Sync SDK documentation [${date}]`

    await git.commit(title)

    log.success('Changes are committed.')

    await git.push('origin', branchName)

    log.success(`Changes are pushed to '${branchName}' branch.`)

    await createPullRequest({
      authToken: syncDocsToken,
      repo: 'stakewise-docs',
      owner: 'stakewise',
      baseBranch: 'main',
      branchName,
      title,
    })

    await fs.remove(docsRepoPath)
    log.success('🧹 Cloned docs repository has been cleaned up.')
  }
  catch (error) {
    log.error(`${error}`)
    await fs.remove(docsRepoPath)
    process.exit(1)
  }
})()
