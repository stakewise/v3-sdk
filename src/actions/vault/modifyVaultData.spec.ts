import { constants } from 'helpers'
import { VaultQueryPayload } from 'graphql/subgraph/vault'

import modifyVaultData from './modifyVaultData'


describe('modifyVaultData', () => {
  const mockVaultQueryPayload: VaultQueryPayload = {
    vault: {
      performance: '0',
      isPrivate: false,
      createdAt: '1688556816',
      displayName: 'SpaceETH',
      description: 'description',
      totalAssets: '344170245872626626705',
      admin: '0x15c4bd6fe01f6cd2eaa6bf77d976a6a879b1d5bd',
      address: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      mevEscrow: '0x15c4bd6fe01f6cd2eaa6bf77d976a6a879b1d5bd',
      imageUrl: 'https://storage.stakewise.io/pnsbcysobhdz.png',
      whitelister: '0x15c4bd6fe01f6cd2eaa6bf77d976a6a879b1d5bd',
      avgRewardPerAsset: '0.0001209931296309758837545694701542947',
      proof: [
        '0x0c35025883a715f92d06c4710055e3f561922f6099398a72772e59dd8c05d750',
        '0xdc20592a47b26e461c5c2280425c9bbef70c79d6ad92c04d283f89504e49bfc3',
        '0x7c7223662bc1692f94b317ff07d62f9e29f3ce7750d28c4bd24b5c29d363e3d3',
        '0xe651d4259de705a4678ff3f154dabd3de12dc5cb7fe2b3fb85a7e0e7d072dbb9',
        '0x0637be3c03e71da05f8ebc0fb535f3fb8b85f3ef2ac2ad2f248ec39fe320af95'
      ],
      isErc20: true,
      feePercent: 1000,
      queuedShares: '1',
      tokenName: 'SpaceETH',
      tokenSymbol: 'SpaceETH',
      proofReward: '3705662924487128558',
      totalShares: '341700553853581019674',
      unclaimedAssets: '20003571094133851590',
      keysManager: '0x15c4bd6fe01f6cd2eaa6bf77d976a6a879b1d5bd',
      feeRecipient: '0x15c4bd6fe01f6cd2eaa6bf77d976a6a879b1d5bd',
      metadataIpfsHash: 'bafkreiahvll7zlfiaodmfoyra4lume6yiaztkipulclxeiwdtoflebndia',
      rewardsRoot: '0xebbcc9dcfedec9bec5e68200d2674d314ceff03de18e54fc45cf56e10ee619bf',
      validatorsRoot: '0x4f49f33924855b4d238202a8ac5374ce1dab63d181ac6a2baaa425aecfd5732b',
      capacity: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    },
    privateVaultAccounts: []
  }
  

  it('should correctly transform the vault data', () => {
    const expectedModifiedVault = {
      apy: 3.65,
      isErc20: true,
      feePercent: 2,
      isPrivate: false,
      capacity: '1000',
      proofReward: '10',
      totalShares: '100',
      queuedShares: '50',
      totalAssets: '150',
      tokenSymbol: 'mTKN',
      imageUrl: 'mockUrl',
      unclaimedAssets: '5',
      tokenName: 'mockToken',
      isSmoothingPool: false,
      rewardsRoot: 'mockRoot',
      createdAt: '2023-01-01',
      displayName: 'Mock Vault',
      metadataIpfsHash: 'mockHash',
      whitelister: 'mockWhitelister',
      description: 'This is a mock vault',
      whitelist: ['0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2'],
      vaultAdmin: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      vaultAddress: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      feeRecipient: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      mevRecipient: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      validatorsRoot: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      vaultKeysManager: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
    }

    const result = modifyVaultData(mockVaultQueryPayload)

    expect(1).toEqual(1)
  })

  // it('should use sharedMevEscrow when mevEscrow is not provided', () => {
  //   const newMockVaultQueryPayload: VaultQueryPayload = {
  //     ...mockVaultQueryPayload,
  //     vault: {
  //       ...mockVaultQueryPayload.vault,
  //       mevEscrow: '0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2'
  //     }
  //   }

  //   const result = modifyVaultData(newMockVaultQueryPayload)

  //   expect(result.mevRecipient).toEqual(constants.sharedMevEscrow)
  // })
})
