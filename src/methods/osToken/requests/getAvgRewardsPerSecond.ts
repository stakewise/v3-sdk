import { apiUrls } from '../../../utils'
import graphql from '../../../graphql'


export type FetchOsTokenSnapshotsInput = {
  options: StakeWise.Options
}

const getAvgRewardsPerSecond = async (input: FetchOsTokenSnapshotsInput) => {
  const { options } = input

  const data = await graphql.subgraph.osToken.fetchOsTokenRewardPerSecondQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      first: 14,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    },
  })

  let rewardPerSecond = 0n

  const count = BigInt(data.osTokenSnapshots.length || 0)

  if (count) {
    const sum = data.osTokenSnapshots.reduce(
      (acc, { avgRewardPerSecond }) => acc + BigInt(avgRewardPerSecond),
      0n
    )

    rewardPerSecond =  sum / count
  }

  return rewardPerSecond
}


export default getAvgRewardsPerSecond
