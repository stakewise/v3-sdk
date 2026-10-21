import { expect } from 'vitest'

import { VaultType } from '../../src/helpers/enums'

import { userAddress } from '../constants'

import forkAbis from './forkAbis'
import parseEvents from './parseEvents'
import extendContract from './extendContract'
import type { Fork } from './useForkSdk'


export type ForkMetaVault = {
  metaVaultAddress: string
  subVaultsRegistryAddress: string
}

const createForkMetaVault = async ({ sdk, provider }: Fork): Promise<ForkMetaVault> => {
  const factoryContract = extendContract(sdk.contracts.factories.metavault, forkAbis.vaultFactory)

  const hash = await sdk.vault.create({ userAddress, type: VaultType.MetaVault })
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup meta vault creation must succeed').toBe(1)

  const [ created ] = await parseEvents(factoryContract, receipt)

  if (!created) {
    throw new Error('the setup meta vault creation must emit MetaVaultCreated')
  }

  const metaVaultAddress: string = created.args.vault
  const metaVaultContract = extendContract(
    sdk.contracts.helpers.createVault({ vaultAddress: metaVaultAddress }),
    forkAbis.vault
  )

  const subVaultsRegistryAddress: string = await metaVaultContract.subVaultsRegistry()

  return { metaVaultAddress, subVaultsRegistryAddress }
}


export default createForkMetaVault
