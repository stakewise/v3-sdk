import type { ScorePercentilesQueryPayload } from '../../../../graphql/backend/vault'
import modifyScorePercentiles from './modifyScorePercentiles'


describe('modifyScorePercentiles functions', () => {
  const sampleInput: ScorePercentilesQueryPayload = {
    scorePercentiles: {
      percentile25: '95.00',
      percentile50: '97.00',
      percentile75: '98.00',
    },
  }

  it('should correctly modify a score percentiles', () => {
    const result = modifyScorePercentiles(sampleInput)

    expect(result).toEqual({
      percentile25: 95.00,
      percentile50: 97.00,
      percentile75: 98.00,
    })
  })
})
