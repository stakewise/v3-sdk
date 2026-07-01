import type * as z from 'zod/mini'

import { getTransactions } from '../getTransactions'
import AbortPromise from '../../../modules/gql-module/abortPromise'

import { validate, validateSchema } from './validate'


export type WaitForSubgraphInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export const waitForSubgraph = (input: WaitForSubgraphInput): AbortPromise<void> => {
  const { config, options, provider, contracts } = input

  const { hash } = validate(input)

  const commonParams: StakeWise.CommonParams = { config, options, provider, contracts }

  let isAborted = false

  const fetchCount = async (attempt: number = 0): Promise<number> => {
    try {
      const transactions = await getTransactions({ ...commonParams, hash })

      return transactions.length
    }
    catch (error) {
      if (attempt < 10) {
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
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
