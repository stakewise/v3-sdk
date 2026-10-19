import { describe, expect } from 'vitest'
import { ZeroAddress } from 'ethers'

import {
  userAddress,
  decodeCalls,
  it as baseIt,
  vaultAddress,
  spenderAddress,
} from '../../../../../../test'
import type { HarvestInput } from '../../../../../../test'


const assets = 10n
const baseInput = { userAddress, vaultAddress, assets }
const input = { ...baseInput, referrerAddress: spenderAddress }

const it = baseIt.extend('mockDeposit', ({ runner, graphql, gnosisSdk }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = false } = values
    const vaultContract = gnosisSdk.contracts.helpers.createVault({ vaultAddress })

    runner.on(vaultContract, { deposit: [ 0n ] })

    graphql.mockHarvestParams({ canHarvest })

    return vaultContract
  }
))

describe('deposit', () => {
  it('default referrer', async ({ gnosisSdk, mockDeposit }) => {
    const vaultContract = mockDeposit()

    const encoded = await gnosisSdk.vault.deposit.encode(baseInput)
    const calls = decodeCalls(vaultContract, encoded.data)
    const callNames = calls.map(({ name }) => name)
    const callArgs = calls.map((call) => call.args.toArray())

    expect(encoded.to).toBe(vaultAddress)
    expect(callNames).toEqual([ 'deposit' ])
    expect(callArgs).toEqual([ [ assets, userAddress, ZeroAddress ] ])
  })

  it('with harvest', async ({ gnosisSdk, transaction, mockDeposit }) => {
    const vaultContract = mockDeposit({ canHarvest: true })

    const calls = await transaction.checkHarvest({
      input,
      contract: vaultContract,
      method: gnosisSdk.vault.deposit,
      names: [ 'updateState', 'deposit' ],
    })
    const depositArgs = calls[1].args.toArray()

    expect(depositArgs).toEqual([ assets, userAddress, spenderAddress ])
  })

  it('send', async ({ gnosisSdk, transaction, mockDeposit }) => {
    mockDeposit()

    await transaction.checkMulticallSend({ method: gnosisSdk.vault.deposit, input })
  })

  it('estimateGas', async ({ gnosisSdk, transaction, mockDeposit }) => {
    mockDeposit()

    await transaction.checkEstimateGas({ method: gnosisSdk.vault.deposit, input })
  })

  it('invalid vault address', async ({ gnosisSdk }) => {
    const request = gnosisSdk.vault.deposit.encode({ ...input, vaultAddress: '0x123' })

    await expect(request).rejects.toThrow('The "vaultAddress" argument must be a valid address')
  })
})
