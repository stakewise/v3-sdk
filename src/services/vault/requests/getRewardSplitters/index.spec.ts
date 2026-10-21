import { describe, expect } from 'vitest'

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

import type { GetRewardSplittersInput } from './index'
import type { VariablesCase } from '../../../../../test'
import type { RewardSplittersQueryPayload } from '../../../../graphql/subgraph/rewardSplitters'


type Input = StakeWise.ExtractInput<GetRewardSplittersInput>

type RewardSplitterRow = RewardSplittersQueryPayload['rewardSplitters'][number]

const splitterId = '0x00c11c64f564bcbce31c45ea2419ba4515e23bde'
const checksumSplitterId = '0x00c11C64F564bcBce31C45EA2419bA4515e23BDE'

const threeHoldersSplitter: RewardSplitterRow = {
  id: '0x4e6e55027cabd92bd445fe171fd2423f2ee67d6c',
  owner: '0xff2b6d2d5c205b99e2e6f607b6afa3127b9957b6',
  version: '1',
  claimer: null,
  totalShares: '100000000000000000000',
  shareHolders: [
    {
      id: '0x4e6e55027cabd92bd445fe171fd2423f2ee67d6c-0xff2b6d2d5c205b99e2e6f607b6afa3127b9957b6',
      shares: '34000000000000000000',
      address: '0xff2b6d2d5c205b99e2e6f607b6afa3127b9957b6',
    },
    {
      id: '0x4e6e55027cabd92bd445fe171fd2423f2ee67d6c-0xe8f5d34be4a5955eddaec2a7e0adcde15d07aba2',
      shares: '33000000000000000000',
      address: '0xe8f5d34be4a5955eddaec2a7e0adcde15d07aba2',
    },
    {
      id: '0x4e6e55027cabd92bd445fe171fd2423f2ee67d6c-0x6c7a9822a24af12e7ad533f418f61e22d6f54917',
      shares: '33000000000000000000',
      address: '0x6c7a9822a24af12e7ad533f418f61e22d6f54917',
    },
  ],
}

const noHoldersSplitter: RewardSplitterRow = {
  id: '0x070f0081f3a7483757cf68d15cd1bac74c8b8864',
  owner: '0xec01cb780202595ce2fb11225aabfad201b54e0f',
  version: '3',
  claimer: '0x0000000000000000000000000000000000000000',
  totalShares: '0',
  shareHolders: [],
}

const fractionalSplitter: RewardSplitterRow = {
  id: '0x118aa81b4148da8a23165e7ab7d6abe9001eb4e1',
  owner: '0xafe94f442aea96a9f5fd2fed79b01ec99182a319',
  version: '2',
  claimer: null,
  totalShares: '8000000000000000000',
  shareHolders: [
    {
      id: '0x118aa81b4148da8a23165e7ab7d6abe9001eb4e1-0x55fbd2d6643de2e436409b193812bd1ed1c70765',
      shares: '7000000000000000000',
      address: '0x55fbd2d6643de2e436409b193812bd1ed1c70765',
    },
    {
      id: '0x118aa81b4148da8a23165e7ab7d6abe9001eb4e1-0xafe94f442aea96a9f5fd2fed79b01ec99182a319',
      shares: '1000000000000000000',
      address: '0xafe94f442aea96a9f5fd2fed79b01ec99182a319',
    },
  ],
}

const threeHoldersResult = {
  owner: '0xff2b6d2d5c205b99e2e6f607b6afa3127b9957b6',
  claimer: null,
  version: 1,
  address: '0x4e6e55027caBD92bD445fe171fd2423f2ee67D6c',
  totalShares: 100000000000000000000n,
  feeRecipients: [
    {
      shares: 34000000000000000000n,
      percent: 34,
      address: '0xFF2B6d2d5c205b99E2e6f607B6aFA3127B9957B6',
    },
    {
      shares: 33000000000000000000n,
      percent: 33,
      address: '0xe8f5d34be4a5955edDAEc2a7e0AdcDE15D07AbA2',
    },
    {
      shares: 33000000000000000000n,
      percent: 33,
      address: '0x6c7a9822A24aF12e7Ad533F418F61e22d6f54917',
    },
  ],
}

const noHoldersResult = {
  owner: '0xec01cb780202595ce2fb11225aabfad201b54e0f',
  claimer: '0x0000000000000000000000000000000000000000',
  version: 3,
  address: '0x070F0081f3a7483757CF68D15cd1BAC74c8b8864',
  totalShares: 0n,
  feeRecipients: [],
}

const fractionalResult = {
  owner: '0xafe94f442aea96a9f5fd2fed79b01ec99182a319',
  claimer: null,
  version: 2,
  address: '0x118AA81b4148Da8a23165E7aB7D6abe9001EB4e1',
  totalShares: 8000000000000000000n,
  feeRecipients: [
    {
      shares: 7000000000000000000n,
      percent: 87.5,
      address: '0x55FbD2d6643De2e436409b193812bD1Ed1C70765',
    },
    {
      shares: 1000000000000000000n,
      percent: 12.5,
      address: '0xAFE94f442aEA96A9F5fd2feD79B01eC99182a319',
    },
  ],
}

const resultCases = [
  {
    name: 'two splitters',
    rewardSplitters: [ threeHoldersSplitter, noHoldersSplitter ],
    expected: [ threeHoldersResult, noHoldersResult ],
  },
  {
    name: 'fractional percent',
    rewardSplitters: [ fractionalSplitter ],
    expected: [ fractionalResult ],
  },
  {
    name: 'no splitters',
    rewardSplitters: [],
    expected: [],
  },
]

const variablesCases: VariablesCase<Input>[] = [
  {
    name: 'by owner',
    input: { owner: userAddress },
    expected: { where: { vault: vaultAddress, owner: userAddress } },
  },
  {
    name: 'by id',
    input: { id: splitterId },
    expected: { where: { vault: vaultAddress, id: splitterId } },
  },
  {
    name: 'checksum addresses',
    input: { vaultAddress: mixedCaseVaultAddress, owner: checksumAddress, id: checksumSplitterId },
    expected: {
      where: {
        vault: lowercaseMixedCaseVaultAddress,
        owner: lowercaseChecksumAddress,
        id: splitterId,
      },
    },
  },
]

const invalidCases = [
  {
    name: 'no owner or id',
    input: { vaultAddress },
    message: 'You must pass either ID or OWNER to get a response',
  },
  {
    name: 'invalid vault address',
    input: { vaultAddress: '0x123', owner: userAddress },
    message: 'The "vaultAddress" argument must be a valid address',
  },
  {
    name: 'invalid owner',
    input: { vaultAddress, owner: '0x123' },
    message: 'The "owner" argument must be a valid address',
  },
  {
    name: 'invalid id',
    input: { vaultAddress, id: '0x123' },
    message: 'The "id" argument must be a valid address',
  },
]

describe('getRewardSplitters', () => {
  it.for(resultCases)('$name', async ({ rewardSplitters, expected }, { sdk, graphql }) => {
    graphql.mock<RewardSplittersQueryPayload>({ name: 'RewardSplitters', data: { rewardSplitters } })

    const result = await sdk.vault.getRewardSplitters({ vaultAddress, owner: userAddress })

    expect(result).toEqual({ rewardSplitters: expected })
  })

  it.for(variablesCases)('$name', async ({ input, expected }, { sdk, graphql }) => {
    graphql.mock<RewardSplittersQueryPayload>({ name: 'RewardSplitters', data: { rewardSplitters: [] } })

    await sdk.vault.getRewardSplitters({ vaultAddress, ...input })

    const call = {
      url: subgraphUrl,
      operationName: 'RewardSplitters',
      variables: expected,
    }

    expect(graphql.calls).toEqual([ expect.objectContaining(call) ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getRewardSplitters = () => sdk.vault.getRewardSplitters(input as Input)

    expect(getRewardSplitters).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
