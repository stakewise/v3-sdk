import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import { glob } from 'glob'
import simpleGit from 'simple-git'

import log from './log'
import createPullRequest from './createPullRequest'
import sendDiscordNotification from './sendDiscordNotification'


const branchName = 'sync-sdk'

const srcPath = `${process.cwd()}/src`
const documentationPath = `${process.cwd()}/documentation`
const docsRepoUrl = 'git@github.com:stakewise/stakewise-docs.git'
const docsRepoPath = path.join(os.tmpdir(), 'stakewise-docs-sync')

const commitAuthor = process.env.COMMIT_AUTHOR || 'unknown'
const syncDocsToken = process.env.SYNC_DOCS_TOKEN
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL

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
  log.info('🤖 Start of documentation synchronization...')

  try {
    const isExist = await fs.pathExists(docsRepoPath)

    if (isExist) {
      await fs.remove(docsRepoPath)
      log.info(`🧹 Old docs folder has been deleted.`)
    }

    await simpleGit().clone(docsRepoUrl, docsRepoPath)
    log.success('The documentation repository has been cloned.')

    const git = simpleGit(docsRepoPath)

    const apiFiles = await glob(['**/*.md', '**/*.mdx'], {
      cwd: srcPath
    })

    const documentationFiles = await glob(['**/*.md', '**/*.mdx'], {
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

    await git
      .addConfig('user.name', 'github-actions[bot]')
      .addConfig('user.email', 'github-actions[bot]@users.noreply.github.com')

    log.success(`GitHub Commit signer is set.`)

    await git.add('.')

    const date = new Date().toLocaleDateString('ru-RU')
    const title = `Sync SDK documentation [${date}]`

    await git.commit(title)

    log.success('Changes are committed.')

    await git.push('origin', branchName)

    log.success(`Changes are pushed to '${branchName}' branch.`)

    const prData = await createPullRequest({
      authToken: syncDocsToken,
      repo: 'stakewise-docs',
      owner: 'stakewise',
      baseBranch: 'main',
      branchName,
      title,
    })

    await sendDiscordNotification({
      discordWebhookUrl,
      author: commitAuthor,
      prUrl: prData.html_url,
      filesCount: filesCount,
    })
  }
  catch (error) {
    log.error(`${error}`)
    process.exit(1)
  }
  finally {
    await fs.remove(docsRepoPath)
    log.success('🧹 Cloned docs repository has been cleaned up.')
  }
})()
