import { ZeroAddress } from 'ethers'
import { describe, expect } from 'vitest'

import { Network } from '../../src/helpers/enums'
import configs from '../../src/helpers/configs'

import { it, userAddress, vaultAddress } from '..'
import collectAddresses from './collectAddresses'
import type { AddressTree, CollectedAddress } from './collectAddresses'


type Case = {
  name: string
  addresses: AddressTree
  expected: CollectedAddress[]
}

const cases: Case[] = [
  {
    name: 'nested keys',
    addresses: { base: { curator: { v1: vaultAddress, v2: userAddress } } },
    expected: [
      { key: 'base.curator.v1', address: vaultAddress },
      { key: 'base.curator.v2', address: userAddress },
    ],
  },
  {
    name: 'zero address',
    addresses: { factories: { metavault: ZeroAddress, vault: vaultAddress } },
    expected: [ { key: 'factories.vault', address: vaultAddress } ],
  },
]

describe('collectAddresses', () => {
  it.for(cases)('$name', ({ addresses, expected }) => {
    const collected = collectAddresses(addresses)

    expect(collected).toEqual(expected)
  })

  it('mainnet config', () => {
    const collected = collectAddresses(configs[Network.Mainnet].addresses)
    const addresses = collected.map(({ address }) => address)

    expect(collected.length).toBeGreaterThan(0)
    expect(addresses).not.toContain(ZeroAddress)
  })
})
