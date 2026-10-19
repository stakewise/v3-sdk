import { describe, expect } from 'vitest'

import {
  userAddress,
  it as baseIt,
  vaultAddress,
  accessDenied,
  spenderAddress,
  checksumAddress,
} from '../../../../../test'

import type { SetDepositDataRootInput } from './types'


type Input = StakeWise.ExtractInput<SetDepositDataRootInput>

type MockSetDepositDataRootInput = {
  version?: bigint
  manager?: string
}

const depositDataRoot = `0x${'cd'.repeat(32)}`
const input = { userAddress, vaultAddress, depositDataRoot }
const roleError = 'User must be the vault deposit data manager to perform this action'

const v2Vault = {
  values: {},
  method: 'setDepositDataRoot',
}

const v1Vault = {
  values: { version: 1n },
  method: 'setValidatorsRoot',
}

const encodeCases = [
  { name: 'encode', ...v2Vault, args: [ vaultAddress, depositDataRoot ] },
  { name: 'v1 vault', ...v1Vault, args: [ depositDataRoot ] },
]

const sendCases = [
  { name: 'send', ...v2Vault },
  { name: 'send v1 vault', ...v1Vault },
]

const estimateGasCases = [
  { name: 'estimateGas', ...v2Vault },
  { name: 'estimateGas v1 vault', ...v1Vault },
]

const revertCases = [
  { name: 'send revert', ...v2Vault },
  { name: 'send revert v1 vault', ...v1Vault },
]

const invalidCases = [
  {
    name: 'invalid user address',
    invalidInput: { ...input, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'invalid deposit data root',
    invalidInput: { ...input, depositDataRoot: 123 },
    message: 'The "depositDataRoot" argument must be a string',
  },
  {
    name: 'missing deposit data root',
    invalidInput: { userAddress, vaultAddress },
    message: 'The "depositDataRoot" argument',
  },
]

const it = baseIt.extend('mockSetDepositDataRoot', ({ sdk, runner, vaultContract }) => (
  (values: MockSetDepositDataRootInput = {}) => {
    const { manager = userAddress, version = 2n } = values
    const { depositDataRegistry: depositDataRegistryContract } = sdk.contracts.base
    const isV1Vault = version === 1n

    runner.on(vaultContract, {
      version: [ version ],
      keysManager: [ isV1Vault ? manager : spenderAddress ],
      setValidatorsRoot: [],
    })
    runner.on(depositDataRegistryContract, {
      getDepositDataManager: ([ vault ]) => [ isV1Vault || vault !== vaultAddress ? spenderAddress : manager ],
      setDepositDataRoot: [],
    })

    return isV1Vault ? vaultContract : depositDataRegistryContract
  }
))

describe('setDepositDataRoot', () => {
  it.for(encodeCases)('$name', async ({ values, method, args }, { sdk, transaction, mockSetDepositDataRoot }) => {
    const contract = mockSetDepositDataRoot(values)

    await transaction.checkEncode({
      input,
      contract,
      calls: [ { name: method, args } ],
      method: sdk.vault.setDepositDataRoot,
    })
  })

  it.for(sendCases)('$name', async ({ values }, { sdk, transaction, mockSetDepositDataRoot }) => {
    mockSetDepositDataRoot(values)

    await transaction.checkSend({ method: sdk.vault.setDepositDataRoot, input })
  })

  it.for(estimateGasCases)('$name', async ({ values }, { sdk, transaction, mockSetDepositDataRoot }) => {
    mockSetDepositDataRoot(values)

    await transaction.checkEstimateGas({ method: sdk.vault.setDepositDataRoot, input })
  })

  it.for(revertCases)('$name', async ({ values, method }, { sdk, runner, mockSetDepositDataRoot }) => {
    const rootContract = mockSetDepositDataRoot(values)

    runner.revert(rootContract, method, accessDenied)

    const request = sdk.vault.setDepositDataRoot(input)

    await expect(request).rejects.toMatchObject({ name: 'AccessDenied', message: '[transaction call failed]:' })
  })

  it('not manager', async ({ sdk, runner, mockSetDepositDataRoot }) => {
    const rootContract = mockSetDepositDataRoot({ manager: checksumAddress })

    runner.revert(rootContract, 'setDepositDataRoot', accessDenied)

    const request = sdk.vault.setDepositDataRoot(input)

    await expect(request).rejects.toBe(roleError)
  })

  it('manager check failed', async ({ sdk, runner, mockSetDepositDataRoot }) => {
    const rootContract = mockSetDepositDataRoot()

    runner.revert(rootContract, 'setDepositDataRoot', accessDenied)
    runner.revert(rootContract, 'getDepositDataManager', accessDenied)

    const request = sdk.vault.setDepositDataRoot(input)

    await expect(request).rejects.toMatch(/^Failed to check deposit data manager access: /)
  })

  it.for(invalidCases)('$name', async ({ invalidInput, message }, { sdk, mockSetDepositDataRoot }) => {
    mockSetDepositDataRoot()

    const request = sdk.vault.setDepositDataRoot.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
