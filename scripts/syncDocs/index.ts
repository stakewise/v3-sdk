import path from 'path'
import fs from 'fs-extra'
import { glob } from 'glob'
import simpleGit from 'simple-git'

import log from './log'
import sendDiscordNotification from './sendDiscordNotification'


const branchName = 'sync-sdk'

const srcPath = `${process.cwd()}/src`
const docsPath = `${process.cwd()}/docs`
const docsRepoUrl = 'git@github.com:stakewise/stakewise-docs.git'

const commitAuthor = process.env.COMMIT_AUTHOR || 'unknown'
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

    const branches = await git.branch()

    const isBranchExist = (
      branches.all.includes(branchName)
      || branches.all.includes(`remotes/origin/${branchName}`)
    )

    if (isBranchExist) {
      log.info(`The branch 'sync-test' already exist.`)

      await git.checkout(branchName)
      await git.pull()

      log.success(`Checkout to 'sync-test' and pull success.`)
    }
    else {
      await git.checkoutLocalBranch(branchName)

      log.success(`Create branch 'sync-test' success.`)
    }

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
    await git.commit(`Sync SDK documentation test [${date}]`)

    log.success('Changes are committed.')

    await git.push('origin', branchName)

    log.success("Changes are pushed to 'sync-test' branch.")

    await sendDiscordNotification({
      discordWebhookUrl,
      author: commitAuthor,
      filesCount: sourceFiles.length,
      prUrl: '', // pr.data.html_url
    })
  }
  catch (error) {
    log.error(`${error}`)
    process.exit(1)
  } 
})()
