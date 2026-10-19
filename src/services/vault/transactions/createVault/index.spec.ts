import { describe, expect } from 'vitest'
import { AbiCoder, MaxUint256, parseEther } from 'ethers'

import {
  backendUrl,
  userAddress,
  decodeCalls,
  it as baseIt,
  vaultAddress,
} from '../../../../../test'
import { userInvalidCase } from '../../../../../test/mocks/invalidCases'
import { ipfsHash, metadata, placeholderIpfsHash } from '../../../../../test/mocks/metadata'

import { VaultType } from '../../../../helpers'

import type { CreateVaultInput } from './types'
import type { UploadMetadataMutationPayload } from '../../../../graphql/backend/vault'


type Input = StakeWise.ExtractInput<CreateVaultInput>

type FactoryName = keyof StakeWise.Contracts['factories']

type MockCreateVaultInput = {
  isGnosis?: boolean
  factory?: FactoryName
  uploadedHash?: string
}

type EncodedWithValue = StakeWise.TransactionData & {
  value?: bigint
}

type InvalidCase = {
  name: string
  message: string
  isGnosis?: boolean
  values: Record<string, unknown>
}

type EncodeCase = {
  name: string
  tuple: string
  value?: bigint
  isGnosis?: boolean
  params: unknown[]
  args: unknown[]
  factory: FactoryName
  values: Omit<Input, 'userAddress'>
}

const input = { userAddress }
const gwei = 1_000_000_000n
const capacity = parseEther('1000')
const minCapacity = parseEther('32')
const keysManagerFee = 5
const vaultToken = { name: 'Vault token', symbol: 'VTKN' }
const mainnetCurator = '0xe01351f866C118FbD04d222f9262A470F1d44d90'
const abiCoder = AbiCoder.defaultAbiCoder()

const tuples = {
  vault: 'tuple(uint256 capacity, uint16 feePercent, string metadataIpfsHash)',
  erc20Vault: 'tuple(uint256 capacity, uint16 feePercent, string name, string symbol, string metadataIpfsHash)',
  metavault: 'tuple(address subVaultsCurator, uint256 capacity, uint16 feePercent, string metadataIpfsHash)',
  erc20Metavault: (
    'tuple(address subVaultsCurator, uint256 capacity, uint16 feePercent, string name, string symbol, '
    + 'string metadataIpfsHash)'
  ),
}

const vaultRow = {
  values: { capacity, keysManagerFee, isOwnMevEscrow: true },
  tuple: tuples.vault,
  params: [ capacity, 500n, '' ],
  args: [ true ],
  value: gwei,
}

const erc20VaultRow = {
  ...vaultRow,
  values: { ...vaultRow.values, vaultToken },
  tuple: tuples.erc20Vault,
  params: [ capacity, 500n, vaultToken.name, vaultToken.symbol, '' ],
}

const metavaultRow = {
  values: { capacity, keysManagerFee },
  tuple: tuples.metavault,
  params: [ mainnetCurator, capacity, 500n, '' ],
  args: [],
  value: gwei,
}

const erc20MetavaultRow = {
  ...metavaultRow,
  values: { ...metavaultRow.values, vaultToken },
  tuple: tuples.erc20Metavault,
  params: [ mainnetCurator, capacity, 500n, vaultToken.name, vaultToken.symbol, '' ],
}

const encodeCases: EncodeCase[] = [
  { name: 'erc20 vault', ...erc20VaultRow, factory: 'erc20Vault' },
  {
    name: 'private vault',
    ...vaultRow,
    values: { ...vaultRow.values, type: VaultType.Private },
    factory: 'privateVault',
  },
  {
    name: 'erc20 private vault',
    ...erc20VaultRow,
    values: { ...erc20VaultRow.values, type: VaultType.Private },
    factory: 'erc20PrivateVault',
  },
  {
    name: 'blocklist vault',
    ...vaultRow,
    values: { ...vaultRow.values, type: VaultType.Blocklist },
    factory: 'blocklistVault',
  },
  {
    name: 'erc20 blocklist vault',
    ...erc20VaultRow,
    values: { ...erc20VaultRow.values, type: VaultType.Blocklist },
    factory: 'erc20BlocklistVault',
  },
  {
    name: 'meta vault',
    ...metavaultRow,
    values: { ...metavaultRow.values, type: VaultType.MetaVault },
    factory: 'metavault',
  },
  {
    name: 'erc20 meta vault',
    ...erc20MetavaultRow,
    values: { ...erc20MetavaultRow.values, type: VaultType.MetaVault },
    factory: 'erc20Metavault',
  },
  {
    name: 'private meta vault',
    ...metavaultRow,
    values: { ...metavaultRow.values, type: VaultType.PrivateMetaVault },
    factory: 'privateMetavault',
  },
  {
    name: 'erc20 private meta vault',
    ...erc20MetavaultRow,
    values: { ...erc20MetavaultRow.values, type: VaultType.PrivateMetaVault },
    factory: 'erc20PrivateMetavault',
  },
  {
    name: 'gnosis vault',
    ...vaultRow,
    isGnosis: true,
    factory: 'vault',
    value: undefined,
  },
  {
    name: 'min capacity',
    ...vaultRow,
    values: { capacity: minCapacity },
    factory: 'vault',
    params: [ minCapacity, 0n, '' ],
    args: [ false ],
  },
  {
    name: 'max capacity',
    ...vaultRow,
    values: { capacity: MaxUint256 },
    factory: 'vault',
    params: [ MaxUint256, 0n, '' ],
    args: [ false ],
  },
  {
    name: 'max fee',
    ...vaultRow,
    values: { keysManagerFee: 100 },
    factory: 'vault',
    params: [ MaxUint256, 10000n, '' ],
    args: [ false ],
  },
  {
    name: 'two decimals fee',
    ...vaultRow,
    values: { keysManagerFee: 5.55 },
    factory: 'vault',
    params: [ MaxUint256, 555n, '' ],
    args: [ false ],
  },
]

const tokenMessage = 'The "vaultToken.name" argument must be a string'

const invalidCases: InvalidCase[] = [
  {
    name: userInvalidCase.name,
    values: userInvalidCase.input,
    message: userInvalidCase.message,
  },
  {
    name: 'invalid type',
    values: { ...input, type: 'Unknown' },
    message: (
      'The "type" argument must be one of the following: Default, Private, Blocklist, MetaVault, PrivateMetaVault'
    ),
  },
  {
    name: 'negative capacity',
    values: { ...input, capacity: -1n },
    message: 'The "capacity" argument must be at least 32000000000000000000',
  },
  {
    name: 'capacity above maximum',
    values: { ...input, capacity: MaxUint256 + 1n },
    message: `The "capacity" argument must be at most ${MaxUint256}`,
  },
  {
    name: 'capacity as string',
    values: { ...input, capacity: '1000' },
    message: 'The "capacity" argument must be of type bigint',
  },
  {
    name: 'fee as string',
    values: { ...input, keysManagerFee: '5' },
    message: 'The "keysManagerFee" argument must be a number',
  },
  {
    name: 'negative fee',
    values: { ...input, keysManagerFee: -1 },
    message: 'The "keysManagerFee" argument must be at least 0',
  },
  {
    name: 'fee above maximum',
    values: { ...input, keysManagerFee: 101 },
    message: 'The "keysManagerFee" argument must be at most 100',
  },
  {
    name: 'fee with three decimals',
    values: { ...input, keysManagerFee: 5.123 },
    message: 'The "keysManagerFee" argument must have at most two decimal places',
  },
  {
    name: 'escrow as string',
    values: { ...input, isOwnMevEscrow: 'yes' },
    message: 'The "isOwnMevEscrow" argument must be a boolean',
  },
  {
    name: 'token as string',
    values: { ...input, vaultToken: 'token' },
    message: 'The "vaultToken" argument must be an object',
  },
  {
    name: 'token name as number',
    values: { ...input, vaultToken: { ...vaultToken, name: 1 } },
    message: tokenMessage,
  },
  {
    name: 'token fields as number',
    values: { ...input, vaultToken: { name: 1, symbol: 2 } },
    message: 'The "vaultToken.name", "vaultToken.symbol" arguments must be a string',
  },
  {
    name: 'token with empty name',
    values: { ...input, vaultToken: { ...vaultToken, name: '' } },
    message: 'must be not empty string',
  },
  {
    name: 'meta vault escrow',
    values: { ...input, type: VaultType.MetaVault, isOwnMevEscrow: true },
    message: 'MetaVault does not support the "isOwnMevEscrow" parameter.',
  },
  {
    name: 'gnosis meta token',
    values: { ...input, type: VaultType.MetaVault, vaultToken },
    isGnosis: true,
    message: 'MetaVault does not support the ERC20 token on gnosis chain.',
  },
  {
    name: 'gnosis private meta vault',
    values: { ...input, type: VaultType.PrivateMetaVault },
    isGnosis: true,
    message: 'Gnosis chain does not support private MetaVault.',
  },
]

const decodeParams = (tuple: string, bytes: string) => {
  const [ params ] = abiCoder.decode([ tuple ], bytes)

  return params.toArray()
}

const it = baseIt.extend('mockCreateVault', ({ sdk, gnosisSdk, runner, graphql }) => (
  (values: MockCreateVaultInput = {}) => {
    const { factory = 'vault', isGnosis = false, uploadedHash = ipfsHash } = values
    const factoryContract = (isGnosis ? gnosisSdk : sdk).contracts.factories[factory]

    runner.on(factoryContract, { createVault: [ vaultAddress ] })

    graphql.mock<UploadMetadataMutationPayload>({
      name: 'UploadMetadata',
      data: { uploadMetadata: { ipfsHash: uploadedHash } },
    })

    return factoryContract
  }
))

describe('createVault', () => {
  it.for(encodeCases)('$name', async (encodeCase, { sdk, gnosisSdk, mockCreateVault }) => {
    const { values, factory, tuple, params, args, value, isGnosis = false } = encodeCase
    const factoryContract = mockCreateVault({ factory, isGnosis })

    const [ encoded, address ] = await Promise.all([
      (isGnosis ? gnosisSdk : sdk).vault.create.encode({ ...input, ...values }),
      factoryContract.getAddress(),
    ])
    const [ call ] = decodeCalls(factoryContract, encoded.data)
    const [ bytes, ...restArgs ] = call.args.toArray()
    const decodedParams = decodeParams(tuple, bytes)

    expect(encoded.to).toBe(address)
    expect((encoded as EncodedWithValue).value).toBe(value)
    expect(call.name).toBe('createVault')
    expect(decodedParams).toEqual(params)
    expect(restArgs).toEqual(args)
  })

  it('estimateGas', async ({ sdk, transaction, mockCreateVault }) => {
    mockCreateVault()

    await transaction.checkEstimateGas({ method: sdk.vault.create, input })
  })

  it('encode metadata', async ({ sdk, graphql, mockCreateVault }) => {
    const factoryContract = mockCreateVault()

    const encoded = await sdk.vault.create.encode({ ...input, ...metadata })
    const [ call ] = decodeCalls(factoryContract, encoded.data)
    const [ bytes ] = call.args.toArray()
    const decodedParams = decodeParams(tuples.vault, bytes)
    const uploadRequest = {
      url: backendUrl,
      operationName: 'UploadMetadata',
      variables: { payload: metadata },
    }

    expect(decodedParams).toEqual([ MaxUint256, 0n, ipfsHash ])
    expect(graphql.calls).toEqual([ expect.objectContaining(uploadRequest) ])
  })

  it('send', async ({ sdk, transaction, mockCreateVault }) => {
    mockCreateVault()

    await transaction.checkSend({ method: sdk.vault.create, input: { ...input, ...metadata } })
  })

  it('estimateGas metadata', async ({ sdk, graphql, transaction, mockCreateVault }) => {
    mockCreateVault({ uploadedHash: placeholderIpfsHash })

    await transaction.checkEstimateGas({ method: sdk.vault.create, input: { ...input, ...metadata } })

    const operationNames = graphql.calls.map(({ operationName }) => operationName)
    const uploads = operationNames.filter((operationName) => operationName === 'UploadMetadata')

    expect(uploads).toHaveLength(1)
  })

  it.for(invalidCases)('$name', async ({ values, message, isGnosis = false }, { sdk, gnosisSdk, graphql }) => {
    const request = (isGnosis ? gnosisSdk : sdk).vault.create.encode(values as Input)

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
