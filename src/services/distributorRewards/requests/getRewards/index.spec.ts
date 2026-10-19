import { describe, expect } from 'vitest'

import { it, subgraphUrl, checksumAddress, lowercaseChecksumAddress } from '../../../../../test'
import { userInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { GetRewardsInput } from './index'
import type { DistributorRewardsQueryPayload } from '../../../../graphql/subgraph/distributorRewards'


type Input = StakeWise.ExtractInput<GetRewardsInput>

const claim = {
  proof: [
    '0x2d3472092093378b59ee7717d7eb663ae11b34299938046360513fdaba37ac26',
    '0xc3a5e348f94ce3e943f6a2725282fc3c168b224267bb0c59408e3c1cc6ac85f3',
    '0x37834967716a197ee88a7c1977e36777768240fb062f98042db2e9d3859f73dc',
  ],
  tokens: [ '0x7345fc8268459413bee9e9dd327f31283c65ee7e' ],
  unclaimedAmounts: [ '1932051004600131' ],
  cumulativeAmounts: [ '2432051004600131' ],
}

const secondClaim = {
  proof: [ '0x4e1532fb3a64931bad478aeab4d5ec278003d20f37929d236793a6822624de5e' ],
  tokens: [ '0x6b8c2ebf69ae6c7ae583f219d464637bd1b6bfa3' ],
  unclaimedAmounts: [ '142880574310674440' ],
  cumulativeAmounts: [ '142880574310674440' ],
}

const resultCases = [
  {
    name: 'several claims',
    distributorClaims: [ claim, secondClaim ],
    expected: claim,
  },
  {
    name: 'no claims',
    distributorClaims: [],
    expected: null,
  },
]

describe('getRewards', () => {
  it.for(resultCases)('$name', async ({ distributorClaims, expected }, { sdk, graphql }) => {
    graphql.mock<DistributorRewardsQueryPayload>({ name: 'distributorRewards', data: { distributorClaims } })

    const variables = { address: lowercaseChecksumAddress }

    const result = await sdk.distributorRewards.getRewards({ userAddress: checksumAddress })

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'distributorRewards', variables }),
    ])
  })

  it('invalid user address', async ({ sdk, graphql }) => {
    const { input, message } = userInvalidCase

    const getRewards = () => sdk.distributorRewards.getRewards(input as Input)

    expect(getRewards).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
