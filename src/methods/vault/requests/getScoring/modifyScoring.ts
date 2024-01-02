import type { ScoringQueryPayload } from '../../../../graphql/backend/vault'
import { ModifiedScoring } from './types'


const modifyScoring = (input: ScoringQueryPayload): ModifiedScoring => {
  const { vaults } = input

  const { scoring } = vaults[0]

  return ({
    consensusRewardsEarned: BigInt(scoring?.consensusRewardsEarned || 0),
    consensusRewardsMissed: BigInt(scoring?.consensusRewardsMissed || 0),
    executionMevEarned: BigInt(scoring?.executionMevEarned || 0),
    executionMevMissed: BigInt(scoring?.executionMevMissed || 0),
  })
}


export default modifyScoring
