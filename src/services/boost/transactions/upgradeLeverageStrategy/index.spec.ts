import { describe, expect } from 'vitest'

import {
  it,
  userAddress,
  decodeCalls,
  vaultAddress,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { UpgradeLeverageStrategyInput } from './types'


type Input = StakeWise.ExtractInput<UpgradeLeverageStrategyInput>

const input = { userAddress, vaultAddress }

describe('upgradeLeverageStrategy', () => {

  it.beforeEach(({ sdk, runner }) => {
    runner.on(sdk.contracts.special.leverageStrategy, { upgradeProxy: [] })
  })

  it('encode', async ({ sdk }) => {
    const leverageStrategyContract = sdk.contracts.special.leverageStrategy

    const [ tx, address ] = await Promise.all([
      sdk.boost.upgradeLeverageStrategy.encode(input),
      leverageStrategyContract.getAddress(),
    ])
    const [ call ] = decodeCalls(leverageStrategyContract, tx.data)

    expect(tx.to).toBe(address)
    expect(call.name).toBe('upgradeProxy')
    expect(call.args.toArray()).toEqual([ vaultAddress ])
  })

  it('send', async ({ sdk, transaction }) => {
    await transaction.checkSend({ method: sdk.boost.upgradeLeverageStrategy, input })
  })

  it('estimateGas', async ({ sdk, transaction }) => {
    await transaction.checkEstimateGas({ method: sdk.boost.upgradeLeverageStrategy, input })
  })

  it('invalid vault address', async ({ sdk }) => {
    const { input: invalidInput, message } = baseInputWiringCase

    const request = sdk.boost.upgradeLeverageStrategy.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
