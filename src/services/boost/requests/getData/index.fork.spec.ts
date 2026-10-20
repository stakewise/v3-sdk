import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../../test'
import mockGraphql from '../../../../../test/mockGraphql'
import { forkAbis, useForkSdk, extendContract } from '../../../../../test/fork'

import type { AavePositionsQueryPayload, BoostMainDataQueryPayload } from '../../../../graphql/subgraph/boost'


const boosterAddress = '0xf04D6930c42cb324D350ab85ec61cf65EC6EffE1'
const boostVaultAddress = '0xAC0F906E433d58FA868F936E8A43230473652885'

const borrowLtv = '0.93'
const vaultApy = '3.5'
const allocatorMaxBoostApy = '7.25'
const boostRewardAssets = parseEther('2')
const ltvPercentBase = parseEther('1')

describe('getData', () => {
  const { sdk } = useForkSdk()
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress: boostVaultAddress })
  const leverageStrategyContract = extendContract(sdk.contracts.special.leverageStrategyV2, forkAbis.leverageStrategy)
  const mintTokenConfigContract = sdk.contracts.base.mintTokenConfig.v2

  it('boost position', async () => {
    const [ proxyAddress, stakeShares, osTokenConfig ] = await Promise.all([
      leverageStrategyContract.getStrategyProxy(boostVaultAddress, boosterAddress),
      vaultContract.getShares(boosterAddress),
      mintTokenConfigContract.getConfig(boostVaultAddress),
    ])

    const [ stakedAssets, borrowState ] = await Promise.all([
      vaultContract.convertToAssets(stakeShares),
      leverageStrategyContract.getBorrowState(proxyAddress),
    ])

    const { borrowedAssets, suppliedOsTokenShares } = borrowState
    const maxMintAssets = stakedAssets * osTokenConfig.ltvPercent / ltvPercentBase

    mockGraphql<BoostMainDataQueryPayload>({
      name: 'BoostMainData',
      data: {
        allocators: [ { assets: String(stakedAssets) } ],
        vaults: [
          {
            apy: vaultApy,
            allocatorMaxBoostApy,
            osTokenConfig: { ltvPercent: String(osTokenConfig.ltvPercent) },
          },
        ],
        leverageStrategyPositions: [
          {
            borrowLtv,
            version: '2',
            exitingPercent: '0',
            proxy: proxyAddress.toLowerCase(),
            osTokenShares: String(suppliedOsTokenShares),
            boostRewardAssets: String(boostRewardAssets),
          },
        ],
      },
    })

    mockGraphql<AavePositionsQueryPayload>({
      name: 'AavePositions',
      data: { aavePositions: [ { borrowedAssets: String(borrowedAssets) } ] },
    })

    const boostData = await sdk.boost.getData({ userAddress: boosterAddress, vaultAddress: boostVaultAddress })

    const [ maxMintShares, rewardShares ] = await Promise.all([
      sdk.contracts.base.mintTokenController.convertToShares(maxMintAssets),
      sdk.contracts.base.mintTokenController.convertToShares(boostRewardAssets),
    ])

    expect(borrowedAssets).toBeGreaterThan(0n)
    expect(maxMintShares).toBeGreaterThan(0n)
    expect(suppliedOsTokenShares).toBeGreaterThan(0n)
    expect(boostData).toMatchObject({
      maxMintShares,
      borrowedAssets,
      shares: suppliedOsTokenShares,
      rewardAssets: boostRewardAssets,
      totalShares: suppliedOsTokenShares + rewardShares,
    })
  })
})
