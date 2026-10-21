import mockGraphql from '../mockGraphql'
import vaultQuery from '../mocks/vaultQuery'

import type { VaultQueryPayload } from '../../src/graphql/subgraph/vault'

import type { ForkMetaVault } from './createForkMetaVault'


const mockForkMetaVault = ({ metaVaultAddress, subVaultsRegistryAddress }: ForkMetaVault) => mockGraphql<VaultQueryPayload>({
  name: 'Vault',
  data: {
    vault: {
      ...vaultQuery.vault,
      isMetaVault: true,
      address: metaVaultAddress.toLowerCase(),
      subVaultsRegistry: subVaultsRegistryAddress.toLowerCase(),
    },
  },
})


export default mockForkMetaVault
