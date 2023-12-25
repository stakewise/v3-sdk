import type { VaultSnapshotsQueryVariables } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import modifyVaultSnapshots from './modifyVaultSnapshots'
import graphql from '../../../../graphql'
import { ModifiedVaultSnapshots } from './types'


type GetVaultSnapshotsInput = {
  options: StakeWise.Options
  vaultAddress: VaultSnapshotsQueryVariables['vaultAddress']
  dateFrom: VaultSnapshotsQueryVariables['dateFrom']
}

const getVaultSnapshots = async (input: GetVaultSnapshotsInput) => {
  const { options, vaultAddress, dateFrom } = input

  validateArgs.address({ vaultAddress })
  validateArgs.string({ dateFrom })

  const data = await graphql.backend.vault.fetchVaultSnapshotsQuery<ModifiedVaultSnapshots>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      vaultAddress: vaultAddress.toLowerCase(),
      dateFrom,
    } as VaultSnapshotsQueryVariables,
    modifyResult: modifyVaultSnapshots,
  })

  return data
}


export default getVaultSnapshots
