import modifyBlocklist from './modifyBlocklist'
import type { BlocklistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'


describe('modifyBlocklist', () => {
  const mockBlocklistQueryPayload: BlocklistAccountsQueryPayload = {
    vaultBlockedAccounts: [
      { createdAt: '1693395816', address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' },
      { createdAt: '1693395816', address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' },
    ],
  }

  it('should correctly transform the whitelist data', () => {
    const expectedModifiedVault = {
      blocklist: [
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

    const result = modifyBlocklist({
      data: mockBlocklistQueryPayload,
    })

    expect(result).toEqual(expectedModifiedVault)
  })

  it('should handle empty privateVaultAccounts correctly', () => {
    const mockDataWithoutBlockedAccounts: BlocklistAccountsQueryPayload = {
      vaultBlockedAccounts: [],
    }

    const result = modifyBlocklist({
      data: mockDataWithoutBlockedAccounts,
    })

    expect(result).toEqual({ blocklist: [] })
  })
})
