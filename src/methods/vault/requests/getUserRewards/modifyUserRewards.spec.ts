import type { UserRewardsQueryPayload } from '../../../../graphql/backend/vault'
import modifyUserRewards, { modifyUserReward } from './modifyUserRewards'


describe('modifyUserReward and modifyUserRewards functions', () => {
  const sampleInput: UserRewardsQueryPayload = {
    userRewards: [
      {
        date: '1694908800',
        sumRewards: '344379922475148628745',
        dailyRewards: '344379922475148628745',
        dailyRewardsEur: '0.10',
        dailyRewardsGbp: '0.09',
        dailyRewardsUsd: '0.11',
      },
      {
        date: '1694995200',
        sumRewards: '344382187878289278175',
        dailyRewards: '0',
        dailyRewardsEur: '0.10',
        dailyRewardsGbp: '0.09',
        dailyRewardsUsd: '0.11',
      },
    ],
  }

  it('should correctly modify a single reward', () => {
    const userReward = sampleInput.userRewards[0]

    const result = modifyUserReward(userReward)

    expect(result).toEqual({
      date: 1694908800,
      sumRewards: 344.37992247514865,
      dailyRewards: 344.37992247514865,
      dailyRewardsEur: 0.10,
      dailyRewardsGbp: 0.09,
      dailyRewardsUsd: 0.11,
    })
  })

  it('should correctly modify multiple rewards', () => {
    const expectedResult = {
      1694908800: {
        date: 1694908800,
        sumRewards: 344.37992247514865,
        dailyRewards: 344.37992247514865,
        dailyRewardsEur: 0.10,
        dailyRewardsGbp: 0.09,
        dailyRewardsUsd: 0.11,
      },
      1694995200: {
        date: 1694995200,
        sumRewards: 344.3821878782893,
        dailyRewards: 0,
        dailyRewardsEur: 0.10,
        dailyRewardsGbp: 0.09,
        dailyRewardsUsd: 0.11,
      },
    }

    const result = modifyUserRewards(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
