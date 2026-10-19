import { describe, expect } from 'vitest'
import type { Interface, TransactionDescription } from 'ethers'

import {
  backendUrl,
  userAddress,
  decodeCalls,
  it as baseIt,
  vaultAddress,
  accessDenied,
  spenderAddress,
  adminRoleError,
  checksumAddress,
} from '../../../../../test'
import { ipfsHash, metadata, placeholderIpfsHash } from '../../../../../test/mocks/metadata'
import type { UploadMetadataMutationPayload } from '../../../../graphql/backend/vault'

import type { OperateInput } from './types'


type Input = StakeWise.ExtractInput<OperateInput>

type Values = Omit<Input, 'userAddress' | 'vaultAddress'>

type MockOperateInput = {
  admin?: string
  canHarvest?: boolean
  whitelister?: string
  uploadedHash?: string
  blocklistManager?: string
}

const input = { userAddress, vaultAddress }
const gnosisBackendUrl = 'https://gnosis-api.stakewise.io/graphql'

const adminAddress = '0x3333333333333333333333333333333333333333'
const validatorsManager = '0x5555555555555555555555555555555555555555'
const whitelistManager = '0x6666666666666666666666666666666666666666'
const blocklistManager = '0x9999999999999999999999999999999999999999'
const feeRecipient = spenderAddress

const whitelist = [
  { address: '0x0101010101010101010101010101010101010101', isNew: true },
  { address: '0x0202020202020202020202020202020202020202', isNew: false },
]

const blocklist = [
  { address: '0x0303030303030303030303030303030303030303', isNew: false },
  { address: '0x0404040404040404040404040404040404040404', isNew: true },
]

const maxImage = `data:image/png;base64,${btoa('a'.repeat(1024 * 1024))}`
const largeImage = `data:image/png;base64,${btoa('a'.repeat(1024 * 1024 + 1))}`

const toListCalls = (name: string, list: typeof whitelist) => (
  list.map(({ address, isNew }) => ({ name, args: [ address, isNew ] }))
)

const longList = Array.from({ length: 700 }, () => whitelist[0])
const longBlocklist = Array.from({ length: 700 }, () => blocklist[0])

const adminFields = {
  feeRecipient,
  validatorsManager,
  feePercent: 5,
  admin: adminAddress,
}

const adminCalls = {
  setFeeRecipient: { name: 'setFeeRecipient', args: [ feeRecipient ] },
  setMetadata: { name: 'setMetadata', args: [ ipfsHash ] },
  setValidatorsManager: { name: 'setValidatorsManager', args: [ validatorsManager ] },
  setFeePercent: { name: 'setFeePercent', args: [ 500n ] },
  setAdmin: { name: 'setAdmin', args: [ adminAddress ] },
}

const uploadRequest = (payload: Record<string, string>, url = backendUrl) => expect.objectContaining({
  url,
  operationName: 'UploadMetadata',
  variables: { payload },
})

const encodeCases: Array<{ name: string, values: Values, calls: Array<{ name: string, args: unknown[] }> }> = [
  {
    name: 'private vault fields',
    values: {
      ...adminFields,
      ...metadata,
      whitelist,
      whitelistManager,
    },
    calls: [
      ...toListCalls('updateWhitelist', whitelist),
      { name: 'setWhitelister', args: [ whitelistManager ] },
      adminCalls.setFeeRecipient,
      adminCalls.setMetadata,
      adminCalls.setValidatorsManager,
      adminCalls.setFeePercent,
      adminCalls.setAdmin,
    ],
  },
  {
    name: 'blocklist vault fields',
    values: {
      ...adminFields,
      ...metadata,
      blocklist,
      blocklistManager,
    },
    calls: [
      ...toListCalls('updateBlocklist', blocklist),
      adminCalls.setFeeRecipient,
      adminCalls.setMetadata,
      { name: 'setBlocklistManager', args: [ blocklistManager ] },
      adminCalls.setValidatorsManager,
      adminCalls.setFeePercent,
      adminCalls.setAdmin,
    ],
  },
  {
    name: 'zero fee percent',
    values: { feePercent: 0 },
    calls: [ { name: 'setFeePercent', args: [ 0n ] } ],
  },
  {
    name: 'max fee percent',
    values: { feePercent: 100 },
    calls: [ { name: 'setFeePercent', args: [ 10000n ] } ],
  },
  {
    name: 'two decimals fee percent',
    values: { feePercent: 5.55 },
    calls: [ { name: 'setFeePercent', args: [ 555n ] } ],
  },
]

const limitCases = [
  {
    name: 'whitelist limit',
    values: { whitelist: longList },
    method: 'updateWhitelist',
    item: whitelist[0],
  },
  {
    name: 'blocklist limit',
    values: { blocklist: longBlocklist },
    method: 'updateBlocklist',
    item: blocklist[0],
  },
]

const metadataCases = [
  {
    name: 'empty metadata',
    values: { displayName: '' },
    requests: [],
    hash: '',
  },
  {
    name: 'max display name',
    values: { displayName: 'a'.repeat(30) },
    requests: [ uploadRequest({ image: '', displayName: 'a'.repeat(30), description: '' }) ],
    hash: ipfsHash,
  },
  {
    name: 'max description',
    values: { description: 'a'.repeat(1000) },
    requests: [ uploadRequest({ image: '', displayName: '', description: 'a'.repeat(1000) }) ],
    hash: ipfsHash,
  },
  {
    name: 'max image',
    values: { image: maxImage },
    requests: [ uploadRequest({ image: maxImage, displayName: '', description: '' }) ],
    hash: ipfsHash,
  },
  {
    name: 'gnosis metadata',
    values: metadata,
    isGnosis: true,
    requests: [ uploadRequest(metadata, gnosisBackendUrl) ],
    hash: ipfsHash,
  },
]

const uploadErrorCases = [
  {
    name: 'upload error code',
    error: { code: 'LIMIT_EXCEEDED', message: 'too many uploads' },
    expected: 'LIMIT_EXCEEDED',
  },
  {
    name: 'upload error',
    error: { message: 'storage is down' },
    expected: expect.anything(),
  },
]

const sendInput = {
  ...input,
  ...metadata,
  feePercent: 5,
  admin: adminAddress,
}

const estimateGasCases = [
  {
    name: 'estimateGas',
    values: { ...metadata, feePercent: 5, admin: adminAddress },
    canHarvest: true,
  },
  {
    name: 'estimateGas image only',
    values: { image: metadata.image },
    canHarvest: false,
  },
  {
    name: 'estimateGas name only',
    values: { displayName: metadata.displayName },
    canHarvest: false,
  },
  {
    name: 'estimateGas description only',
    values: { description: metadata.description },
    canHarvest: false,
  },
]

const whitelisterError = 'User must be the vault whitelist manager to perform this action'
const blocklistManagerError = 'User must be the vault blocklist manager to perform this action'

const roleCases = [
  {
    name: 'admin',
    values: { admin: adminAddress },
    method: 'setAdmin',
  },
  {
    name: 'fee percent',
    values: { feePercent: 5 },
    method: 'setFeePercent',
  },
  {
    name: 'fee recipient',
    values: { feeRecipient },
    method: 'setFeeRecipient',
  },
  {
    name: 'validators manager',
    values: { validatorsManager },
    method: 'setValidatorsManager',
  },
  {
    name: 'whitelist manager',
    values: { whitelistManager },
    method: 'setWhitelister',
  },
  {
    name: 'blocklist manager',
    values: { blocklistManager },
    method: 'setBlocklistManager',
  },
  {
    name: 'admin and whitelist',
    values: { admin: adminAddress, whitelist },
    method: 'setAdmin',
    roles: { whitelister: checksumAddress },
    message: whitelisterError,
  },
  {
    name: 'admin and blocklist',
    values: { admin: adminAddress, blocklist },
    method: 'setAdmin',
    roles: { blocklistManager: checksumAddress },
    message: blocklistManagerError,
  },
  {
    name: 'admin fields and whitelist',
    values: { admin: adminAddress, feeRecipient, whitelist },
    method: 'updateWhitelist',
  },
  {
    name: 'admin fields and blocklist',
    values: { admin: adminAddress, feeRecipient, blocklist },
    method: 'updateBlocklist',
  },
]

const readerCases = [
  {
    name: 'admin check failed',
    values: { admin: adminAddress, feePercent: 5 },
    method: 'setAdmin',
    reader: 'admin',
    prefix: 'Failed to check admin access: ',
  },
  {
    name: 'whitelister check failed',
    values: { whitelist },
    method: 'updateWhitelist',
    reader: 'whitelister',
    prefix: 'Failed to check whitelister access: ',
  },
  {
    name: 'blocklist manager check failed',
    values: { blocklist },
    method: 'updateBlocklist',
    reader: 'blocklistManager',
    prefix: 'Failed to check blocklist manager access: ',
  },
]

const listItemMessage = (key: string) => (
  `The "${key}" argument must be an array of objects with "address" and "isNew" keys`
)

const invalidCases: Array<{ name: string, values: Record<string, unknown>, message: string }> = [
  {
    name: 'invalid vault address',
    values: { ...input, vaultAddress: '0x123' },
    message: 'The "vaultAddress" argument must be a valid address',
  },
  {
    name: 'both managers',
    values: { ...input, whitelistManager, blocklistManager },
    message: 'You are trying to change the data for different vaults types',
  },
  {
    name: 'whitelist above limit',
    values: { ...input, whitelist: [ ...longList, whitelist[0] ] },
    message: 'we do not recommend passing more than 700 addresses to the whitelist',
  },
  {
    name: 'blocklist above limit',
    values: { ...input, blocklist: [ ...longBlocklist, blocklist[0] ] },
    message: 'we do not recommend passing more than 700 addresses to the block list',
  },
  {
    name: 'invalid admin',
    values: { ...input, admin: '0x123' },
    message: 'The "admin" argument must be a valid address',
  },
  {
    name: 'invalid fee recipient',
    values: { ...input, feeRecipient: '0x123' },
    message: 'The "feeRecipient" argument must be a valid address',
  },
  {
    name: 'invalid validators manager',
    values: { ...input, validatorsManager: '0x123' },
    message: 'The "validatorsManager" argument must be a valid address',
  },
  {
    name: 'invalid whitelist manager',
    values: { ...input, whitelistManager: '0x123' },
    message: 'The "whitelistManager" argument must be a valid address',
  },
  {
    name: 'invalid blocklist manager',
    values: { ...input, blocklistManager: '0x123' },
    message: 'The "blocklistManager" argument must be a valid address',
  },
  {
    name: 'fee percent as string',
    values: { ...input, feePercent: '5' },
    message: 'The "feePercent" argument must be a number',
  },
  {
    name: 'negative fee percent',
    values: { ...input, feePercent: -1 },
    message: 'The "feePercent" argument must be at least 0',
  },
  {
    name: 'fee percent above maximum',
    values: { ...input, feePercent: 101 },
    message: 'The "feePercent" argument must be at most 100',
  },
  {
    name: 'three decimals fee percent',
    values: { ...input, feePercent: 5.123 },
    message: 'The "feePercent" argument must have at most two decimal places',
  },
  {
    name: 'whitelist item without address',
    values: { ...input, whitelist: [ ...whitelist, { address: 1, isNew: true } ] },
    message: listItemMessage('whitelist'),
  },
  {
    name: 'whitelist item without flag',
    values: { ...input, whitelist: [ { address: whitelist[0].address, isNew: 'yes' } ] },
    message: listItemMessage('whitelist'),
  },
  {
    name: 'whitelist empty item',
    values: { ...input, whitelist: [ null ] },
    message: listItemMessage('whitelist'),
  },
  {
    name: 'blocklist as string',
    values: { ...input, blocklist: 'list' },
    message: 'The "blocklist" argument must be an array',
  },
  {
    name: 'display name above limit',
    values: { ...input, displayName: 'a'.repeat(31) },
    message: 'The "displayName" argument',
  },
  {
    name: 'description above limit',
    values: { ...input, description: 'a'.repeat(1001) },
    message: 'The "description" argument',
  },
  {
    name: 'image not base64',
    values: { ...input, image: 'not an image!' },
    message: 'The "image" argument must be a base64 image',
  },
  {
    name: 'image above limit',
    values: { ...input, image: largeImage },
    message: 'The "image" argument must be under 1 MB, current size is 1.00 MB',
  },
]

const toCalls = (calls: TransactionDescription[]) => calls.map(({ name, args }) => ({ name, args: args.toArray() }))

const it = baseIt.extend('mockOperate', ({ sdk, runner, graphql }) => (
  (values: MockOperateInput = {}) => {
    const {
      admin = userAddress,
      canHarvest = false,
      whitelister = userAddress,
      uploadedHash = ipfsHash,
      blocklistManager: blocklistManagerAddress = userAddress,
    } = values
    const vaultContract = sdk.contracts.helpers.createVault({
      vaultAddress,
      options: { isPrivate: true, isBlocklist: true },
    })

    runner.on(vaultContract, {
      admin: [ admin ],
      whitelister: [ whitelister ],
      blocklistManager: [ blocklistManagerAddress ],
      setAdmin: [],
      setMetadata: [],
      setFeePercent: [],
      updateState: [],
      updateWhitelist: [],
      updateBlocklist: [],
    })

    graphql.mockHarvestParams({ canHarvest })
    graphql.mock<UploadMetadataMutationPayload>({
      name: 'UploadMetadata',
      data: { uploadMetadata: { ipfsHash: uploadedHash } },
    })

    return vaultContract
  }
))

describe('operate', () => {
  it.for(encodeCases)('$name', async ({ values, calls }, { sdk, mockOperate }) => {
    const vaultContract = mockOperate()

    const encoded = await sdk.vault.operate.encode({ ...input, ...values })
    const encodedCalls = toCalls(decodeCalls(vaultContract, encoded.data))

    expect(encoded.to).toBe(vaultAddress)
    expect(encodedCalls).toEqual(calls)
  })

  it.for(limitCases)('$name', async ({ values, method, item }, { sdk, mockOperate }) => {
    const { interface: vaultInterface }: { interface: Interface } = mockOperate()
    const callData = vaultInterface.encodeFunctionData(method, [ item.address, item.isNew ])
    const expected = vaultInterface.encodeFunctionData('multicall', [ Array(700).fill(callData) ])

    const encoded = await sdk.vault.operate.encode({ ...input, ...values })

    expect(encoded.data).toBe(expected)
  })

  it('with harvest', async ({ sdk, transaction, mockOperate }) => {
    const vaultContract = mockOperate({ canHarvest: true })

    await transaction.checkHarvest({
      contract: vaultContract,
      method: sdk.vault.operate,
      input: { ...input, feePercent: 5 },
      names: [ 'updateState', 'setFeePercent' ],
    })
  })

  it('method without harvest', async ({ sdk, graphql, mockOperate }) => {
    const vaultContract = mockOperate({ canHarvest: true })

    const encoded = await sdk.vault.operate.encode({ ...input, admin: adminAddress })
    const callNames = decodeCalls(vaultContract, encoded.data).map(({ name }) => name)

    expect(callNames).toEqual([ 'setAdmin' ])
    expect(graphql.calls).toHaveLength(0)
  })

  it.for(metadataCases)('$name', async (metadataCase, { sdk, gnosisSdk, graphql, mockOperate }) => {
    const { values, requests, hash, isGnosis = false } = metadataCase
    const vaultContract = mockOperate()

    const encoded = await (isGnosis ? gnosisSdk : sdk).vault.operate.encode({ ...input, ...values })
    const [ call ] = decodeCalls(vaultContract, encoded.data)
    const uploads = graphql.calls.filter(({ operationName }) => operationName === 'UploadMetadata')

    expect(call.name).toBe('setMetadata')
    expect(call.args.toArray()).toEqual([ hash ])
    expect(uploads).toEqual(requests)
  })

  it.for(uploadErrorCases)('$name', async ({ error, expected }, { sdk, runner, graphql, mockOperate }) => {
    mockOperate()

    graphql.mockError({ name: 'UploadMetadata', ...error })

    const request = sdk.vault.operate({ ...input, ...metadata })

    await expect(request).rejects.toEqual(expected)
    expect(runner.sent).toHaveLength(0)
  })

  it('send', async ({ sdk, transaction, mockOperate }) => {
    mockOperate({ canHarvest: true })

    await transaction.checkMulticallSend({ method: sdk.vault.operate, input: sendInput })
  })

  it.for(estimateGasCases)('$name', async ({ values, canHarvest }, { sdk, graphql, transaction, mockOperate }) => {
    mockOperate({ canHarvest, uploadedHash: placeholderIpfsHash })

    await transaction.checkEstimateGas({ method: sdk.vault.operate, input: { ...input, ...values } })

    const uploads = graphql.calls.filter(({ operationName }) => operationName === 'UploadMetadata')

    expect(uploads).toHaveLength(1)
  })

  it.for(roleCases)('$name', async (roleCase, { sdk, runner, mockOperate }) => {
    const { values, method, roles = { admin: checksumAddress }, message = adminRoleError } = roleCase
    const vaultContract = mockOperate(roles)

    runner.revert(vaultContract, method, accessDenied)

    const request = sdk.vault.operate({ ...input, ...values })

    await expect(request).rejects.toBe(message)
  })

  it.for(readerCases)('$name', async ({ values, method, reader, prefix }, { sdk, runner, mockOperate }) => {
    const vaultContract = mockOperate()

    runner.revert(vaultContract, method, accessDenied)
    runner.revert(vaultContract, reader, accessDenied)

    const request = sdk.vault.operate({ ...input, ...values })

    await expect(request).rejects.toMatch(new RegExp(`^${prefix}`))
  })

  it.for(invalidCases)('$name', async ({ values, message }, { sdk, graphql }) => {
    const request = sdk.vault.operate.encode(values as Input)

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
