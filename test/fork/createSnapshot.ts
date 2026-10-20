import type { ForkSnapshot } from './snapshots'


type SnapshotVault = ForkSnapshot['harvestParams'] & {
  id: string
}

export type SnapshotResponse = {
  _meta: { block: { number: number } }
  vaults: SnapshotVault[]
}

const createSnapshot = ({ _meta, vaults }: SnapshotResponse): ForkSnapshot => {
  const { number: block } = _meta.block
  const [ vault ] = vaults

  if (!vault) {
    throw new Error(`No vault found at block ${block}`)
  }

  const { id, proof, canHarvest, rewardsRoot, isMetaVault, reward, unlockedMevReward } = vault

  if (!canHarvest) {
    throw new Error(`${id} cannot harvest at block ${block}, retry later or pass another vault`)
  }

  return {
    block,
    vaultAddress: id,
    harvestParams: {
      proof,
      canHarvest,
      rewardsRoot,
      isMetaVault,
      reward,
      unlockedMevReward,
    },
  }
}


export default createSnapshot
