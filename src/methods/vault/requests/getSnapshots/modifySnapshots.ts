import { formatEther } from 'ethers'

import { ModifiedSnapshots } from './types'
import type { SnapshotsQueryPayload } from '../../../../graphql/backend/vault'


export const modifySnapshot = (vaultSnapshot: Omit<SnapshotsQueryPayload['vaultSnapshots'][number], 'date'>) => {
  const apyValue = Number(vaultSnapshot.weeklyApy) || 0
  const tvlValue = vaultSnapshot.totalAssets || '0'

  return {
    APY: apyValue,
    TVL: Number(formatEther(tvlValue)),
  }
}

const modifySnapshots = (input: SnapshotsQueryPayload): ModifiedSnapshots => {
  const days = input.vaultSnapshots.reduce((acc, { date, ...rest }) => {
    acc[Number(date)] = modifySnapshot(rest)

    return acc
  }, {} as ModifiedSnapshots['days'])

  const first = input.firstSnapshots[0]
    ? modifySnapshot(input.firstSnapshots[0])
    : null

  return {
    days,
    first,
  }
}


export default modifySnapshots
