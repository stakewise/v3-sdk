import { describe, expect } from 'vitest'

import { it, subgraphUrl } from '../../../../../test'

import type { OsTokenApyQueryPayload } from '../../../../graphql/subgraph/osToken'


const resultCases = [
  {
    name: 'returns apy',
    data: { osTokens: [ { apy: '0.2059314626283428571428571428571429', feePercent: 500 } ] },
    expected: { apy: '0.2059314626283428571428571428571429', feePercent: 500 },
  },
  {
    name: 'no osToken',
    data: { osTokens: [] },
    expected: { apy: '0', feePercent: 0 },
  },
]

describe('getOsTokenAPY', () => {
  it.for(resultCases)('$name', async ({ data, expected }, { sdk, graphql }) => {
    graphql.mock<OsTokenApyQueryPayload>({ name: 'osTokenApy', data })

    const result = await sdk.osToken.getAPY()

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'osTokenApy', variables: undefined }),
    ])
  })
})
