import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  forkAbis,
  useForkSdk,
  extendContract,
  mockForkMetaVault,
  createForkMetaVault,
  sendForkTransaction,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


describe('addSubVault', () => {
  let metaVault = { metaVaultAddress: '', subVaultsRegistryAddress: '' }

  const createMetaVault = async (setupFork: Fork) => {
    metaVault = await createForkMetaVault(setupFork)
  }

  const { sdk, provider, snapshot } = useForkSdk({ setup: createMetaVault })
  const vaultAddress = getAddress(snapshot.vaultAddress)

  it('add', async () => {
    const { metaVaultAddress, subVaultsRegistryAddress } = metaVault
    const input = { userAddress, vaultAddress: metaVaultAddress, subVaultAddress: vaultAddress }

    const subVaultsRegistryContract = extendContract(
      sdk.contracts.helpers.createSubVaultsRegistry(subVaultsRegistryAddress),
      forkAbis.subVaultsRegistry
    )

    mockForkMetaVault(metaVault)

    await sendForkTransaction({
      input,
      provider,
      method: sdk.vault.addSubVault,
      contract: subVaultsRegistryContract,
      calls: [ { name: 'addSubVault', args: [ vaultAddress ] } ],
    })

    const subVaults = await subVaultsRegistryContract.getSubVaults()

    expect(subVaults).toEqual([ vaultAddress ])
  })
})
