import { parseEther } from 'ethers'
import getMaxWithdraw from './getMaxWithdraw'


describe('getMaxWithdraw function', () => {

  it('should return 0 when ltvPercent is 0 or less', async () => {
    const input = {
      ltvPercent: 0n,
      mintedAssets: 1000n,
      stakedAssets: 2000n,
      contracts: {
        tokens: {
          mintToken: {
            avgRewardPerSecond: jest.fn(),
          },
        },
      } as unknown as StakeWise.Contracts,
    }

    const result = await getMaxWithdraw(input)
    expect(result).toBe(0n)
  })

  it('should consider rewardPerSecond for locked assets', async () => {
    const mockedReward = 10n
    const contracts = {
      tokens: {
        mintToken: {
          avgRewardPerSecond: jest.fn().mockResolvedValue(mockedReward),
        },
      },
    }

    const input = {
      ltvPercent: 8000n, // 80%
      mintedAssets: parseEther('1'),
      stakedAssets: parseEther('3'),
      contracts: contracts as any,
    }

    const result = await getMaxWithdraw(input)

    const expectedLocked = (input.mintedAssets + mockedReward * 60n * 60n) * 10_000n / input.ltvPercent
    const expectedWithdraw = input.stakedAssets - expectedLocked

    expect(result).toBe(expectedWithdraw)
  })

  it('should return 0 if locked assets exceed staked assets', async () => {
    const mockedReward = 10n
    const contracts = {
      tokens: {
        mintToken: {
          avgRewardPerSecond: jest.fn().mockResolvedValue(mockedReward),
        },
      },
    }

    const input = {
      ltvPercent: 5000n, // 50%
      mintedAssets: parseEther('4'),
      stakedAssets: parseEther('3'),
      contracts: contracts as any,
    }

    const result = await getMaxWithdraw(input)

    expect(result).toBe(0n)
  })
})
