import { ethers, ZeroAddress } from 'ethers'

import getMaxWithdraw from './index'


describe('getMaxWithdraw function', () => {

  it('should return 0 when ltvPercent is 0 or less', async () => {
    const input = {
      ltvPercent: 0n,
      mintedAssets: 1000n,
      stakedAssets: 2000n,
      vaultAddress: ZeroAddress,
      contracts: {
        base: {
          mintTokenController: {
            avgRewardPerSecond: jest.fn(),
          },
        },
        helpers: {
          createVault: jest.fn().mockReturnValue({
            version: () => Promise.resolve(1n),
          }),
        },
      } as unknown as StakeWise.Contracts,
    }

    const result = await getMaxWithdraw(input)
    expect(result).toBe(0n)
  })

  it('should consider rewardPerSecond for locked assets', async () => {
    const mockedReward = 10n
    const contracts = {
      base: {
        mintTokenController: {
          avgRewardPerSecond: jest.fn().mockResolvedValue(mockedReward),
        },
      },
      helpers: {
        createVault: jest.fn().mockReturnValue({
          version: () => Promise.resolve(1n),
        }),
      },
    }

    const input = {
      ltvPercent: 8000n, // 80%
      mintedAssets: ethers.parseEther('1'),
      stakedAssets: ethers.parseEther('3'),
      vaultAddress: ZeroAddress,
      contracts: contracts as any,
    }

    const result = await getMaxWithdraw(input)

    expect(result).toBe(0n)
  })

  it('should return correct value with second vault version', async () => {
    const mockedReward = 10n
    const contracts = {
      base: {
        mintTokenController: {
          avgRewardPerSecond: jest.fn().mockResolvedValue(mockedReward),
        },
      },
      helpers: {
        createVault: jest.fn().mockReturnValue({
          version: () => Promise.resolve(2n),
        }),
      },
    }

    const input = {
      ltvPercent: 800000000000000000n, // 80%
      mintedAssets: ethers.parseEther('1'),
      stakedAssets: ethers.parseEther('3'),
      vaultAddress: ZeroAddress,
      contracts: contracts as any,
    }

    const result = await getMaxWithdraw(input)

    expect(result).toBe(1749999999999955000n)
  })

  it('should return 0 if locked assets exceed staked assets', async () => {
    const mockedReward = 10n
    const contracts = {
      base: {
        mintTokenController: {
          avgRewardPerSecond: jest.fn().mockResolvedValue(mockedReward),
        },
      },
      helpers: {
        createVault: jest.fn().mockReturnValue({
          version: () => Promise.resolve(1n),
        }),
      },
    }

    const input = {
      ltvPercent: 5000n, // 50%
      mintedAssets: ethers.parseEther('4'),
      stakedAssets: ethers.parseEther('3'),
      contracts: contracts as any,
      vaultAddress: ZeroAddress,
    }

    const result = await getMaxWithdraw(input)

    expect(result).toBe(0n)
  })
})
