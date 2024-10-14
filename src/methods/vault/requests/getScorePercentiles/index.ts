import type { ScorePercentilesQueryPayload } from '../../../../graphql/backend/vault'
import { apiUrls } from '../../../../utils'
import graphql from '../../../../graphql'

import modifyScorePercentiles from './modifyScorePercentiles'
import { ModifiedScorePercentiles } from './types'


type GetScorePercentilesInput = {
  options: StakeWise.Options
}

const getScorePercentiles = (input: GetScorePercentilesInput) => {
  const { options } = input

  // return graphql.backend.vault.fetchScorePercentilesQuery<ModifiedScorePercentiles>({
  //   url: apiUrls.getBackendUrl(options),
  //   modifyResult: (data: ScorePercentilesQueryPayload) => modifyScorePercentiles(data),
  // })

  return {
    percentile25: 1,
    percentile50: 2,
    percentile75: 3,
  }
}


export default getScorePercentiles
