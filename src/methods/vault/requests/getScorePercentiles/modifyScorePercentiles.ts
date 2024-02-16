import type { ScorePercentilesQueryPayload } from '../../../../graphql/backend/vault'
import { ModifiedScorePercentiles } from './types'


const modifyScorePercentiles = (input: ScorePercentilesQueryPayload): ModifiedScorePercentiles => {
  const { scorePercentiles } = input

  return ({
    percentile25: Number(scorePercentiles.percentile25),
    percentile50: Number(scorePercentiles.percentile50),
    percentile75: Number(scorePercentiles.percentile75),
  })
}


export default modifyScorePercentiles
