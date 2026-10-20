import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it } from '../../../../../test'
import { forkAbis, useForkSdk, fundAccount, extendContract, sendForkTransaction } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const v1VaultAddress = '0x91211A4965e75152Cb549b308f8ba398c3aB337e'

const depositDataRoot = `0x${'11'.repeat(32)}`

const fundManagers = async ({ sdk, provider, snapshot }: Fork) => {
  const v1VaultContract = sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress })

  const managerAddresses = await Promise.all([
    sdk.contracts.base.depositDataRegistry.getDepositDataManager(snapshot.vaultAddress),
    v1VaultContract.keysManager(),
  ])

  await Promise.all(managerAddresses.map((address) => fundAccount(provider, address)))
}

describe('setDepositDataRoot', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: fundManagers })
  const vaultAddress = getAddress(snapshot.vaultAddress)

  const depositDataRegistryContract = extendContract(
    sdk.contracts.base.depositDataRegistry,
    forkAbis.depositDataRegistry
  )

  const v1VaultContract = extendContract(
    sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress }),
    forkAbis.vault
  )

  it('registry', async () => {
    const managerAddress = await depositDataRegistryContract.getDepositDataManager(vaultAddress)
    const input = { userAddress: managerAddress, vaultAddress, depositDataRoot }

    const rootBefore = await depositDataRegistryContract.depositDataRoots(vaultAddress)

    expect(rootBefore, 'the root must differ from the new one').not.toBe(depositDataRoot)

    await sendForkTransaction({
      input,
      provider,
      contract: depositDataRegistryContract,
      method: sdk.vault.setDepositDataRoot,
      calls: [ { name: 'setDepositDataRoot', args: [ vaultAddress, depositDataRoot ] } ],
    })

    const rootAfter = await depositDataRegistryContract.depositDataRoots(vaultAddress)

    expect(rootAfter).toBe(depositDataRoot)
  })

  it('v1 vault', async () => {
    const keysManagerAddress = await v1VaultContract.keysManager()
    const input = { userAddress: keysManagerAddress, vaultAddress: v1VaultAddress, depositDataRoot }

    const rootBefore = await v1VaultContract.validatorsRoot()

    expect(rootBefore, 'the root must differ from the new one').not.toBe(depositDataRoot)

    await sendForkTransaction({
      input,
      provider,
      contract: v1VaultContract,
      method: sdk.vault.setDepositDataRoot,
      calls: [ { name: 'setValidatorsRoot', args: [ depositDataRoot ] } ],
    })

    const rootAfter = await v1VaultContract.validatorsRoot()

    expect(rootAfter).toBe(depositDataRoot)
  })
})
