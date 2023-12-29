import type { ScoringQueryPayload } from '../../../../graphql/backend/vault'
import { ModifiedScoring } from './types'


const modifyScoring = (input: ScoringQueryPayload): ModifiedScoring => {
  const { vaults } = input

  const { consensusRewardsEarned, consensusRewardsMissed, executionMevEarned,  executionMevMissed } = vaults[0].scoring

  return ({
    consensusRewardsEarned: Number(consensusRewardsEarned),
    consensusRewardsMissed: Number(consensusRewardsMissed),
    executionMevEarned: Number(executionMevEarned),
    executionMevMissed: Number(executionMevMissed),
  })
}


export default modifyScoring
