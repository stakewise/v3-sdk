import mockGraphql from '../mockGraphql'
import vaultQuery from '../mocks/vaultQuery'

import type { VaultQueryPayload } from '../../src/graphql/subgraph/vault'


type Input = {
  metaVaultAddress: string
  subVaultsRegistryAddress: string
}

const mockForkMetaVault = ({ metaVaultAddress, subVaultsRegistryAddress }: Input) => mockGraphql<VaultQueryPayload>({
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
