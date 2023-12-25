import { formatEther } from 'ethers'

import { ModifiedVaultSnapshots } from './types'
import type { VaultSnapshotsQueryPayload } from '../../../../graphql/backend/vault'


export const modifyVaultSnapshot = (vaultSnapshot: Omit<VaultSnapshotsQueryPayload['vaultSnapshots'][number], 'date'>) => {
  const apyValue = Number(vaultSnapshot.rewardPerAsset) || 0
  const tvlValue = String(vaultSnapshot.totalAssets) || '0'

  return {
    APY: apyValue,
    TVL: Number(formatEther(tvlValue)),
  }
}

const modifyVaultSnapshots = (input: VaultSnapshotsQueryPayload): ModifiedVaultSnapshots => {
  const days = input.vaultSnapshots.reduce((acc, { date, ...rest }) => {
    acc[Number(date)] = modifyVaultSnapshot(rest)

    return acc
  }, {} as ModifiedVaultSnapshots['days'])

  const first = input.firstSnapshots[0]
    ? modifyVaultSnapshot(input.firstSnapshots[0])
    : null

  return {
    days,
    first,
  }
}


export default modifyVaultSnapshots
