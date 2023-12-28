import { formatEther } from 'ethers'

import type { ScoringQueryPayload } from '../../../../graphql/backend/vault'
import { ModifiedScoring } from './types'


const modifyScoring = (input: ScoringQueryPayload): ModifiedScoring => {
  const { vaults } = input

  const { consensusRewardsEarned, consensusRewardsMissed, executionMevEarned,  executionMevMissed } = vaults[0].scoring

  return ({
    consensusRewardsEarned: formatEther(String(consensusRewardsEarned || '0')),
    consensusRewardsMissed: formatEther(String(consensusRewardsMissed || '0')),
    executionMevEarned: formatEther(String(executionMevEarned || '0')),
    executionMevMissed: formatEther(String(executionMevMissed || '0')),
  })
}


export default modifyScoring
