import type { ScoringQueryPayload } from '../../../../graphql/backend/vault'
import { ModifiedScoring } from './types'


const modifyScoring = (input: ScoringQueryPayload): ModifiedScoring => {
  const { vaults } = input

  const { consensusRewardsEarned, consensusRewardsMissed, executionMevEarned,  executionMevMissed } = vaults[0].scoring

  return ({
    consensusRewardsEarned: BigInt(consensusRewardsEarned),
    consensusRewardsMissed: BigInt(consensusRewardsMissed),
    executionMevEarned: BigInt(executionMevEarned),
    executionMevMissed: BigInt(executionMevMissed),
  })
}


export default modifyScoring
