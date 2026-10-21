import { describe, expect } from 'vitest'

import { it, rpcUrl } from '../../test'

import { Network } from './enums'
import getNetworkTypes from './getNetworkTypes'


const cases = [
  { name: 'mainnet', network: Network.Mainnet, expected: { isEthereum: true, isGnosis: false } },
  { name: 'gnosis', network: Network.Gnosis, expected: { isEthereum: false, isGnosis: true } },
]

describe('getNetworkTypes', () => {

  it.for(cases)('$name', ({ network, expected }) => {
    const result = getNetworkTypes({ network, endpoints: { web3: rpcUrl } })

    expect(result).toEqual(expected)
  })
})
