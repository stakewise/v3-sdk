import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { configs, Network } from '../../../../helpers'

import { it } from '../../../../../test'
import vaultQuery from '../../../../../test/mocks/vaultQuery'

import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


const vaultAddress = getAddress(vaultQuery.vault.address)
const variables = { address: vaultAddress.toLowerCase() }
const [ primaryUrl, backupUrl ] = configs[Network.Mainnet].api.subgraph

describe('getVault', () => {
  it('returns vault', async ({ sdk, graphql }) => {
    graphql.mock<VaultQueryPayload>({ name: 'Vault', data: vaultQuery })

    const result = await sdk.vault.getVault({ vaultAddress })

    expect(graphql.calls).toEqual([ expect.objectContaining({ operationName: 'Vault', variables }) ])
    expect(result.vaultAddress).toBe(vaultAddress)
    expect(result.feePercent).toBe(2)
    expect(result.capacity).toBe('0.001')
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    graphql.mock<VaultQueryPayload>({ name: 'Vault', data: vaultQuery })

    const getInvalidVault = () => sdk.vault.getVault({ vaultAddress: '0x123' })

    expect(getInvalidVault).toThrow('The "vaultAddress" argument')
    expect(graphql.calls).toHaveLength(0)
  })

  it('backup subgraph', async ({ sdk, graphql }) => {
    graphql.mockError({ name: 'Vault', message: 'subgraph is down' })

    const request = sdk.vault.getVault({ vaultAddress })

    await expect(request).rejects.toThrow('subgraph is down')

    const urls = graphql.calls.map(({ url }) => url)

    expect(urls).toEqual([ primaryUrl, backupUrl ])
  })

  it('primary after error', async ({ sdk, graphql }) => {
    graphql.mock<VaultQueryPayload>({ name: 'Vault', data: vaultQuery })

    await sdk.vault.getVault({ vaultAddress })

    const [ firstCall ] = graphql.calls

    expect(firstCall.url).toBe(primaryUrl)
  })

  it('HTTP 500', async ({ sdk, graphql }) => {
    const errors = [ { message: 'internal error' } ]

    graphql.mockError({ name: 'Vault', message: 'internal error', status: 500 })

    const request = sdk.vault.getVault({ vaultAddress })

    await expect(request).rejects.toMatchObject({ errors })

    const urls = graphql.calls.map(({ url }) => url)

    expect(urls).toEqual([ primaryUrl, backupUrl ])
  })

  it('indexing errors', async ({ sdk, graphql }) => {
    const indexingErrorsQuery = { ...vaultQuery, _meta: { hasIndexingErrors: true } }

    graphql.mock<VaultQueryPayload>({ name: 'Vault', data: indexingErrorsQuery })

    const request = sdk.vault.getVault({ vaultAddress })

    await expect(request).rejects.toThrow('Subgraph indexing error')
  })
})
