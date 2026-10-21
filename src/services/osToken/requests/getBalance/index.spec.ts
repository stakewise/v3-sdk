import { describe, expect } from 'vitest'

import { it, userAddress, vaultAddress, mintedShares, osTokenRatePercent } from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { GetOsTokenBalanceInput } from './index'


type Input = StakeWise.ExtractInput<GetOsTokenBalanceInput>

describe('getBalance', () => {
  it('returns balance', async ({ sdk, runner, vaultContract }) => {
    const mintTokenControllerContract = sdk.contracts.base.mintTokenController

    runner.on(vaultContract, {
      osTokenPositions: ([ owner ]) => [ owner === userAddress ? mintedShares : 0n ],
    })
    runner.on(mintTokenControllerContract, {
      convertToAssets: ([ shares ]) => [ shares * osTokenRatePercent / 100n ],
    })

    const balance = await sdk.osToken.getBalance({ vaultAddress, userAddress })

    expect(balance).toEqual({
      assets: 6_300_000_000_000_000_000n,
      shares: 6_000_000_000_000_000_000n,
    })
  })

  it('invalid vault address', async ({ sdk, runner, graphql }) => {
    const { input, message } = baseInputWiringCase

    const request = sdk.osToken.getBalance(input as Input)

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
    expect(runner.calls).toHaveLength(0)
  })
})
