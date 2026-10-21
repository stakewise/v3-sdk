import { describe, expect } from 'vitest'
import { getAddress, parseEther, ZeroAddress } from 'ethers'

import { it, userAddress } from '../../../../../../test'
import {
  forkAbis,
  useForkSdk,
  parseEvents,
  extendContract,
  mainnetAccounts,
  getForkHarvestArgs,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../../test/fork'


const { boostVaultAddress } = mainnetAccounts

const assets = parseEther('1')
const receiveShares = parseEther('0.1')

describe('depositAndMint', () => {
  const { sdk, provider, snapshot } = useForkSdk()
  const harvestArgs = getForkHarvestArgs(snapshot)

  const depositCases = [
    {
      name: 'with updateState',
      canHarvest: true,
      vaultAddress: getAddress(snapshot.vaultAddress),
      call: {
        name: 'updateStateAndDepositAndMintOsToken',
        args: [ userAddress, receiveShares, ZeroAddress, harvestArgs ],
      },
    },
    {
      name: 'without updateState',
      canHarvest: false,
      vaultAddress: boostVaultAddress,
      call: {
        name: 'depositAndMintOsToken',
        args: [ userAddress, receiveShares, ZeroAddress ],
      },
    },
  ]

  it.for(depositCases)('$name', async ({ canHarvest, vaultAddress, call }) => {
    const input = {
      assets,
      userAddress,
      vaultAddress,
      receiveShares,
    }

    const vaultContract = extendContract(
      sdk.contracts.helpers.createVault({ vaultAddress, options: { isDepositWithMint: true } }),
      forkAbis.vault
    )

    const canHarvestBefore = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvestBefore, 'fixture does not match the fork block').toBe(canHarvest)

    mockForkHarvestParams(snapshot, canHarvest)

    const { receipt, sentTx } = await sendForkTransaction({
      input,
      provider,
      calls: [ call ],
      contract: vaultContract,
      method: sdk.vault.depositAndMint,
    })

    const [ canHarvestAfter, stakeShares, mintedShares, vaultEvents ] = await Promise.all([
      sdk.contracts.base.keeper.canHarvest(vaultAddress),
      vaultContract.getShares(userAddress),
      sdk.contracts.tokens.mintToken.balanceOf(userAddress),
      parseEvents(vaultContract, receipt),
    ])

    const deposited = vaultEvents.find((event) => event?.name === 'Deposited')

    expect(sentTx?.value).toBe(assets)
    expect(canHarvestAfter).toBe(false)
    expect(deposited?.args.assets).toBe(assets)
    expect(stakeShares).toBe(deposited?.args.shares)
    expect(mintedShares).toBe(receiveShares)
  })
})
