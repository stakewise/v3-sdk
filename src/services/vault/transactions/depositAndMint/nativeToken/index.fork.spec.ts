import { describe, expect } from 'vitest'
import { getAddress, parseEther, ZeroAddress } from 'ethers'

import { it, userAddress } from '../../../../../../test'
import {
  forkAbis,
  useForkSdk,
  parseEvents,
  extendContract,
  getForkHarvestArgs,
  mockForkHarvestParams,
} from '../../../../../../test/fork'


const harvestedVaultAddress = '0xAC0F906E433d58FA868F936E8A43230473652885'

const assets = parseEther('1')
const receiveShares = parseEther('0.1')

describe('depositAndMint', () => {
  const { sdk, provider, snapshot } = useForkSdk()
  const harvestArgs = getForkHarvestArgs(snapshot)
  const { keeper } = sdk.contracts.base
  const { mintToken } = sdk.contracts.tokens

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
      vaultAddress: harvestedVaultAddress,
      call: {
        name: 'depositAndMintOsToken',
        args: [ userAddress, receiveShares, ZeroAddress ],
      },
    },
  ]

  it.for(depositCases)('$name', async ({ canHarvest, vaultAddress, call }, { transaction }) => {
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

    const canHarvestBefore = await keeper.canHarvest(vaultAddress)

    expect(canHarvestBefore, 'fixture does not match the fork block').toBe(canHarvest)

    mockForkHarvestParams(snapshot, canHarvest)

    const [ encoded, gas ] = await Promise.all([
      transaction.checkEncode({
        input,
        method: sdk.vault.depositAndMint,
        contract: vaultContract,
        calls: [ call ],
      }),
      sdk.vault.depositAndMint.estimateGas(input),
    ])

    const hash = await sdk.vault.depositAndMint(input)

    const [ receipt, sentTx, canHarvestAfter, stakeShares, mintedShares ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      keeper.canHarvest(vaultAddress),
      vaultContract.getShares(userAddress),
      mintToken.balanceOf(userAddress),
    ])

    const vaultEvents = await parseEvents(vaultContract, receipt)
    const deposited = vaultEvents.find((event) => event?.name === 'Deposited')

    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(sentTx?.value).toBe(assets)
    expect(receipt?.status).toBe(1)
    expect(canHarvestAfter).toBe(false)
    expect(deposited?.args.assets).toBe(assets)
    expect(stakeShares).toBe(deposited?.args.shares)
    expect(mintedShares).toBe(receiveShares)
  })
})
