import { describe, expect } from 'vitest'
import { ZeroAddress } from 'ethers'

import {
  userAddress,
  it as baseIt,
  vaultAddress,
  spenderAddress,
} from '../../../../../../test'
import type { HarvestInput } from '../../../../../../test'


const assets = 10n
const receiveShares = 6n
const baseInput = {
  userAddress,
  vaultAddress,
  assets,
  receiveShares,
}
const input = { ...baseInput, referrerAddress: spenderAddress }

const it = baseIt.extend('mockDepositAndMint', ({ runner, graphql, gnosisSdk }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = false } = values
    const vaultContract = gnosisSdk.contracts.helpers.createVault({ vaultAddress })

    runner.on(vaultContract, { deposit: [ 0n ], mintOsToken: [ 0n ] })

    graphql.mockHarvestParams({ canHarvest })

    return vaultContract
  }
))

describe('depositAndMint', () => {
  it('default referrer', async ({ gnosisSdk, transaction, mockDepositAndMint }) => {
    const contract = mockDepositAndMint()
    const calls = [
      { name: 'deposit', args: [ assets, userAddress, ZeroAddress ] },
      { name: 'mintOsToken', args: [ userAddress, receiveShares, ZeroAddress ] },
    ]

    await transaction.checkEncode({
      calls,
      contract,
      input: baseInput,
      method: gnosisSdk.vault.depositAndMint,
    })
  })

  it('with harvest', async ({ gnosisSdk, transaction, mockDepositAndMint }) => {
    const vaultContract = mockDepositAndMint({ canHarvest: true })

    const calls = await transaction.checkHarvest({
      input,
      contract: vaultContract,
      method: gnosisSdk.vault.depositAndMint,
      names: [ 'updateState', 'deposit', 'mintOsToken' ],
    })
    const [ depositArgs, mintArgs ] = calls.slice(1).map((call) => call.args.toArray())

    expect(depositArgs).toEqual([ assets, userAddress, spenderAddress ])
    expect(mintArgs).toEqual([ userAddress, receiveShares, spenderAddress ])
  })

  it('send', async ({ gnosisSdk, transaction, mockDepositAndMint }) => {
    mockDepositAndMint()

    await transaction.checkMulticallSend({ method: gnosisSdk.vault.depositAndMint, input })
  })

  it('estimateGas', async ({ gnosisSdk, transaction, mockDepositAndMint }) => {
    mockDepositAndMint()

    await transaction.checkEstimateGas({ method: gnosisSdk.vault.depositAndMint, input })
  })

  it('invalid vault address', async ({ gnosisSdk }) => {
    const request = gnosisSdk.vault.depositAndMint.encode({ ...input, vaultAddress: '0x123' })

    await expect(request).rejects.toThrow('The "vaultAddress" argument must be a valid address')
  })
})
