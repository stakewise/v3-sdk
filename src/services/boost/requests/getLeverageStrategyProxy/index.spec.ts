import { describe, expect } from 'vitest'
import { ZeroAddress } from 'ethers'

import { it, checksumAddress, mixedCaseVaultAddress } from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { GetLeverageStrategyProxyInput } from './index'


type Input = StakeWise.ExtractInput<GetLeverageStrategyProxyInput>

const proxyAddress = '0xd411a10C97a640C221D92f960289C2081c2b78cC'

describe('getLeverageStrategyProxy', () => {
  it('returns proxy', async ({ sdk, runner }) => {
    const leverageStrategyContract = sdk.contracts.special.leverageStrategyV2

    runner.on(leverageStrategyContract, {
      getStrategyProxy: ([ vault, user ]) => [
        vault === mixedCaseVaultAddress && user === checksumAddress ? proxyAddress : ZeroAddress,
      ],
    })

    const input = { vaultAddress: mixedCaseVaultAddress, userAddress: checksumAddress }

    const proxy = await sdk.boost.getLeverageStrategyProxy(input)

    expect(proxy).toBe(proxyAddress)
  })

  it('invalid vault address', async ({ sdk, runner }) => {
    const { input, message } = baseInputWiringCase

    const request = sdk.boost.getLeverageStrategyProxy(input as Input)

    await expect(request).rejects.toThrow(message)
    expect(runner.calls).toHaveLength(0)
  })
})
