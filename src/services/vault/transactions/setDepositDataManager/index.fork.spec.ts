import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it, userAddress, spenderAddress, adminRoleError } from '../../../../../test'
import { useForkSdk, fundAccount, fundVaultAdmin, sendForkTransaction } from '../../../../../test/fork'

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
  const { depositDataRegistry: depositDataRegistryContract } = sdk.contracts.base

  it('vault admin', async () => {
    const adminAddress = await vaultContract.admin()
    const input = { userAddress: adminAddress, vaultAddress, managerAddress }

    const managerBefore = await depositDataRegistryContract.getDepositDataManager(vaultAddress)

    expect(managerBefore, 'the manager must differ from the new one').not.toBe(managerAddress)

    await sendForkTransaction({
      input,
      provider,
      contract: depositDataRegistryContract,
      method: sdk.vault.setDepositDataManager,
      calls: [ { name: 'setDepositDataManager', args: [ vaultAddress, managerAddress ] } ],
    })

    const managerAfter = await depositDataRegistryContract.getDepositDataManager(vaultAddress)

    expect(managerAfter).toBe(managerAddress)
  })

  it('v1 vault', async () => {
    const adminAddress = await v1VaultContract.admin()
    const input = { userAddress: adminAddress, vaultAddress: v1VaultAddress, managerAddress }

    const managerBefore = await v1VaultContract.keysManager()

    expect(managerBefore, 'the manager must differ from the new one').not.toBe(managerAddress)

    await sendForkTransaction({
      input,
      provider,
      contract: v1VaultContract,
      method: sdk.vault.setDepositDataManager,
      calls: [ { name: 'setKeysManager', args: [ managerAddress ] } ],
    })

    const managerAfter = await v1VaultContract.keysManager()

    expect(managerAfter).toBe(managerAddress)
  })

  it('role error', async () => {
    const input = { userAddress, vaultAddress, managerAddress }

    const request = sdk.vault.setDepositDataManager(input)

    await expect(request).rejects.toBe(adminRoleError)
  })
})
