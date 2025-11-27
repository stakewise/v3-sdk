import { ZeroAddress } from 'ethers'

import getBurnAmount from './index'


describe('getBurnAmount', () => {
  it('should return 0 if there are no minted assets', async () => {
    const result = await getBurnAmount({
      ltvPercent: 8000n,
      mintedAssets: 0n,
      stakedAssets: 1000n,
      newStakedAssets: 900n,
      vaultAddress: ZeroAddress,
      contracts: {} as any,
      provider: {} as any,
      options: {} as any,
      config: {} as any,
    })

    expect(result).toBe(0n)
  })

  it('should calculate the correct burn amount', async () => {
    const mockedShares = 100n

    const contracts = {
      base: {
        mintTokenController: {
          convertToShares: jest.fn().mockResolvedValue(mockedShares),
        },
      },
      helpers: {
        createVault: jest.fn().mockReturnValue({
          version: () => Promise.resolve(1n),
        }),
      },
    }

    const result = await getBurnAmount({
      ltvPercent: 8000n,
      mintedAssets: 100n,
      stakedAssets: 1000n,
      newStakedAssets: 1900n,
      vaultAddress: ZeroAddress,
      contracts: contracts as any,
      provider: {} as any,
      options: {} as any,
      config: {} as any,
    })

    expect(result).toBe(100n)
  })

  it('should calculate the correct burn amount with second vault version', async () => {
    const mockedShares = 100n

    const contracts = {
      base: {
        mintTokenController: {
          convertToShares: jest.fn().mockResolvedValue(mockedShares),
        },
      },
      helpers: {
        createVault: jest.fn().mockReturnValue({
          version: () => Promise.resolve(2n),
        }),
      },
    }

    const result = await getBurnAmount({
      ltvPercent: 800000000000000000n,
      mintedAssets: 100n,
      stakedAssets: 1000n,
      newStakedAssets: 1900n,
      vaultAddress: ZeroAddress,
      contracts: contracts as any,
      provider: {} as any,
      options: {} as any,
      config: {} as any,
    })

    expect(result).toBe(100n)
  })

  it('should return 0 if assetsToBurn is less than or equal to 0', async () => {
    const contracts = {
      base: {
        mintTokenController: {
          convertToShares: jest.fn(),
        },
      },
      helpers: {
        createVault: jest.fn().mockReturnValue({
          version: () => Promise.resolve(1n),
        }),
      },
    }

    const result = await getBurnAmount({
      ltvPercent: 8000n,
      mintedAssets: 50n,
      stakedAssets: 1000n,
      newStakedAssets: 1200n,
      vaultAddress: ZeroAddress,
      contracts: contracts as any,
      provider: {} as any,
      options: {} as any,
      config: {} as any,
    })

    expect(result).toBe(0n)
  })
})
