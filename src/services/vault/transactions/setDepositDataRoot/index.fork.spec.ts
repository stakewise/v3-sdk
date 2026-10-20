import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it } from '../../../../../test'
import { forkAbis, useForkSdk, fundAccount, extendContract } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const v1VaultAddress = '0x91211A4965e75152Cb549b308f8ba398c3aB337e'

const depositDataRoot = `0x${'11'.repeat(32)}`

describe('setDepositDataRoot', () => {
  let managerAddress = ''
  let keysManagerAddress = ''

  const fundManagers = async ({ sdk, provider, snapshot }: Fork) => {
    const v1VaultContract = sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress })

    managerAddress = await sdk.contracts.base.depositDataRegistry.getDepositDataManager(snapshot.vaultAddress)
    keysManagerAddress = await v1VaultContract.keysManager()

    await Promise.all([ managerAddress, keysManagerAddress ].map((address) => fundAccount(provider, address)))
  }

  const { sdk, provider, snapshot } = useForkSdk({ setup: fundManagers })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const { depositDataRegistry } = sdk.contracts.base
  const depositDataRegistryContract = extendContract(depositDataRegistry, forkAbis.depositDataRegistry)

  const v1VaultContract = extendContract(
    sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress }),
    forkAbis.vault
  )

  it('registry', async ({ transaction }) => {
    const input = { userAddress: managerAddress, vaultAddress, depositDataRoot }

    const rootBefore = await depositDataRegistryContract.depositDataRoots(vaultAddress)

    expect(rootBefore, 'the root must differ from the new one').not.toBe(depositDataRoot)

    const [ encoded, gas ] = await Promise.all([
      transaction.checkEncode({
        input,
        method: sdk.vault.setDepositDataRoot,
        contract: depositDataRegistryContract,
        calls: [ { name: 'setDepositDataRoot', args: [ vaultAddress, depositDataRoot ] } ],
      }),
      sdk.vault.setDepositDataRoot.estimateGas(input),
    ])

    const hash = await sdk.vault.setDepositDataRoot(input)

    const [ receipt, sentTx, rootAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      depositDataRegistryContract.depositDataRoots(vaultAddress),
    ])

    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(rootAfter).toBe(depositDataRoot)
  })

  it('v1 vault', async ({ transaction }) => {
    const input = { userAddress: keysManagerAddress, vaultAddress: v1VaultAddress, depositDataRoot }

    const rootBefore = await v1VaultContract.validatorsRoot()

    expect(rootBefore, 'the root must differ from the new one').not.toBe(depositDataRoot)

    const [ encoded, gas ] = await Promise.all([
      transaction.checkEncode({
        input,
        method: sdk.vault.setDepositDataRoot,
        contract: v1VaultContract,
        calls: [ { name: 'setValidatorsRoot', args: [ depositDataRoot ] } ],
      }),
      sdk.vault.setDepositDataRoot.estimateGas(input),
    ])

    const hash = await sdk.vault.setDepositDataRoot(input)

    const [ receipt, sentTx, rootAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      v1VaultContract.validatorsRoot(),
    ])

    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(rootAfter).toBe(depositDataRoot)
  })
})
