import type { ScorePercentilesQueryPayload } from '../../../../graphql/backend/vault'
import { apiUrls } from '../../../../utils'
import graphql from '../../../../graphql'

import modifyScorePercentiles from './modifyScorePercentiles'
import { ModifiedScorePercentiles } from './types'


type GetScorePercentilesInput = {
  options: StakeWise.Options
}

const getScorePercentiles = async (input: GetScorePercentilesInput) => {
  const { options } = input

  const data = await graphql.backend.vault.fetchScorePercentilesQuery<ModifiedScorePercentiles>({
    url: apiUrls.getBackendUrl(options),
    modifyResult: (data: ScorePercentilesQueryPayload) => modifyScorePercentiles(data),
  })

  return data
}


export default getScorePercentiles
