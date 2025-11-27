import modifyWhitelist from './modifyWhitelist'
import type { WhitelistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'


describe('modifyWhitelist', () => {
  const mockWhitelistQueryPayload: WhitelistAccountsQueryPayload = {
    privateVaultAccounts: [
      { createdAt: '1693395816', address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' },
      { createdAt: '1693395816', address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' },
    ],
  }

  it('should correctly transform the whitelist data', () => {
    const expectedModifiedVault = {
      whitelist: [
        {
          createdAt: 1693395816000,
          address: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
        },
        {
          createdAt: 1693395816000,
          address: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
        },
      ],
    }

    const result = modifyWhitelist({
      data: mockWhitelistQueryPayload,
    })

    expect(result).toEqual(expectedModifiedVault)
  })

  it('should handle empty privateVaultAccounts correctly', () => {
    const mockDataWithoutPrivateAccounts: WhitelistAccountsQueryPayload = {
      privateVaultAccounts: [],
    }

    const result = modifyWhitelist({
      data: mockDataWithoutPrivateAccounts,
    })

    expect(result).toEqual({ whitelist: [] })
  })
})
