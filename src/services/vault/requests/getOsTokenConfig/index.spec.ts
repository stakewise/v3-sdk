import { describe, expect } from 'vitest'

import { it, subgraphUrl, vaultAddress, checksumAddress, lowercaseChecksumAddress } from '../../../../../test'
import { vaultInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { VaultOsTokenConfigQueryPayload } from '../../../../graphql/subgraph/vault'


const osTokenConfigPayload: VaultOsTokenConfigQueryPayload = {
  vault: {
    osTokenConfig: {
      ltvPercent: '900000000000000000',
      liqThresholdPercent: '920000000000000000',
    },
  },
}

describe('getOsTokenConfig', () => {
  it('returns config', async ({ sdk, graphql }) => {
    graphql.mock<VaultOsTokenConfigQueryPayload>({ name: 'VaultOsTokenConfig', data: osTokenConfigPayload })

    const variables = { address: lowercaseChecksumAddress }

    const result = await sdk.vault.getOsTokenConfig({ vaultAddress: checksumAddress })

    expect(result).toEqual({
      ltvPercent: '900000000000000000',
      liqThresholdPercent: '920000000000000000',
    })
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'VaultOsTokenConfig', variables }),
    ])
  })

  it('unknown vault', async ({ sdk, graphql }) => {
    graphql.mock<{ vault: null }>({ name: 'VaultOsTokenConfig', data: { vault: null } })

    const request = sdk.vault.getOsTokenConfig({ vaultAddress })

    await expect(request).rejects.toThrow('Vault not found')
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    const { input, message } = vaultInvalidCase

    const getOsTokenConfig = () => sdk.vault.getOsTokenConfig(input as { vaultAddress: string })

    expect(getOsTokenConfig).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
