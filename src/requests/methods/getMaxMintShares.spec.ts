import getMaxMintShares from './getMaxMintShares'


describe('getMaxMintShares function', () => {

  it('should return 0 when ltvPercent or stakedAssets is 0 or less', async () => {
    const input = {
      ltvPercent: 0n,
      stakedAssets: 0n,
      mintedShares: 1000n,
      contracts: {
        tokens: {
          mintToken: {
            avgRewardPerSecond: jest.fn(),
            convertToShares: jest.fn(),
          },
        },
      } as unknown as StakeWise.Contracts,
    }

    const result = await getMaxMintShares(input)
    expect(result).toBe(0n)
  })

  it('should calculate max mint shares considering avgRewardPerHour', async () => {
    const mockedReward = 10n
    const mockedShares = 100n
    const contracts = {
      tokens: {
        mintToken: {
          avgRewardPerSecond: jest.fn().mockResolvedValue(mockedReward),
          convertToShares: jest.fn().mockResolvedValue(mockedShares),
        },
      },
    }

    const input = {
      ltvPercent: 8000n, // 80%
      stakedAssets: 1000n,
      mintedShares: 50n,
      contracts: contracts as any,
    }

    const result = await getMaxMintShares(input)

    const expectedMaxShares = (mockedShares - input.mintedShares) > 0n ? mockedShares - input.mintedShares : 0n

    expect(result).toBe(expectedMaxShares)
  })

  it('should return 0 if maxMintShares is less than or equal to mintedShares', async () => {
    const mockedReward = 10n
    const mockedShares = 50n
    const contracts = {
      tokens: {
        mintToken: {
          avgRewardPerSecond: jest.fn().mockResolvedValue(mockedReward),
          convertToShares: jest.fn().mockResolvedValue(mockedShares),
        },
      },
    }

    const input = {
      ltvPercent: 8000n, // 80%
      stakedAssets: 1000n,
      mintedShares: 100n,
      contracts: contracts as any,
    }

    const result = await getMaxMintShares(input)

    expect(result).toBe(0n)
  })
})
