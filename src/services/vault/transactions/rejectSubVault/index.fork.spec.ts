import { describe, expect } from 'vitest'
import { ZeroAddress } from 'ethers'

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


const proposedMetaVaultAddress = '0x03f9e15680F0164F9c1d5FBF6EAc822d6dA40F5f'

describe('rejectSubVault', () => {
  let metaVault = { metaVaultAddress: '', subVaultsRegistryAddress: '' }

  const proposeMetaSubVault = async (setupFork: Fork) => {
    const { sdk, provider } = setupFork

    metaVault = await createForkMetaVault(setupFork)

    mockForkMetaVault(metaVault)

    const hash = await sdk.vault.addSubVault({
      userAddress,
      vaultAddress: metaVault.metaVaultAddress,
      subVaultAddress: proposedMetaVaultAddress,
    })

    const receipt = await provider.waitForTransaction(hash)

    expect(receipt?.status, 'the setup meta sub vault proposal must succeed').toBe(1)
  }

  const { sdk, provider } = useForkSdk({ setup: proposeMetaSubVault })

  it('reject', async () => {
    const { metaVaultAddress, subVaultsRegistryAddress } = metaVault
    const input = { userAddress, vaultAddress: metaVaultAddress, subVaultAddress: proposedMetaVaultAddress }

    const subVaultsRegistryContract = extendContract(
      sdk.contracts.helpers.createSubVaultsRegistry(subVaultsRegistryAddress),
      forkAbis.subVaultsRegistry
    )

    const pendingBefore = await subVaultsRegistryContract.pendingMetaSubVault()

    expect(pendingBefore, 'the setup must propose the meta sub vault').toBe(proposedMetaVaultAddress)

    mockForkMetaVault(metaVault)

    await sendForkTransaction({
      input,
      provider,
      method: sdk.vault.rejectSubVault,
      contract: subVaultsRegistryContract,
      calls: [ { name: 'rejectMetaSubVault', args: [ proposedMetaVaultAddress ] } ],
    })

    const pendingAfter = await subVaultsRegistryContract.pendingMetaSubVault()

    expect(pendingAfter).toBe(ZeroAddress)
  })
})
