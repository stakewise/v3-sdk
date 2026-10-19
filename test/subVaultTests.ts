import { expect } from 'vitest'

import {
  it,
  subgraphUrl,
  userAddress,
  decodeCalls,
  vaultAddress,
  accessDenied,
  adminRoleError,
  checksumAddress,
  subVaultAddress,
  subVaultsRegistryAddress,
} from '.'


type SubVaultTestsInput = {
  method: 'addSubVault' | 'ejectSubVault' | 'rejectSubVault'
  registryMethod: 'addSubVault' | 'ejectSubVault' | 'rejectMetaSubVault'
}

const input = { userAddress, vaultAddress, subVaultAddress }

const vaultRequest = {
  url: subgraphUrl,
  operationName: 'Vault',
  variables: { address: vaultAddress },
}

const invalidCases = [
  {
    name: 'invalid user address',
    invalidInput: { ...input, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'invalid sub vault address',
    invalidInput: { ...input, subVaultAddress: '0x123' },
    message: 'The "subVaultAddress" argument must be a valid address',
  },
  {
    name: 'missing sub vault address',
    invalidInput: { userAddress, vaultAddress },
    message: 'The "subVaultAddress" argument',
  },
]

const subVaultTests = ({ method, registryMethod }: SubVaultTestsInput) => {
  it('encode', async ({ sdk, graphql, mockSubVaultsRegistry }) => {
    const registryContract = mockSubVaultsRegistry()

    const encoded = await sdk.vault[method].encode(input)
    const [ call ] = decodeCalls(registryContract, encoded.data)

    expect(encoded.to).toBe(subVaultsRegistryAddress)
    expect(call.name).toBe(registryMethod)
    expect(call.args.toArray()).toEqual([ subVaultAddress ])
    expect(graphql.calls).toEqual([ expect.objectContaining(vaultRequest) ])
  })

  it('send', async ({ sdk, transaction, mockSubVaultsRegistry }) => {
    mockSubVaultsRegistry()

    await transaction.checkSend({ method: sdk.vault[method], input })
  })

  it('estimateGas', async ({ sdk, transaction, mockSubVaultsRegistry }) => {
    mockSubVaultsRegistry()

    await transaction.checkEstimateGas({ method: sdk.vault[method], input })
  })

  it('not admin', async ({ sdk, runner, mockSubVaultsRegistry }) => {
    const registryContract = mockSubVaultsRegistry({ admin: checksumAddress })

    runner.revert(registryContract, registryMethod, accessDenied)

    const request = sdk.vault[method](input)

    await expect(request).rejects.toBe(adminRoleError)
  })

  it.for(invalidCases)('$name', async ({ invalidInput, message }, { sdk, graphql, mockSubVaultsRegistry }) => {
    mockSubVaultsRegistry()

    const request = sdk.vault[method].encode(invalidInput as typeof input)

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
}


export default subVaultTests
