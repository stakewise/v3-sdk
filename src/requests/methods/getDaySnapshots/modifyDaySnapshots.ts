import { formatEther } from 'ethers'
import { DaySnapshotsQueryPayload } from 'graphql/subgraph/daySnapshots'

import { ModifiedDaySnapshots } from './types'


export const modifyDaySnapshot = (daySnapshot: DaySnapshotsQueryPayload['daySnapshots'][number]) => {
  const apyValue = Number(daySnapshot.rewardPerAsset) || 0
  const tvlValue = daySnapshot.totalAssets || '0'

  return {
    APY: apyValue * 365 * 100,
    TVL: formatEther(tvlValue),
  }
}

const modifyDaySnapshots = (input: DaySnapshotsQueryPayload): ModifiedDaySnapshots => {
  const days = input.daySnapshots.map(modifyDaySnapshot)

  const first = input.firstSnapshots[0]
    ? modifyDaySnapshot(input.firstSnapshots[0])
    : null

  return {
    days,
    first,
  }
}


export default modifyDaySnapshots
