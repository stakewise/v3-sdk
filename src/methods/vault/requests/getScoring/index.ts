import type { ScoringQueryVariables, ScoringQueryPayload } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'
import modifyScoring from './modifyScoring'
import { ModifiedScoring } from './types'


type GetScoringInput = {
  options: StakeWise.Options
  vaultAddress: ScoringQueryVariables['vaultAddress']
}

const getScoring = async (input: GetScoringInput) => {
  const { options, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  const data = await graphql.backend.vault.fetchScoringQuery<ModifiedScoring>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      vaultAddress: vaultAddress.toLowerCase(),
    } as ScoringQueryVariables,
    modifyResult: (data: ScoringQueryPayload) => modifyScoring(data),
  })

  return data
}


export default getScoring
