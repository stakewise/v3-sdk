import { describe, expect } from 'vitest'

import { it, subgraphUrl, mixedCaseVaultAddress, lowercaseMixedCaseVaultAddress } from '../../../../../test'
import { pagedInvalidCases } from '../../../../../test/mocks/invalidCases'

import type { GetSubVaultsInput } from './index'
import type { SubVaultsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = StakeWise.ExtractInput<GetSubVaultsInput>
type SubVault = SubVaultsQueryPayload['subVaults'][number]['subVault']

type SubVaultsPayload = {
  subVaults: Array<{
    subVault: Omit<SubVault, 'imageUrl' | 'displayName'> & {
      imageUrl: string | null
      displayName: string | null
    }
  }>
}

const resultCases = [
  {
    name: 'returns sub vaults',
    data: {
      subVaults: [
        {
          subVault: {
            id: '0xd704bbe7f20a6ab2cfca03a404380b340ad6f1cb',
            imageUrl: 'https://storage.stakewise.io/dblymttlanna.svg',
            displayName: 'Blockdaemon',
            allocators: [ { apy: '1.609454194795390371113759620653939', assets: '167144430530589384' } ],
            exitRequests: [ { totalAssets: '1116736287744680549' }, { totalAssets: '500000000000000000' } ],
          },
        },
        {
          subVault: {
            id: '0xba447498dc4c169f2b4f427b2c4d532320457e89',
            imageUrl: 'https://storage.stakewise.io/aebyokfjgtkp.jpeg',
            displayName: 'Genesis Vault',
            allocators: [ { apy: '-0.46271349347250404166192466323886361', assets: '165838245330440491' } ],
            exitRequests: [ { totalAssets: '1116700858462089243' } ],
          },
        },
      ],
    },
    expected: [
      {
        id: '0xd704bbe7f20a6ab2cfca03a404380b340ad6f1cb',
        apy: '1.61',
        imageUrl: 'https://storage.stakewise.io/dblymttlanna.svg',
        displayName: 'Blockdaemon',
        stakingAssets: 167144430530589384n,
        exitingAssets: 1616736287744680549n,
      },
      {
        id: '0xba447498dc4c169f2b4f427b2c4d532320457e89',
        apy: '-0.46',
        imageUrl: 'https://storage.stakewise.io/aebyokfjgtkp.jpeg',
        displayName: 'Genesis Vault',
        stakingAssets: 165838245330440491n,
        exitingAssets: 1116700858462089243n,
      },
    ],
  },
  {
    name: 'missing fields',
    data: {
      subVaults: [
        {
          subVault: {
            id: '0x34284c27a2304132af751b0dec5bba2cf98ed039',
            imageUrl: null,
            displayName: null,
            allocators: [],
            exitRequests: [],
          },
        },
      ],
    },
    expected: [
      {
        id: '0x34284c27a2304132af751b0dec5bba2cf98ed039',
        apy: '0.00',
        imageUrl: '',
        displayName: '',
        stakingAssets: 0n,
        exitingAssets: 0n,
      },
    ],
  },
  {
    name: 'no sub vaults',
    data: { subVaults: [] },
    expected: [],
  },
]

describe('getSubVaults', () => {
  it.for(resultCases)('$name', async ({ data, expected }, { sdk, graphql }) => {
    graphql.mock<SubVaultsPayload>({ name: 'SubVaults', data })

    const input = { vaultAddress: mixedCaseVaultAddress, skip: 20, limit: 5 }
    const variables = {
      skip: 20,
      first: 5,
      where: { metaVault: lowercaseMixedCaseVaultAddress },
      metaVaultAddress: lowercaseMixedCaseVaultAddress,
    }

    const result = await sdk.vault.getSubVaults(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'SubVaults', variables }),
    ])
  })

  it.for(pagedInvalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getSubVaults = () => sdk.vault.getSubVaults(input as Input)

    expect(getSubVaults).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
