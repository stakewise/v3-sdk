import getMaxMint from './getMaxMint'


describe('getMaxMint', () => {
  let mockContracts: any

  beforeEach(() => {
    mockContracts = {
      tokens: {
        mintToken: {
          avgRewardPerSecond: jest.fn(),
          convertToShares: jest.fn(),
        },
      },
    }
  })

  it('should return 0n if ltvPercent is <= 0', async () => {
    const result = await getMaxMint({
      ltvPercent: 0n,
      mintedShares: 100n,
      stakedAssets: 100n,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })

  it('should return 0n if stakedAssets is <= 0', async () => {
    const result = await getMaxMint({
      ltvPercent: 5000n,
      mintedShares: 100n,
      stakedAssets: 0n,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })

  it('should return max mint shares based on calculations', async () => {
    mockContracts.tokens.mintToken.avgRewardPerSecond.mockResolvedValue(2n)
    mockContracts.tokens.mintToken.convertToShares.mockResolvedValue(1500n)

    const result = await getMaxMint({
      ltvPercent: 5000n,
      mintedShares: 1000n,
      stakedAssets: 2000n,
      contracts: mockContracts,
    })

    expect(result).toEqual(500n)
  })

  it('should return 0n if max mint shares is less than or equal to minted shares', async () => {
    mockContracts.tokens.mintToken.avgRewardPerSecond.mockResolvedValue(2n)
    mockContracts.tokens.mintToken.convertToShares.mockResolvedValue(900n)

    const result = await getMaxMint({
      ltvPercent: 5000n,
      mintedShares: 1000n,
      stakedAssets: 2000n,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })
})
