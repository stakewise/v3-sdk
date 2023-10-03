import getBurnAmount from './getBurnAmount'


describe('getBurnAmount', () => {
  it('should return 0 if there are no minted assets', async () => {
    const input = {
      ltvPercent: 8000n,
      mintedAssets: 0n,
      stakedAssets: 1000n,
      newStakedAssets: 900n,
      contracts: {} as any,
    }

    const result = await getBurnAmount(input)

    expect(result).toBe(0n)
  })

  it('should calculate the correct burn amount', async () => {
    const mockedShares = 100n

    const contracts = {
      tokens: {
        mintToken: {
          convertToShares: jest.fn().mockResolvedValue(mockedShares),
        },
      },
    }

    const input = {
      ltvPercent: 8000n,
      mintedAssets: 100n,
      stakedAssets: 1000n,
      newStakedAssets: 1900n,
      contracts: contracts as any,
    }

    const result = await getBurnAmount(input)

    expect(result).toBe(100n)
  })

  it('should return 0 if assetsToBurn is less than or equal to 0', async () => {
    const contracts = {
      tokens: {
        mintToken: {
          convertToShares: jest.fn(),
        },
      },
    }

    const input = {
      ltvPercent: 8000n,
      mintedAssets: 50n,
      stakedAssets: 1000n,
      newStakedAssets: 1200n,
      contracts: contracts as any,
    }

    const result = await getBurnAmount(input)

    expect(result).toBe(0n)
  })
})
