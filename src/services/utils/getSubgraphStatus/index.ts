import type * as z from 'zod/mini'

import graphql from '../../../graphql'
import { apiUrls } from '../../../helpers'
import { wrapAbortPromise } from '../../../modules/gql-module'
import { getRequestUrl, saveErrorUrlToSessionStorage } from '../../../modules/gql-module/utils'

import { validate, validateSchema } from './validate'


export type GetSubgraphStatusInput = StakeWise.CommonParams & z.input<typeof validateSchema>

type Status = {
  blockNumber: number
  lagSeconds: number
  hasIndexingErrors: boolean
  isOutdated: boolean
}

type Output = Status & {
  url: string
  headBlockNumber: number
  isSwitched: boolean
}

const isHealthy = (status: Status) => !status.isOutdated && !status.hasIndexingErrors

const fetchSubgraphStatus = async (input: GetSubgraphStatusInput): Promise<Output> => {
  const { options, provider } = input

  const { maxLagSeconds } = validate(input)
  const { url, ...params } = apiUrls.getSubgraphParams(options)

  const [ primaryUrl, replicaUrl ] = typeof url === 'string' ? [ url ] : url
  const currentUrl = getRequestUrl(url)
  const otherUrl = currentUrl === primaryUrl ? replicaUrl : primaryUrl
  const urls = otherUrl ? [ currentUrl, otherUrl ] : [ currentUrl ]

  const [ headBlock, results ] = await Promise.all([
    provider.getBlock('latest'),
    Promise.allSettled(urls.map((url) => (
      graphql.subgraph.stats.fetchSubgraphMetaQuery({
        ...params,
        url,
        // Lets AbortRequest return _meta with hasIndexingErrors instead of throwing
        subgraphError: 'allow',
        modifyResult: (data) => data._meta,
      })
    ))),
  ])

  if (!headBlock) {
    throw new Error('Failed to get the latest block')
  }

  const [ current, other ] = results.map((result): Status | null => {
    if (result.status === 'rejected') {
      return null
    }

    const { block, hasIndexingErrors } = result.value
    const lagSeconds = Math.max(headBlock.timestamp - block.timestamp, 0)

    return {
      lagSeconds,
      hasIndexingErrors,
      blockNumber: block.number,
      isOutdated: lagSeconds > maxLagSeconds,
    }
  })

  const isSwitched = Boolean(other) && (!current || (!isHealthy(current) && isHealthy(other as Status)))
  const status = isSwitched ? other : current

  if (!status) {
    throw (results[0] as PromiseRejectedResult).reason
  }

  // Following SDK and web requests go to the other url for an hour
  if (isSwitched) {
    saveErrorUrlToSessionStorage(currentUrl)
  }

  return {
    ...status,
    isSwitched,
    url: isSwitched ? otherUrl as string : currentUrl,
    headBlockNumber: headBlock.number,
  }
}

export const getSubgraphStatus = wrapAbortPromise(fetchSubgraphStatus)
