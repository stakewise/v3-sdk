import { constants, BigDecimal } from 'helpers'
import { OsTokenSnapshotsQueryPayload } from 'graphql/subgraph/osTokenSnapshots'


type CalculateApyInput = {
  osTokenSnapshots: OsTokenSnapshotsQueryPayload['osTokenSnapshots']
}

const calculateAPY = (values: CalculateApyInput) => {
  const { osTokenSnapshots } = values

  let rewardPerSecond = 0n

  const count = BigInt(osTokenSnapshots.length || 0)

  if (count) {
    const sum = osTokenSnapshots.reduce(
      (acc, { avgRewardPerSecond }) => acc + BigInt(avgRewardPerSecond),
      0n
    )

    rewardPerSecond =  sum / count
  }

  const apy = new BigDecimal(rewardPerSecond)
    .multiply(constants.secondsInYear)
    .divide(constants.amount1)
    .multiply(100)
    .toString()

  return {
    apy,
    averageRewardsPerSecond: rewardPerSecond,
  }
}


export default calculateAPY
