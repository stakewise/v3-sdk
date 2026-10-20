import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { useForkSdk, fundAccount, fundVaultAdmin } from '../../../../../test/fork'
import { it, userAddress, decodeCalls, spenderAddress, adminRoleError } from '../../../../../test'

import type { Fork } from '../../../../../test/fork'


const v1VaultAddress = '0x4425Bb38D4CA95e522F9308175eC7D8188E8284e'

const managerAddress = spenderAddress

const fundAdmins = async (setupFork: Fork) => {
  const { sdk, provider } = setupFork
  const v1VaultContract = sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress })
  const v1AdminAddress = await v1VaultContract.admin()

  await fundVaultAdmin(setupFork)
  await fundAccount(provider, v1AdminAddress)
}

describe('setDepositDataManager', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: fundAdmins })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const v1VaultContract = sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress })
  const { depositDataRegistry } = sdk.contracts.base

  it('vault admin', async () => {
    const adminAddress = await vaultContract.admin()
    const input = { userAddress: adminAddress, vaultAddress, managerAddress }

    const managerBefore = await depositDataRegistry.getDepositDataManager(vaultAddress)

    expect(managerBefore, 'the manager must differ from the new one').not.toBe(managerAddress)

    const [ encoded, gas ] = await Promise.all([
      sdk.vault.setDepositDataManager.encode(input),
      sdk.vault.setDepositDataManager.estimateGas(input),
    ])

    const hash = await sdk.vault.setDepositDataManager(input)

    const [ receipt, sentTx, managerAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      depositDataRegistry.getDepositDataManager(vaultAddress),
    ])

    const [ call ] = decodeCalls(depositDataRegistry, encoded.data)

    expect(call.name).toBe('setDepositDataManager')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(managerAfter).toBe(managerAddress)
  })

  it('v1 vault', async ({ transaction }) => {
    const adminAddress = await v1VaultContract.admin()
    const input = { userAddress: adminAddress, vaultAddress: v1VaultAddress, managerAddress }

    const managerBefore = await v1VaultContract.keysManager()

    expect(managerBefore, 'the manager must differ from the new one').not.toBe(managerAddress)

    const [ encoded, gas ] = await Promise.all([
      transaction.checkEncode({
        input,
        method: sdk.vault.setDepositDataManager,
        contract: v1VaultContract,
        calls: [ { name: 'setKeysManager', args: [ managerAddress ] } ],
      }),
      sdk.vault.setDepositDataManager.estimateGas(input),
    ])

    const hash = await sdk.vault.setDepositDataManager(input)

    const [ receipt, sentTx, managerAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      v1VaultContract.keysManager(),
    ])

    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(managerAfter).toBe(managerAddress)
  })

  it('role error', async () => {
    const input = { userAddress, vaultAddress, managerAddress }

    const request = sdk.vault.setDepositDataManager(input)

    await expect(request).rejects.toBe(adminRoleError)
  })
})
