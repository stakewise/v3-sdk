import { Octokit } from '@octokit/rest'

import log from './log'


type Input = {
  owner: string
  repo: string
  branchName: string
  baseBranch?: string
  authToken?: string
  title: string
}

const createPullRequest = async (params: Input) => {
  const {
    repo,
    owner,
    title,
    authToken,
    branchName,
    baseBranch = 'main',
  } = params

  if (!authToken) {
    throw new Error('authToken is not set. Cannot create pull request.')
  }

  try {
    const octokit = new Octokit({ auth: authToken })

    const existingPRs = await octokit.pulls.list({
      head: `${owner}:${branchName}`,
      base: baseBranch,
      state: 'open',
      owner,
      repo,
    })

    if (existingPRs.data.length > 0) {
      const existingPR = existingPRs.data[0]

      log.info('🔗 Pull Request already created')

      return existingPR
    }

    const pr = await octokit.pulls.create({
      owner,
      repo,
      title,
      head: branchName,
      base: baseBranch,
      body: 'Automatic SDK Documentation Sync',
    })

    log.success(`Pull Request created: ${pr.data.html_url}`)

    return pr.data
  }
  catch (error: any) {
    log.error(String(error))

    return Promise.reject(error)
  }
}


export default createPullRequest
