import type { SnapshotsQueryVariables } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import modifySnapshots from './modifySnapshots'
import graphql from '../../../../graphql'
import { ModifiedSnapshots } from './types'


type GetSnapshotsInput = {
  options: StakeWise.Options
  vaultAddress: SnapshotsQueryVariables['vaultAddress']
  dateFrom: number
}

const getSnapshots = async (input: GetSnapshotsInput) => {
  const { options, vaultAddress, dateFrom } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ dateFrom })

  const data = await graphql.backend.vault.fetchSnapshotsQuery<ModifiedSnapshots>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      vaultAddress: vaultAddress.toLowerCase(),
      dateFrom: String(dateFrom),
    } as SnapshotsQueryVariables,
    modifyResult: modifySnapshots,
  })

  return data
}


export default getSnapshots
