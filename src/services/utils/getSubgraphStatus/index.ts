import type * as z from 'zod/mini'

import graphql from '../../../graphql'
import { apiUrls } from '../../../helpers'
import { wrapAbortPromise } from '../../../modules/gql-module'

import { validate, validateSchema } from './validate'


export type GetSubgraphStatusInput = StakeWise.CommonParams & z.input<typeof validateSchema>

type Output = {
  blockNumber: number
  headBlockNumber: number
  lagSeconds: number
  hasIndexingErrors: boolean
  isOutdated: boolean
}

const fetchSubgraphStatus = async (input: GetSubgraphStatusInput): Promise<Output> => {
  const { options, provider } = input

  const { maxLagSeconds } = validate(input)

  const [ meta, headBlock ] = await Promise.all([
    graphql.subgraph.stats.fetchSubgraphMetaQuery({
      ...apiUrls.getSubgraphParams(options),
      subgraphError: 'allow',
      modifyResult: (data) => data._meta,
    }),
    provider.getBlock('latest'),
  ])

  if (!headBlock) {
    throw new Error('Failed to get the latest block')
  }

  const lagSeconds = Math.max(headBlock.timestamp - meta.block.timestamp, 0)

  return {
    lagSeconds,
    blockNumber: meta.block.number,
    headBlockNumber: headBlock.number,
    hasIndexingErrors: meta.hasIndexingErrors,
    isOutdated: lagSeconds > maxLagSeconds,
  }
}

export const getSubgraphStatus = wrapAbortPromise(fetchSubgraphStatus)
