import { describe, expect } from 'vitest'

import { Network } from '../../src/helpers/enums'

import { it } from '..'
import parseForkNetwork from './parseForkNetwork'


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
    expect(() => parseForkNetwork('hoodi')).toThrow('Unknown network "hoodi", expected one of: mainnet, gnosis')
  })
})
