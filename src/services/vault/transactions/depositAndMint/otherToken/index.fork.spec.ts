import { describe, expect } from 'vitest'
import { getAddress, parseEther, ZeroAddress } from 'ethers'

import { Network } from '../../../../../helpers'
import { it, userAddress } from '../../../../../../test'
import {
  forkAbis,
  useForkSdk,
  parseEvents,
  gnosisAccounts,
  extendContract,
  fundDepositToken,
  getForkHarvestArgs,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../../test/fork'


const { harvestedVaultAddress } = gnosisAccounts

const assets = parseEther('1')
const receiveShares = parseEther('0.1')

describe('depositAndMint', () => {
  const fork = useForkSdk({ network: Network.Gnosis })
  const { sdk, provider, snapshot } = fork
  const depositTokenContract = sdk.contracts.helpers.createErc20(sdk.config.addresses.tokens.depositToken)
  const harvestArgs = getForkHarvestArgs(snapshot)

  const depositCases = [
    {
      name: 'with updateState',
      canHarvest: true,
      vaultAddress: getAddress(snapshot.vaultAddress),
      calls: [
        { name: 'updateState', args: [ harvestArgs ] },
        { name: 'deposit', args: [ assets, userAddress, ZeroAddress ] },
        { name: 'mintOsToken', args: [ userAddress, receiveShares, ZeroAddress ] },
      ],
    },
    {
      name: 'without updateState',
      canHarvest: false,
      vaultAddress: harvestedVaultAddress,
      calls: [
        { name: 'deposit', args: [ assets, userAddress, ZeroAddress ] },
        { name: 'mintOsToken', args: [ userAddress, receiveShares, ZeroAddress ] },
      ],
    },
  ]

  it.for(depositCases)('$name', async ({ canHarvest, vaultAddress, calls }) => {
    const input = {
      assets,
      userAddress,
      vaultAddress,
      receiveShares,
    }

    const vaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)

    const canHarvestBefore = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvestBefore, 'fixture does not match the fork block').toBe(canHarvest)

    await fundDepositToken(fork, { assets, userAddress, spenderAddress: vaultAddress })

    mockForkHarvestParams(snapshot, canHarvest)

    const balanceBefore = await depositTokenContract.balanceOf(userAddress)

    const { receipt, sentTx } = await sendForkTransaction({
      calls,
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.depositAndMint,
    })

    const [ balanceAfter, canHarvestAfter, stakeShares, mintedShares, vaultEvents ] = await Promise.all([
      depositTokenContract.balanceOf(userAddress),
      sdk.contracts.base.keeper.canHarvest(vaultAddress),
      vaultContract.getShares(userAddress),
      sdk.contracts.tokens.mintToken.balanceOf(userAddress),
      parseEvents(vaultContract, receipt),
    ])

    const deposited = vaultEvents.find((event) => event?.name === 'Deposited')

    expect(sentTx?.value).toBe(0n)
    expect(balanceBefore - balanceAfter).toBe(assets)
    expect(canHarvestAfter).toBe(false)
    expect(deposited?.args.assets).toBe(assets)
    expect(stakeShares).toBe(deposited?.args.shares)
    expect(mintedShares).toBe(receiveShares)
  })
})
