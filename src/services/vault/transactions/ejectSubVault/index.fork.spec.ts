import { describe, expect } from 'vitest'

import { it } from '../../../../../test'
import {
  forkAbis,
  useForkSdk,
  fundAccount,
  extendContract,
  mockForkMetaVault,
  sendForkTransaction,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const metaVault = {
  metaVaultAddress: '0x03f9e15680F0164F9c1d5FBF6EAc822d6dA40F5f',
  subVaultsRegistryAddress: '0x66343A85D2b6CE97EBb09C07f8b711B27bc300B0',
}

const ejectedSubVaultAddress = '0xA8cB2e35F594b308726b242136f0a8995BF19E97'
const remainingSubVaultAddress = '0xB36Fc5e542cb4fC562a624912f55dA2758998113'

const fundMetaVaultAdmin = async ({ sdk, provider }: Fork) => {
  const metaVaultContract = sdk.contracts.helpers.createVault({ vaultAddress: metaVault.metaVaultAddress })
  const adminAddress = await metaVaultContract.admin()

  await fundAccount(provider, adminAddress)
}

describe('ejectSubVault', () => {
  const { sdk, provider } = useForkSdk({ setup: fundMetaVaultAdmin })
  const { metaVaultAddress, subVaultsRegistryAddress } = metaVault
  const metaVaultContract = sdk.contracts.helpers.createVault({ vaultAddress: metaVaultAddress })

  const subVaultsRegistryContract = extendContract(
    sdk.contracts.helpers.createSubVaultsRegistry(subVaultsRegistryAddress),
    forkAbis.subVaultsRegistry
  )

  it('eject', async () => {
    const adminAddress = await metaVaultContract.admin()

    const input = {
      userAddress: adminAddress,
      vaultAddress: metaVaultAddress,
      subVaultAddress: ejectedSubVaultAddress,
    }

    mockForkMetaVault(metaVault)

    await sendForkTransaction({
      input,
      provider,
      method: sdk.vault.ejectSubVault,
      contract: subVaultsRegistryContract,
      calls: [ { name: 'ejectSubVault', args: [ ejectedSubVaultAddress ] } ],
    })

    const subVaults = await subVaultsRegistryContract.getSubVaults()

    expect(subVaults).toEqual([ remainingSubVaultAddress ])
  })
})
