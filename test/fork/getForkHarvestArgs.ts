import type { ForkSnapshot } from './snapshots'


const getForkHarvestArgs = ({ harvestParams }: ForkSnapshot) => {
  const { rewardsRoot, reward, unlockedMevReward, proof } = harvestParams

  return [ rewardsRoot, BigInt(reward), BigInt(unlockedMevReward), proof ]
}


export default getForkHarvestArgs
