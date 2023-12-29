import type { ScoringQueryPayload } from '../../../../graphql/backend/vault'
import modifyScoring from './modifyScoring'


describe('modifyScoring functions', () => {
  const sampleInput: ScoringQueryPayload = {
    vaults: [
      {
        scoring: {
          consensusRewardsEarned: '89163004',
          consensusRewardsMissed: '478650',
          executionMevEarned: '21005814693398160',
          executionMevMissed: '0',
        },
      },
    ],
  }

  it('should correctly modify a single vault snapshot', () => {
    const result = modifyScoring(sampleInput)

    expect(result).toEqual({
      consensusRewardsEarned: 89163004n,
      consensusRewardsMissed: 478650n,
      executionMevEarned: 21005814693398160n,
      executionMevMissed: 0n,
    })
  })
})
