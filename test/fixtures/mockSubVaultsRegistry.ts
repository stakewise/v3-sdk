import type { VaultQueryPayload } from '../../src/graphql/subgraph/vault'

import vaultQuery from '../mocks/vaultQuery'
import { userAddress, subVaultsRegistryAddress } from '../constants'

import type { Fixture } from './types'


type MockSubVaultsRegistryInput = {
  admin?: string
}

export type MockSubVaultsRegistryFixture = (values?: MockSubVaultsRegistryInput) => (
  ReturnType<StakeWise.Contracts['helpers']['createSubVaultsRegistry']>
)

type Dependencies = 'sdk' | 'runner' | 'graphql' | 'vaultContract'

const subVaultQuery: VaultQueryPayload = {
  vault: { ...vaultQuery.vault, subVaultsRegistry: subVaultsRegistryAddress },
}

const mockSubVaultsRegistry: Fixture<'mockSubVaultsRegistry', Dependencies> = (
  { sdk, runner, graphql, vaultContract }
) => (
  (values: MockSubVaultsRegistryInput = {}) => {
    const { admin = userAddress } = values
    const registryContract = sdk.contracts.helpers.createSubVaultsRegistry(subVaultsRegistryAddress)

    runner.on(vaultContract, { admin: [ admin ] })
    runner.on(registryContract, {
      addSubVault: [],
      ejectSubVault: [],
      rejectMetaSubVault: [],
    })

    graphql.mock<VaultQueryPayload>({ name: 'Vault', data: subVaultQuery })

    return registryContract
  }
)


export default mockSubVaultsRegistry
