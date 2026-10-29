import { describe, expect } from 'vitest'

import { it, subgraphUrl } from '../../../../test'

import type { GetSubgraphStatusInput } from './index'
import type { SubgraphMetaQueryPayload } from '../../../graphql/subgraph/stats'


type Input = StakeWise.ExtractInput<GetSubgraphStatusInput>

const headBlock = { number: 26297212, timestamp: 1793262647 }

const getMeta = (lagSeconds: number, hasIndexingErrors = false) => ({
  hasIndexingErrors,
  block: {
    number: headBlock.number - Math.floor(lagSeconds / 12),
    timestamp: headBlock.timestamp - lagSeconds,
  },
})

const resultCases = [
  {
    name: 'synced',
    meta: getMeta(12),
    input: undefined,
    expected: { lagSeconds: 12, hasIndexingErrors: false, isOutdated: false },
  },
  {
    name: 'lag equals the default limit',
    meta: getMeta(300),
    input: undefined,
    expected: { lagSeconds: 300, hasIndexingErrors: false, isOutdated: false },
  },
  {
    name: 'outdated',
    meta: getMeta(301),
    input: undefined,
    expected: { lagSeconds: 301, hasIndexingErrors: false, isOutdated: true },
  },
  {
    name: 'custom limit',
    meta: getMeta(120),
    input: { maxLagSeconds: 60 },
    expected: { lagSeconds: 120, hasIndexingErrors: false, isOutdated: true },
  },
  {
    name: 'indexing errors',
    meta: getMeta(12, true),
    input: undefined,
    expected: { lagSeconds: 12, hasIndexingErrors: true, isOutdated: false },
  },
  {
    name: 'subgraph block is ahead of the provider',
    meta: getMeta(-12),
    input: undefined,
    expected: { lagSeconds: 0, hasIndexingErrors: false, isOutdated: false },
  },
]

const invalidCases = [
  {
    name: 'invalid max lag',
    input: { maxLagSeconds: '300' },
    message: 'The "maxLagSeconds" argument must be a number',
  },
]

describe('getSubgraphStatus', () => {
  it.for(resultCases)('$name', async ({ meta, input, expected }, { sdk, graphql, runner }) => {
    runner.setBlock(headBlock)
    graphql.mock<SubgraphMetaQueryPayload>({ name: 'SubgraphMeta', data: { _meta: meta } })

    const result = await sdk.utils.getSubgraphStatus(input)

    expect(result).toEqual({
      ...expected,
      blockNumber: meta.block.number,
      headBlockNumber: headBlock.number,
    })
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'SubgraphMeta', variables: undefined }),
    ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    await expect(sdk.utils.getSubgraphStatus(input as unknown as Input)).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
