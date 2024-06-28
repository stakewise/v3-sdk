import { ZeroAddress } from 'ethers'

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
      helpers: {
        createVault: jest.fn()
      }
    }
  })

  it('should return 0n if ltvPercent is <= 0', async () => {
    const result = await getMaxMint({
      ltvPercent: 0n,
      mintedAssets: 100n,
      stakedAssets: 100n,
      vaultAddress: ZeroAddress,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })

  it('should return 0n if stakedAssets is <= 0', async () => {
    const result = await getMaxMint({
      ltvPercent: 5000n,
      mintedAssets: 100n,
      stakedAssets: 0n,
      vaultAddress: ZeroAddress,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })

  it('should return max mint shares based on calculations', async () => {
    mockContracts.helpers.createVault.mockReturnValue({
      version: () => Promise.resolve(1n)
    })

    mockContracts.base.mintTokenController.avgRewardPerSecond.mockResolvedValue(2n)

    await getMaxMint({
      ltvPercent: 9000n,
      mintedAssets: 2001547526745735889n,
      stakedAssets: 15001277163464317262n,
      vaultAddress: ZeroAddress,
      contracts: mockContracts,
    })

    const result = mockContracts.base.mintTokenController.convertToShares.mock.calls[0][0]

    expect(result).toEqual(11499601920372052438n)
  })

  it('should return correct vault with second vault versions', async () => {
    mockContracts.helpers.createVault.mockReturnValue({
      version: () => Promise.resolve(2n)
    })

    mockContracts.base.mintTokenController.avgRewardPerSecond.mockResolvedValue(2n)

    await getMaxMint({
      ltvPercent: 900000000000000000n,
      mintedAssets: 2001547526745735889n,
      stakedAssets: 15001277163464317262n,
      vaultAddress: ZeroAddress,
      contracts: mockContracts,
    })

    const result = mockContracts.base.mintTokenController.convertToShares.mock.calls[0][0]

    expect(result).toEqual(11499601920372052438n)
  })

  it('should return 0n if max mint shares is less than or equal to minted shares', async () => {
    mockContracts.helpers.createVault.mockReturnValue({
      version: () => Promise.resolve(1n)
    })

    mockContracts.base.mintTokenController.avgRewardPerSecond.mockResolvedValue(2n)
    mockContracts.base.mintTokenController.convertToShares.mockResolvedValue(900n)

    const result = await getMaxMint({
      ltvPercent: 5000n,
      mintedAssets: 1000n,
      stakedAssets: 2000n,
      vaultAddress: ZeroAddress,
      contracts: mockContracts,
    })

    expect(result).toEqual(0n)
  })
})
