import { describe, expect } from 'vitest'

import { Network } from '../../src/helpers/enums'

import { it } from '..'
import parseForkNetwork, { forkNetworkNames } from './parseForkNetwork'


const cases = [
  { name: 'mainnet', expected: Network.Mainnet },
  { name: 'gnosis', expected: Network.Gnosis },
]

describe('parseForkNetwork', () => {
  it.for(cases)('$name', ({ name, expected }) => {
    const network = parseForkNetwork(name)

    expect(network).toBe(expected)
  })

  it('unknown name', () => {
    const message = `Unknown network "unknown", expected one of: ${forkNetworkNames.join(', ')}`

    expect(() => parseForkNetwork('unknown')).toThrow(message)
  })
})
