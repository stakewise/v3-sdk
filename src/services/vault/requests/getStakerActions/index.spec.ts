import { describe, expect } from 'vitest'

import { AllocatorActionType } from '../../../../helpers'

import {
  it,
  userAddress,
  subgraphUrl,
  vaultAddress,
  checksumAddress,
  mixedCaseVaultAddress,
  lowercaseChecksumAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { pagedInvalidCases } from '../../../../../test/mocks/invalidCases'

import type { GetStakerActionsInput } from './index'
import type { VariablesCase } from '../../../../../test'
import type { AllocatorActionsQueryPayload } from '../../../../graphql/subgraph/allocatorActions'


type Input = StakeWise.ExtractInput<GetStakerActionsInput>

const baseInput = { vaultAddress, skip: 0, limit: 10 }
const depositHash = '0x3fa331899a0e6447fa0568b3efef5e36802dd6774e317aa37a2d706f69763fd1'
const createdHash = '0x285e4dcf02bfa8f8c6a656b85a565d962d1831556f5d2df03c082e9b82f4344f'

const actions: AllocatorActionsQueryPayload['allocatorActions'] = [
  {
    id: `${depositHash}-3`,
    assets: '899999999999999999',
    shares: '884956492341315809',
    createdAt: '1789649124',
    actionType: 'OsTokenMinted',
  },
  {
    id: `${depositHash}-24`,
    assets: '905808511881477205',
    shares: '884956492341315809',
    createdAt: '1789649124',
    actionType: 'BoostDeposited',
  },
  {
    id: `${depositHash}-0`,
    assets: '1000000000000000000',
    shares: '979676217867000290',
    createdAt: '1789649124',
    actionType: 'Deposited',
  },
  {
    id: `${createdHash}-0`,
    assets: '0',
    shares: '0',
    createdAt: '1691309736',
    actionType: 'VaultCreated',
  },
]

const resultCases = [
  {
    name: 'returns actions',
    allocatorActions: actions,
    expected: [
      {
        id: `${depositHash}-3`,
        assets: '0.899999999999999999',
        shares: '0.884956492341315809',
        createdAt: 1789649124000,
        actionType: 'OsTokenMinted',
        link: `https://etherscan.io/tx/${depositHash}`,
      },
      {
        id: `${depositHash}-24`,
        assets: '0.905808511881477205',
        shares: '0.884956492341315809',
        createdAt: 1789649124000,
        actionType: 'BoostDeposited',
        link: `https://etherscan.io/tx/${depositHash}`,
      },
      {
        id: `${depositHash}-0`,
        assets: '1.0',
        shares: '0.97967621786700029',
        createdAt: 1789649124000,
        actionType: 'Deposited',
        link: `https://etherscan.io/tx/${depositHash}`,
      },
      {
        id: `${createdHash}-0`,
        assets: '0.0',
        shares: '0.0',
        createdAt: 1691309736000,
        actionType: 'VaultCreated',
        link: `https://etherscan.io/tx/${createdHash}`,
      },
    ],
  },
  {
    name: 'gnosis link',
    isGnosis: true,
    allocatorActions: [ actions[0] ],
    expected: [
      {
        id: `${depositHash}-3`,
        assets: '0.899999999999999999',
        shares: '0.884956492341315809',
        createdAt: 1789649124000,
        actionType: 'OsTokenMinted',
        link: `https://gnosisscan.io/tx/${depositHash}`,
      },
    ],
  },
  {
    name: 'no actions',
    allocatorActions: [],
    expected: [],
  },
]

const variablesCases: VariablesCase<Input>[] = [
  {
    name: 'paging',
    input: { skip: 20, limit: 5 },
    expected: { skip: 20, first: 5, where: { vault_: { id: vaultAddress } } },
  },
  {
    name: 'type filter',
    input: { types: [ AllocatorActionType.Deposited, AllocatorActionType.ExitQueueEntered ] },
    expected: {
      skip: 0,
      first: 10,
      where: { actionType_in: [ 'Deposited', 'ExitQueueEntered' ], vault_: { id: vaultAddress } },
    },
  },
  {
    name: 'checksum addresses',
    input: { vaultAddress: mixedCaseVaultAddress, userAddress: checksumAddress },
    expected: {
      skip: 0,
      first: 10,
      where: {
        address: lowercaseChecksumAddress,
        vault_: { id: lowercaseMixedCaseVaultAddress },
      },
    },
  },
]

const invalidCases = [
  ...pagedInvalidCases,
  {
    name: 'invalid user address',
    input: { ...baseInput, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'types not array',
    input: { ...baseInput, types: 'Deposited' },
    message: 'The "types" argument must be an array',
  },
  {
    name: 'empty types',
    input: { ...baseInput, types: [] },
    message: 'The "types" argument is an empty array',
  },
  {
    name: 'inherited type',
    input: { ...baseInput, types: [ 'toString' ] },
    message: 'The "types.0" argument must be one of the following',
  },
]

describe('getStakerActions', () => {
  it.for(resultCases)('$name', async ({ allocatorActions, expected, isGnosis }, { sdk, graphql, gnosisSdk }) => {
    graphql.mock<AllocatorActionsQueryPayload>({ name: 'AllocatorActions', data: { allocatorActions } })

    const stakerSdk = isGnosis ? gnosisSdk : sdk

    const result = await stakerSdk.vault.getStakerActions(baseInput)

    expect(result).toEqual(expected)
  })

  it.for(variablesCases)('$name', async ({ input, expected }, { sdk, graphql }) => {
    graphql.mock<AllocatorActionsQueryPayload>({ name: 'AllocatorActions', data: { allocatorActions: [] } })

    await sdk.vault.getStakerActions({ ...baseInput, ...input })

    const call = {
      url: subgraphUrl,
      operationName: 'AllocatorActions',
      variables: expected,
    }

    expect(graphql.calls).toEqual([ expect.objectContaining(call) ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getStakerActions = () => sdk.vault.getStakerActions(input as Input)

    expect(getStakerActions).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
