import { describe, expect } from 'vitest'

import {
  it,
  backendUrl,
  mixedCaseVaultAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { pagedInvalidCases } from '../../../../../test/mocks/invalidCases'

import type { GetValidatorsInput } from './index'
import type { ValidatorsQueryPayload } from '../../../../graphql/backend/vault'


type Input = StakeWise.ExtractInput<GetValidatorsInput>
type Validator = ValidatorsQueryPayload['vaultValidators'][number]

type ValidatorsPayload = {
  vaultValidators: Array<Omit<Validator, 'income'> & { income: string | null }>
}

const gnosisUrl = 'https://gnosis-api.stakewise.io/graphql'

const firstKey = '0xb748119498a8cbea238267b76e532d1ba4290d25a1fa5785014c370f03e961d80d9797bbfc484f1787a2721f954a232b'
const secondKey = '0xb0070ce30d06905779b5b5860ec044995e29fc77fe13adadce0a0a62737060326f9944fcb320dc9683e0e1538ae506a4'

const validators: ValidatorsPayload['vaultValidators'] = [
  {
    apy: '1.8',
    income: '127770344000000000',
    createdAt: '2026-10-06T00:23:12+00:00',
    publicKey: firstKey,
  },
  {
    apy: '2.76',
    income: '182846135641952513',
    createdAt: '2026-10-06T00:23:12+00:00',
    publicKey: secondKey,
  },
]

const resultCases = [
  {
    name: 'returns validators',
    vaultValidators: validators,
    url: backendUrl,
    expected: [
      {
        apy: '1.80',
        earned: '0.127770344',
        createdAt: 1791246192000,
        publicKey: firstKey,
        link: `https://beaconcha.in/validator/${firstKey}`,
      },
      {
        apy: '2.76',
        earned: '0.182846135641952513',
        createdAt: 1791246192000,
        publicKey: secondKey,
        link: `https://beaconcha.in/validator/${secondKey}`,
      },
    ],
  },
  {
    name: 'gnosis link',
    isGnosis: true,
    vaultValidators: [ validators[1] ],
    url: gnosisUrl,
    expected: [
      {
        apy: '2.76',
        earned: '0.182846135641952513',
        createdAt: 1791246192000,
        publicKey: secondKey,
        link: `https://dora.gnosischain.com/validator/${secondKey}`,
      },
    ],
  },
  {
    name: 'no income',
    vaultValidators: [ { ...validators[0], income: null } ],
    url: backendUrl,
    expected: [
      {
        apy: '1.80',
        earned: '0.0',
        createdAt: 1791246192000,
        publicKey: firstKey,
        link: `https://beaconcha.in/validator/${firstKey}`,
      },
    ],
  },
  {
    name: 'no validators',
    vaultValidators: [],
    url: backendUrl,
    expected: [],
  },
]

describe('getValidators', () => {
  it.for(resultCases)('$name', async (resultCase, { sdk, graphql, gnosisSdk }) => {
    const {
      url,
      expected,
      isGnosis,
      vaultValidators,
    } = resultCase

    graphql.mock<ValidatorsPayload>({ name: 'Validators', data: { vaultValidators } })

    const validatorsSdk = isGnosis ? gnosisSdk : sdk
    const input = { vaultAddress: mixedCaseVaultAddress, skip: 20, limit: 5 }
    const call = {
      url,
      operationName: 'Validators',
      variables: { skip: 20, first: 5, vaultAddress: lowercaseMixedCaseVaultAddress },
    }

    const result = await validatorsSdk.vault.getValidators(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([ expect.objectContaining(call) ])
  })

  it.for(pagedInvalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getValidators = () => sdk.vault.getValidators(input as Input)

    expect(getValidators).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
