import { validateArgs } from '../../../helpers'
import { getTransactions } from '../getTransactions'
import AbortPromise from '../../../modules/gql-module/abortPromise'


export type WaitForSubgraphInput = StakeWise.CommonParams & {
  hash: string
  pollDelay?: number
  maxAttempts?: number
}

export const waitForSubgraph = (input: WaitForSubgraphInput): AbortPromise<void> => {
  const {
    hash,
    pollDelay = 1000,
    maxAttempts = 10,
    config,
    options,
    provider,
    contracts,
  } = input

  validateArgs.hash({ hash })

  const commonParams: StakeWise.CommonParams = { config, options, provider, contracts }

  let isAborted = false

  const fetchCount = async (attempt: number = 0): Promise<number> => {
    try {
      const transactions = await getTransactions({ ...commonParams, hash })

      return transactions.length
    }
    catch (error) {
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 100))

        return fetchCount(attempt + 1)
      }

      return Promise.reject(error)
    }
  }

  const poll = async (): Promise<void> => {
    if (isAborted) {
      return
    }

    const count = await fetchCount()

    if (!count) {
      await new Promise((resolve) => setTimeout(resolve, pollDelay))

      return poll()
    }
  }

  return new AbortPromise<void>(
    (resolve, reject) => {
      poll()
        .then(() => resolve())
        .catch((error) => {
          if (!isAborted) {
            reject(error)
          }
        })
    },
    () => {
      isAborted = true
    }
  )
}
