import path from 'path'
import fs from 'fs-extra'
import { glob } from 'glob'
import simpleGit from 'simple-git'

import log from './log'
import createPullRequest from './createPullRequest'
import sendDiscordNotification from './sendDiscordNotification'


const branchName = 'sync-sdk'

const srcPath = `${process.cwd()}/src`
const docsPath = `${process.cwd()}/docs`
const docsRepoUrl = 'git@github.com:stakewise/stakewise-docs.git'

const commitAuthor = process.env.COMMIT_AUTHOR || 'unknown'
const syncDocsToken = process.env.SYNC_DOCS_TOKEN
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL

const changeTargetPath = (path: string) => path
  .replace('methods/', '')
  .replace('requests/', '')

;(async () => {
  let git = simpleGit()

  log.info('🤖 Start of documentation synchronization...')

  try {
    const isExist = await fs.pathExists(docsPath)

    if (isExist) {
      log.info('📁 Docs folder already exist.')

      git = simpleGit(docsPath)
      await git.pull('origin', 'main')

      log.success('The documentation repository was updated.')
    }
    else {
      await git.clone(docsRepoUrl, docsPath)
      git = simpleGit(docsPath)

      log.success('The documentation repository has been cloned.')
    }

    const sourceFiles = await glob(['**/*.md', '**/*.mdx'], {
      cwd: srcPath
    })

    log.info(`🔢 Found ${sourceFiles.length} files to sync`)

    await fs.emptyDir(`${docsPath}/docs/sdk`)

    log.info(`🧹 SDK folder in docs has been cleaned up.`)

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

    for (const file of sourceFiles) {
      const sourceFile = `${srcPath}/${file}`
      const targetFile = changeTargetPath(`${docsPath}/docs/sdk/${file}`)

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
      filesCount: sourceFiles.length,
    })
  }
  catch (error) {
    log.error(`${error}`)
    process.exit(1)
  } 
})()
