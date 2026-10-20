import { describe, expect } from 'vitest'
import { getAddress, parseEther, ZeroAddress } from 'ethers'

import { Network } from '../../../../../helpers'
import { it, userAddress } from '../../../../../../test'
import {
  forkAbis,
  parseEvents,
  useForkSdk,
  depositToFork,
  extendContract,
  fundDepositToken,
  getForkHarvestArgs,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../../test/fork'

import type { Fork } from '../../../../../../test/fork'


const depositAssets = parseEther('1')

const fundDeposit = (setupFork: Fork) => fundDepositToken(setupFork, {
  userAddress,
  assets: depositAssets,
  spenderAddress: getAddress(setupFork.snapshot.vaultAddress),
})

describe('deposit', () => {
  const fork = useForkSdk({ network: Network.Gnosis, setup: fundDeposit })
  const { sdk, provider, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)
  const depositTokenContract = sdk.contracts.helpers.createErc20(sdk.config.addresses.tokens.depositToken)
  const harvestArgs = getForkHarvestArgs(snapshot)
  const input = { userAddress, vaultAddress, assets: depositAssets }

  const readPosition = async () => {
    const [ balance, shares ] = await Promise.all([
      depositTokenContract.balanceOf(userAddress),
      vaultContract.getShares(userAddress),
    ])

    return { balance, shares }
  }

  it('with updateState', async () => {
    const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvest, 'fixture does not match the fork block').toBe(true)

    mockForkHarvestParams(snapshot, true)

    const before = await readPosition()

    const { receipt, sentTx } = await sendForkTransaction({
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.deposit,
      calls: [
        { name: 'updateState', args: [ harvestArgs ] },
        { name: 'deposit', args: [ depositAssets, userAddress, ZeroAddress ] },
      ],
    })

    const after = await readPosition()
    const vaultEvents = await parseEvents(vaultContract, receipt)
    const deposited = vaultEvents.find((event) => event?.name === 'Deposited')?.args.toObject()

    expect(sentTx?.value).toBe(0n)
    expect(before.balance - after.balance).toBe(depositAssets)
    expect(deposited).toMatchObject({ assets: depositAssets, receiver: userAddress, caller: userAddress })
    expect(after.shares - before.shares).toBe(deposited?.shares)
  })

  it('without updateState', async () => {
    await depositToFork({ ...fork, input })
    await fundDeposit(fork)

    mockForkHarvestParams(snapshot, false)

    const before = await readPosition()

    const { receipt, sentTx } = await sendForkTransaction({
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.deposit,
      calls: [ { name: 'deposit', args: [ depositAssets, userAddress, ZeroAddress ] } ],
    })

    const after = await readPosition()
    const vaultEvents = await parseEvents(vaultContract, receipt)
    const deposited = vaultEvents.find((event) => event?.name === 'Deposited')?.args.toObject()

    expect(sentTx?.value).toBe(0n)
    expect(before.balance - after.balance).toBe(depositAssets)
    expect(deposited).toMatchObject({ assets: depositAssets, receiver: userAddress, caller: userAddress })
    expect(after.shares - before.shares).toBe(deposited?.shares)
  })
})
