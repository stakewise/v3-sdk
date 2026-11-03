import type * as z from 'zod/mini'

import graphql from '../../../graphql'
import { apiUrls } from '../../../helpers'
import { RequestUrls, wrapAbortPromise } from '../../../modules/gql-module'

import { validate, validateSchema } from './validate'


export type GetSubgraphStatusInput = StakeWise.CommonParams & z.input<typeof validateSchema>

type Output = {
  url: string
  isSwitched: boolean
  lagSeconds: number
  blockNumber: number
  headBlockNumber: number
  hasIndexingErrors: boolean
  isOutdated: boolean
}

const fetchSubgraphStatus = async (input: GetSubgraphStatusInput): Promise<Output> => {
  const { options, provider } = input

  const { maxLagSeconds } = validate(input)
  const { url, ...params } = apiUrls.getSubgraphParams(options)

  const requestUrls = RequestUrls.get(url)

  await requestUrls.subgraphCheck()

  const currentUrl = requestUrls.getUrl()

  const [ headBlock, meta ] = await Promise.all([
    provider.getBlock('latest'),
    graphql.subgraph.stats.fetchSubgraphMetaQuery({
      ...params,
      url: currentUrl,
      subgraphError: 'allow',
      modifyResult: (data) => data._meta,
    }),
  ])

  if (!headBlock) {
    throw new Error('Failed to get the latest block')
  }

  const lagSeconds = Math.max(headBlock.timestamp - meta.block.timestamp, 0)

  return {
    lagSeconds,
    url: currentUrl,
    blockNumber: meta.block.number,
    headBlockNumber: headBlock.number,
    hasIndexingErrors: meta.hasIndexingErrors,
    isSwitched: currentUrl !== requestUrls.urls[0],
    isOutdated: lagSeconds > maxLagSeconds,
  }
}

export const getSubgraphStatus = wrapAbortPromise(fetchSubgraphStatus)
