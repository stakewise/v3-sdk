import type { UserRewardsQueryPayload } from '../../../../graphql/backend/vault'
import modifyUserRewards, { modifyUserReward } from './modifyUserRewards'


describe('modifyUserReward and modifyUserRewards functions', () => {
  const sampleInput: UserRewardsQueryPayload = {
    userRewards: [
      {
        date: '1694908800',
        sumRewards: '344379922475148628745',
        dailyRewards: '344379922475148628745',
      },
      {
        date: '1694995200',
        sumRewards: '344382187878289278175',
        dailyRewards: '0',
      },
    ],
  }

  it('should correctly modify a single reward', () => {
    const userReward = sampleInput.userRewards[0]

    const result = modifyUserReward(userReward)

    expect(result).toEqual({
      sumRewards: 344.37992247514865,
      dailyRewards: 344.37992247514865,
    })
  })

  it('should correctly modify multiple rewards', () => {
    const expectedResult = {
      days: {
        1694908800: {
          sumRewards: 344.37992247514865,
          dailyRewards: 344.37992247514865,
        },
        1694995200: {
          sumRewards: 344.3821878782893,
          dailyRewards: 0,
        },
      },
    }

    const result = modifyUserRewards(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
