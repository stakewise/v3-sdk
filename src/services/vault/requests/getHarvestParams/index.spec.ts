import { describe, expect } from 'vitest'

import { it, subgraphUrl, checksumAddress, lowercaseChecksumAddress } from '../../../../../test'
import { vaultInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { HarvestParamsQueryPayload } from '../../../../graphql/subgraph/vault'


type HarvestParams = HarvestParamsQueryPayload['harvestParams']

type ResultPayload = {
  harvestParams: HarvestParams | null
}

const zeroRoot = `0x${'0'.repeat(64)}`

const capturedProof = [
  '0xb8ec21d4505f91e55d59fbd5ed620b00bc06f84e6d8c7d63f4191f49475aa28a',
  '0x5fe206d5cabfb5ff1f689e17763092f17c29464e8550e29dbd0ce84cbb41bace',
  '0xd537d074236ec1efaec81afe65742b7cf85c25d07907f4cd7c7c3f11d6f759cc',
]

const capturedParams: HarvestParams = {
  proof: capturedProof,
  canHarvest: false,
  rewardsRoot: '0x79a06582de66855eeefdc30c72e69efa26cdff0b25284a95649989211dd13bde',
  isMetaVault: false,
  reward: '399961012929720462323',
  unlockedMevReward: '6098906225720462323',
}

const expectedParams = {
  proof: capturedProof,
  reward: '399961012929720462323',
  rewardsRoot: '0x79a06582de66855eeefdc30c72e69efa26cdff0b25284a95649989211dd13bde',
  unlockedMevReward: '6098906225720462323',
}

const emptyParams = {
  proof: [],
  reward: '0',
  rewardsRoot: zeroRoot,
  unlockedMevReward: '0',
}

const resultCases = [
  {
    name: 'returns params',
    harvestParams: capturedParams,
    expected: { canHarvest: false, isMetaVault: false, params: expectedParams },
  },
  {
    name: 'harvestable',
    harvestParams: { ...capturedParams, canHarvest: true },
    expected: { canHarvest: true, isMetaVault: false, params: expectedParams },
  },
  {
    name: 'meta vault',
    harvestParams: { ...capturedParams, isMetaVault: true },
    expected: { canHarvest: false, isMetaVault: true, params: expectedParams },
  },
  {
    name: 'missing vault',
    harvestParams: null,
    expected: { params: emptyParams },
  },
]

describe('getHarvestParams', () => {
  it.for(resultCases)('$name', async ({ harvestParams, expected }, { sdk, graphql }) => {
    graphql.mock<ResultPayload>({ name: 'HarvestParams', data: { harvestParams } })

    const variables = { address: lowercaseChecksumAddress }

    const result = await sdk.vault.getHarvestParams({ vaultAddress: checksumAddress })

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'HarvestParams', variables }),
    ])
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    const { input, message } = vaultInvalidCase

    const getHarvestParams = () => sdk.vault.getHarvestParams(input as { vaultAddress: string })

    expect(getHarvestParams).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
