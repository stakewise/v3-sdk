import { describe, expect } from 'vitest'

import {
  userAddress,
  it as baseIt,
  vaultAddress,
  accessDenied,
  spenderAddress,
  adminRoleError,
  checksumAddress,
} from '../../../../../test'
import ContractError from '../../../../helpers/wrapErrorHandler/ContractError'

import type { ExtractSetDepositDataManager } from './index'


type MockSetDepositDataManagerInput = {
  admin?: string
  version?: bigint
}

const input = { userAddress, vaultAddress, managerAddress: spenderAddress }

const v2Vault = {
  values: {},
  method: 'setDepositDataManager',
}

const v1Vault = {
  values: { version: 1n },
  method: 'setKeysManager',
}

const encodeCases = [
  { name: 'encode', ...v2Vault, args: [ vaultAddress, spenderAddress ] },
  { name: 'v1 vault', ...v1Vault, args: [ spenderAddress ] },
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
  {
    name: 'send revert',
    run: (method: ExtractSetDepositDataManager) => method(input),
    message: '[transaction call failed]:',
  },
  {
    name: 'estimateGas revert',
    run: (method: ExtractSetDepositDataManager) => method.estimateGas(input),
    message: '[estimate gas failed]:',
  },
]

const invalidCases = [
  {
    name: 'invalid user address',
    invalidInput: { ...input, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'invalid manager address',
    invalidInput: { ...input, managerAddress: '0x123' },
    message: 'The "managerAddress" argument must be a valid address',
  },
]

const it = baseIt.extend('mockSetDepositDataManager', ({ sdk, runner, vaultContract }) => (
  (values: MockSetDepositDataManagerInput = {}) => {
    const { admin = userAddress, version = 2n } = values
    const { depositDataRegistry: depositDataRegistryContract } = sdk.contracts.base

    runner.on(vaultContract, {
      admin: [ admin ],
      version: [ version ],
      setKeysManager: [],
    })
    runner.on(depositDataRegistryContract, { setDepositDataManager: [] })

    return version === 1n ? vaultContract : depositDataRegistryContract
  }
))

describe('setDepositDataManager', () => {
  it.for(encodeCases)('$name', async ({ values, method, args }, { sdk, transaction, mockSetDepositDataManager }) => {
    const contract = mockSetDepositDataManager(values)

    await transaction.checkEncode({
      input,
      contract,
      calls: [ { name: method, args } ],
      method: sdk.vault.setDepositDataManager,
    })
  })

  it.for(sendCases)('$name', async ({ values }, { sdk, transaction, mockSetDepositDataManager }) => {
    mockSetDepositDataManager(values)

    await transaction.checkSend({ method: sdk.vault.setDepositDataManager, input })
  })

  it.for(estimateGasCases)('$name', async ({ values }, { sdk, transaction, mockSetDepositDataManager }) => {
    mockSetDepositDataManager(values)

    await transaction.checkEstimateGas({ method: sdk.vault.setDepositDataManager, input })
  })

  it.for(revertCases)('$name', async ({ run, message }, { sdk, runner, mockSetDepositDataManager }) => {
    const managerContract = mockSetDepositDataManager()

    runner.revert(managerContract, 'setDepositDataManager', accessDenied)

    const request = run(sdk.vault.setDepositDataManager)

    await expect(request).rejects.toMatchObject({ name: 'AccessDenied', message })
  })

  it('not admin', async ({ sdk, runner, mockSetDepositDataManager }) => {
    const managerContract = mockSetDepositDataManager({ admin: checksumAddress })

    runner.revert(managerContract, 'setDepositDataManager', accessDenied)

    const request = sdk.vault.setDepositDataManager(input)

    await expect(request).rejects.toBe(adminRoleError)
  })

  it('wallet rejection v1 vault', async ({ sdk, runner, mockSetDepositDataManager }) => {
    mockSetDepositDataManager({ version: 1n })

    runner.rejectSigning()

    const request = sdk.vault.setDepositDataManager(input)

    await expect(request).rejects.toThrow(/rejected/i)
    await expect(request).rejects.toBeInstanceOf(ContractError)
  })

  it.for(invalidCases)('$name', async ({ invalidInput, message }, { sdk, mockSetDepositDataManager }) => {
    mockSetDepositDataManager()

    const request = sdk.vault.setDepositDataManager.encode(invalidInput)

    await expect(request).rejects.toThrow(message)
  })
})
