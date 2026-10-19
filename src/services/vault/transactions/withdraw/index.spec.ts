import { describe, expect } from 'vitest'

import {
  userAddress,
  decodeCalls,
  it as baseIt,
  vaultAddress,
} from '../../../../../test'
import ContractError from '../../../../helpers/wrapErrorHandler/ContractError'


const input = { userAddress, vaultAddress, assets: 10n }

type MockWithdrawInput = {
  version?: bigint
  canHarvest?: boolean
  isCollateralized?: boolean
}

const encodeCases = [
  {
    name: 'encode',
    values: {},
    method: 'enterExitQueue',
  },
  {
    name: 'v1 vault without collateral',
    values: { version: 1n, isCollateralized: false },
    method: 'redeem',
  },
]

const it = baseIt.extend('mockWithdraw', ({ sdk, runner, graphql, vaultContract }) => (
  (values: MockWithdrawInput = {}) => {
    const { version = 3n, isCollateralized = true, canHarvest = false } = values

    runner.on(vaultContract, {
      version: [ version ],
      convertToShares: ([ assets ]) => [ assets * 2n ],
      updateState: [],
      enterExitQueue: [ 0n ],
    })
    runner.on(sdk.contracts.base.keeper, { isCollateralized: [ isCollateralized ] })

    graphql.mockHarvestParams({ canHarvest })
  }
))

describe('withdraw', () => {
  it.for(encodeCases)('$name', async ({ values, method }, { sdk, vaultContract, mockWithdraw }) => {
    mockWithdraw(values)

    const tx = await sdk.vault.withdraw.encode(input)
    const [ call ] = decodeCalls(vaultContract, tx.data)

    expect(tx.to).toBe(vaultAddress)
    expect(call.name).toBe(method)
    expect(call.args.toArray()).toEqual([ 20n, userAddress ])
  })

  it('send', async ({ sdk, transaction, mockWithdraw }) => {
    mockWithdraw()

    await transaction.checkMulticallSend({ method: sdk.vault.withdraw, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockWithdraw }) => {
    mockWithdraw()

    await transaction.checkEstimateGas({ method: sdk.vault.withdraw, input })
  })

  it('with harvest', async ({ sdk, transaction, vaultContract, mockWithdraw }) => {
    mockWithdraw({ canHarvest: true })

    await transaction.checkHarvest({
      input,
      contract: vaultContract,
      method: sdk.vault.withdraw,
      names: [ 'updateState', 'enterExitQueue' ],
    })
  })

  it('invalid vault address', async ({ sdk }) => {
    const request = sdk.vault.withdraw.encode({ ...input, vaultAddress: '0x123' })

    await expect(request).rejects.toThrow('The "vaultAddress" argument')
  })

  it('wallet rejection', async ({ sdk, runner, mockWithdraw }) => {
    mockWithdraw()

    runner.rejectSigning()

    const request = sdk.vault.withdraw(input)

    await expect(request).rejects.toThrow(/rejected/i)
    await expect(request).rejects.toBeInstanceOf(ContractError)
  })

})
