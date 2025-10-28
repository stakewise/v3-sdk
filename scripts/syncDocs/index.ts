import path from 'path'
import fs from 'fs-extra'
import { glob } from 'glob'
import simpleGit from 'simple-git'


const token = process.env.TOKEN
const srcPath = `${process.cwd()}/src`
const docsPath = `${process.cwd()}/docs`
const docsRepoUrl = `https://${token}@github.com/stakewise/stakewise-docs.git`

const log = {
  success: (message: string) => console.log(`\x1b[32m✅ ${message}\x1b[0m\n`),
  info: (message: string) => console.log(`\x1b[36m${message}\x1b[0m\n`),
  error: (message: string) => console.log(`\x1b[31m❌ ${message}\x1b[0m\n`)
}

const changeTargetPath = (path: string) => path
  .replace('methods/', '')
  .replace('requests/', '')

;(async () => {
  let git = simpleGit()

  log.info('🤖 Start of documentation synchronization...')

  try {
    if (!token) {
      throw new Error('Empty token!')
    }

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

    const branchName = 'sync-test'
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

    for (const file of sourceFiles) {
      const sourceFile = `${srcPath}/${file}`
      const targetFile = changeTargetPath(`${docsPath}/docs/sdk/${file}`)
      await fs.ensureDir(path.dirname(targetFile))
      await fs.copy(sourceFile, targetFile)
      log.info(`Copied: ${file.replace(/.*\/(.*)\.(mdx?)$/, '$1.$2')}`)
    }

    await git
      .addConfig('user.name', 'github-actions[bot]')
      .addConfig('user.email', 'github-actions[bot]@users.noreply.github.com')
      .addConfig('commit.gpgsign', 'true')

    log.success(`GitHub Commit signer is set.`)
    await git.add('.')
    
    const date = new Date().toLocaleDateString('ru-RU')
    await git.commit(`Sync SDK documentation test [${date}]`)
    log.success('Changes are committed.')
    
    await git.push('origin', branchName)
    log.success("Changes are pushed to 'sync-test' branch.")
  }
  catch (error) {
    log.error(`${error}`)
    process.exit(1)
  } 
})()
