import type { UserExchangeRewardsQueryPayload } from '../../../../graphql/subgraph/vault'
import modifyUserExchangeRewards from './modifyUserExchangeRewards'
import { formatEther } from 'ethers'


describe('modifyUserExchangeRewards and modifyUserExchangeRewards functions', () => {
  const sampleInput: UserExchangeRewardsQueryPayload = {
    allocator: [
      {
        timestamp: '1727136000000000',
        earnedAssets: '27734011365427',
      },
      {
        timestamp: '1727049600000000',
        earnedAssets: '31538735933515',
      },
    ],
    exchangeRate: [
      {
        timestamp: '1727136000000000',
        assetsUsdRate: '2668.52572642',
        usdToEurRate: '0.8938307799567385902500938522318955',
        usdToGbpRate: '0.7452231198020687393805705428205205',
      },
      {
        timestamp: '1727049600000000',
        assetsUsdRate: '2648.01679703',
        usdToEurRate: '0.8993614533681086428635668675240579',
        usdToGbpRate: '0.7486430844095077671720007486430844',
      },
    ],
  }

  it('should correctly modify multiple rewards', () => {
    const expectedResult = [
      {
        date: 1727049600,
        dailyRewards: Number(formatEther('31538735933515')),
        dailyRewardsUsd: 0.08351510250904134,
        dailyRewardsEur: 0.075110263970718,
        dailyRewardsGbp: 0.06252300393714494,
      },
      {
        date: 1727136000,
        dailyRewards: Number(formatEther('27734011365427')),
        dailyRewardsUsd: 0.07400892282546662,
        dailyRewardsEur: 0.0661514532128449,
        dailyRewardsGbp: 0.05515316036118477,
      },
    ]

    const result = modifyUserExchangeRewards([])(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
