import { describe, expect } from 'vitest'

import {
  it,
  vaultAddress,
  checksumAddress,
  lowercaseChecksumAddress,
} from '.'


describe('mockRunner', () => {
  it('unknown contract', async ({ vaultContract }) => {
    await expect(vaultContract.version()).rejects.toThrow(`no contract registered at ${vaultAddress}`)
  })

  it('unknown method', async ({ runner, vaultContract }) => {
    runner.on(vaultContract, { version: [ 3n ] })

    await expect(vaultContract.convertToShares(1n)).rejects.toThrow('no answer for convertToShares')
  })

  it('contract code', async ({ runner }) => {
    runner.setCode(checksumAddress, '0x6080')

    const [ lowercaseCode, checksumCode, otherCode ] = await Promise.all([
      runner.provider.getCode(lowercaseChecksumAddress),
      runner.provider.getCode(checksumAddress),
      runner.provider.getCode(vaultAddress),
    ])

    expect(lowercaseCode).toBe('0x6080')
    expect(checksumCode).toBe('0x6080')
    expect(otherCode).toBe('0x')
  })

  it('unknown RPC method', async ({ runner }) => {
    const request = runner.provider.send('wallet_getCapabilities', [])

    await expect(request).rejects.toThrow('no answer for RPC wallet_getCapabilities')
  })
})
