import { BigDecimal } from '../../../../utils'
import { OsTokenSnapshotsQueryPayload } from '../../../../graphql/subgraph/osToken'


type CalculateApyInput = {
  osTokenSnapshots: OsTokenSnapshotsQueryPayload['osTokenSnapshots']
}

const secondsInYear = 31536000
const oneEth = 1000000000000000000n

const calculateAPY = (input: CalculateApyInput) => {
  const { osTokenSnapshots } = input

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
    .multiply(secondsInYear)
    .divide(oneEth)
    .multiply(100)
    .toString()

  return {
    apy,
    averageRewardsPerSecond: rewardPerSecond,
  }
}


export default calculateAPY
