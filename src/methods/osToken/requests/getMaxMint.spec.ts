import getMaxMint from './getMaxMint'


describe('getMaxMint', () => {
  let mockContracts: any

  beforeEach(() => {
    mockContracts = {
      base: {
        mintTokenController: {
          avgRewardPerSecond: jest.fn(),
          convertToShares: jest.fn(),
        },
      },
    }
  })

  it('should return 0n if ltvPercent is <= 0', async () => {
    const result = await getMaxMint({
      ltvPercent: 0n,
      mintedAssets: 100n,
      stakedAssets: 100n,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })

  it('should return 0n if stakedAssets is <= 0', async () => {
    const result = await getMaxMint({
      ltvPercent: 5000n,
      mintedAssets: 100n,
      stakedAssets: 0n,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })

  it('should return max mint shares based on calculations', async () => {
    mockContracts.base.mintTokenController.avgRewardPerSecond.mockResolvedValue(2n)

    await getMaxMint({
      ltvPercent: 9000n,
      mintedAssets: 2001547526745735889n,
      stakedAssets: 15001277163464317262n,
      contracts: mockContracts,
    })

    const result = mockContracts.base.mintTokenController.convertToShares.mock.calls[0][0]

    expect(result).toEqual(11499601920372052438n)
  })

  it('should return 0n if max mint shares is less than or equal to minted shares', async () => {
    mockContracts.base.mintTokenController.avgRewardPerSecond.mockResolvedValue(2n)
    mockContracts.base.mintTokenController.convertToShares.mockResolvedValue(900n)

    const result = await getMaxMint({
      ltvPercent: 5000n,
      mintedAssets: 1000n,
      stakedAssets: 2000n,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })
})
