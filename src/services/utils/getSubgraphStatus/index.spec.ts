import { describe, expect } from 'vitest'

import { it, rpcUrl, subgraphUrl, replicaSubgraphUrl } from '../../../../test'
import StakeWiseSDK from '../../../StakeWiseSDK'
import { configs, Network } from '../../../helpers'
import { saveErrorUrlToSessionStorage } from '../../../modules/gql-module/utils'

import type { GetSubgraphStatusInput } from './index'
import type { SubgraphMetaQueryPayload } from '../../../graphql/subgraph/stats'


type Input = StakeWise.ExtractInput<GetSubgraphStatusInput>

type Meta = SubgraphMetaQueryPayload['_meta']

const name = 'SubgraphMeta'

const headBlock = { number: 26297212, timestamp: 1793262647 }

const getMeta = (lagSeconds: number, hasIndexingErrors = false): Meta => ({
  hasIndexingErrors,
  block: {
    number: headBlock.number - Math.floor(lagSeconds / 12),
    timestamp: headBlock.timestamp - lagSeconds,
  },
})

const getStatus = (meta: Meta) => ({
  headBlockNumber: headBlock.number,
  blockNumber: meta.block.number,
})

const getCall = (url: string) => expect.objectContaining({ url, operationName: name, variables: undefined })

const resultCases = [
  {
    name: 'synced',
    meta: getMeta(12),
    input: undefined,
    expected: { lagSeconds: 12, hasIndexingErrors: false, isOutdated: false },
  },
  {
    name: 'lag equals the default limit',
    meta: getMeta(600),
    input: undefined,
    expected: { lagSeconds: 600, hasIndexingErrors: false, isOutdated: false },
  },
  {
    name: 'outdated',
    meta: getMeta(601),
    input: undefined,
    expected: { lagSeconds: 601, hasIndexingErrors: false, isOutdated: true },
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
    graphql.mock<SubgraphMetaQueryPayload>({ name, data: { _meta: meta } })

    const result = await sdk.utils.getSubgraphStatus(input)

    expect(result).toEqual({ ...expected, ...getStatus(meta), url: subgraphUrl, isSwitched: false })
    expect(graphql.calls).toEqual([ getCall(subgraphUrl) ])
  })

  it('checks the backup url if the primary is marked as failed', async ({ sdk, graphql, runner }) => {
    const meta = getMeta(12)

    runner.setBlock(headBlock)
    saveErrorUrlToSessionStorage(configs[Network.Mainnet].api.subgraph, subgraphUrl)
    graphql.mock<SubgraphMetaQueryPayload>({ name, data: { _meta: meta } })

    const result = await sdk.utils.getSubgraphStatus()

    expect(result).toEqual({
      ...getStatus(meta),
      url: replicaSubgraphUrl,
      isSwitched: true,
      lagSeconds: 12,
      isOutdated: false,
      hasIndexingErrors: false,
    })
    expect(graphql.calls).toEqual([ getCall(replicaSubgraphUrl) ])
  })

  it('throws if the subgraph fails', async ({ sdk, graphql, runner }) => {
    runner.setBlock(headBlock)
    graphql.mockError({ name, message: 'Bad gateway' })

    await expect(sdk.utils.getSubgraphStatus()).rejects.toThrow('Bad gateway')
  })

  it('checks a single url', async ({ graphql, runner }) => {
    const meta = getMeta(601)
    const sdk = new StakeWiseSDK({
      network: Network.Mainnet,
      provider: runner.provider,
      endpoints: { web3: rpcUrl, subgraph: subgraphUrl },
    })

    runner.setBlock(headBlock)
    graphql.mock<SubgraphMetaQueryPayload>({ name, data: { _meta: meta } })

    const result = await sdk.utils.getSubgraphStatus()

    expect(result).toEqual({
      ...getStatus(meta),
      url: subgraphUrl,
      isSwitched: false,
      lagSeconds: 601,
      isOutdated: true,
      hasIndexingErrors: false,
    })
    expect(graphql.calls).toEqual([ getCall(subgraphUrl) ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    await expect(sdk.utils.getSubgraphStatus(input as unknown as Input)).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
