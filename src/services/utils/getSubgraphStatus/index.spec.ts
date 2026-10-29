import { describe, expect } from 'vitest'

import { it, rpcUrl, subgraphUrl, replicaSubgraphUrl } from '../../../../test'
import StakeWiseSDK from '../../../StakeWiseSDK'
import { configs, Network } from '../../../helpers'
import { getRequestUrl, saveErrorUrlToSessionStorage } from '../../../modules/gql-module/utils'

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

const bothCalls = [
  expect.objectContaining({ url: subgraphUrl, operationName: name, variables: undefined }),
  expect.objectContaining({ url: replicaSubgraphUrl, operationName: name, variables: undefined }),
]

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

const switchCases = [
  {
    name: 'primary is outdated',
    primary: getMeta(601),
    replica: getMeta(12),
    expected: { url: replicaSubgraphUrl, isSwitched: true, lagSeconds: 12, isOutdated: false, hasIndexingErrors: false },
  },
  {
    name: 'primary has indexing errors',
    primary: getMeta(12, true),
    replica: getMeta(12),
    expected: { url: replicaSubgraphUrl, isSwitched: true, lagSeconds: 12, isOutdated: false, hasIndexingErrors: false },
  },
  {
    name: 'primary fails',
    primary: null,
    replica: getMeta(12),
    expected: { url: replicaSubgraphUrl, isSwitched: true, lagSeconds: 12, isOutdated: false, hasIndexingErrors: false },
  },
  {
    name: 'primary fails and replica is outdated',
    primary: null,
    replica: getMeta(601),
    expected: { url: replicaSubgraphUrl, isSwitched: true, lagSeconds: 601, isOutdated: true, hasIndexingErrors: false },
  },
  {
    name: 'both are outdated',
    primary: getMeta(601),
    replica: getMeta(700),
    expected: { url: subgraphUrl, isSwitched: false, lagSeconds: 601, isOutdated: true, hasIndexingErrors: false },
  },
  {
    name: 'replica is outdated',
    primary: getMeta(12),
    replica: getMeta(601),
    expected: { url: subgraphUrl, isSwitched: false, lagSeconds: 12, isOutdated: false, hasIndexingErrors: false },
  },
  {
    name: 'replica fails',
    primary: getMeta(601),
    replica: null,
    expected: { url: subgraphUrl, isSwitched: false, lagSeconds: 601, isOutdated: true, hasIndexingErrors: false },
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
    expect(graphql.calls).toEqual(bothCalls)
  })

  it.for(switchCases)('$name', async ({ primary, replica, expected }, { sdk, graphql, runner }) => {
    runner.setBlock(headBlock)

    const mockUrl = (url: string, meta: Meta | null) => meta
      ? graphql.mock<SubgraphMetaQueryPayload>({ name, url, data: { _meta: meta } })
      : graphql.mockError({ name, url, message: 'Bad gateway' })

    mockUrl(subgraphUrl, primary)
    mockUrl(replicaSubgraphUrl, replica)

    const result = await sdk.utils.getSubgraphStatus()
    const meta = expected.isSwitched ? replica : primary

    expect(result).toEqual({ ...expected, ...getStatus(meta as Meta) })
    expect(graphql.calls).toEqual(bothCalls)
    expect(getRequestUrl(configs[Network.Mainnet].api.subgraph)).toEqual(expected.url)
  })

  it('starts from the replica if the primary is marked as failed', async ({ sdk, graphql, runner }) => {
    const meta = getMeta(12)

    runner.setBlock(headBlock)
    saveErrorUrlToSessionStorage(subgraphUrl)
    graphql.mock<SubgraphMetaQueryPayload>({ name, data: { _meta: meta } })

    const result = await sdk.utils.getSubgraphStatus()

    expect(result).toEqual({
      ...getStatus(meta),
      url: replicaSubgraphUrl,
      isSwitched: false,
      lagSeconds: 12,
      isOutdated: false,
      hasIndexingErrors: false,
    })
    expect(graphql.calls).toEqual([ ...bothCalls ].reverse())
  })

  it('switches back to the primary', async ({ sdk, graphql, runner }) => {
    runner.setBlock(headBlock)
    saveErrorUrlToSessionStorage(subgraphUrl)
    graphql.mock<SubgraphMetaQueryPayload>({ name, url: subgraphUrl, data: { _meta: getMeta(12) } })
    graphql.mock<SubgraphMetaQueryPayload>({ name, url: replicaSubgraphUrl, data: { _meta: getMeta(601) } })

    const result = await sdk.utils.getSubgraphStatus()

    expect(result).toEqual(expect.objectContaining({ url: subgraphUrl, isSwitched: true }))
    expect(getRequestUrl(configs[Network.Mainnet].api.subgraph)).toEqual(subgraphUrl)
  })

  it('throws if all urls fail', async ({ sdk, graphql, runner }) => {
    runner.setBlock(headBlock)
    graphql.mockError({ name, message: 'Bad gateway' })

    await expect(sdk.utils.getSubgraphStatus()).rejects.toThrow('Bad gateway')
    expect(getRequestUrl(configs[Network.Mainnet].api.subgraph)).toEqual(subgraphUrl)
  })

  it('checks a single url without switching', async ({ graphql, runner }) => {
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
    expect(graphql.calls).toEqual([ bothCalls[0] ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    await expect(sdk.utils.getSubgraphStatus(input as unknown as Input)).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
