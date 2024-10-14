// import type { ScorePercentilesQueryPayload } from '../../../../graphql/backend/vault'
import { ModifiedScorePercentiles } from './types'


type Input = any // ScorePercentilesQueryPayload

const modifyScorePercentiles = (input: Input): ModifiedScorePercentiles => {
  const { scorePercentiles } = input

  return ({
    percentile25: Number(scorePercentiles.percentile25),
    percentile50: Number(scorePercentiles.percentile50),
    percentile75: Number(scorePercentiles.percentile75),
  })
}


export default modifyScorePercentiles
