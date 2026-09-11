import getAnnualReward from './getAnnualReward'


type GetLeverageRewardInput = {
  vaultApy: number
  borrowApy: number
  mintedAssets: bigint
  osTokenMintApy: number
  borrowedAssets: bigint
  depositedAssets: bigint
}

const getLeverageReward = (values: GetLeverageRewardInput): bigint => {
  const { vaultApy, borrowApy, mintedAssets, osTokenMintApy, borrowedAssets, depositedAssets } = values

  let reward = getAnnualReward(depositedAssets, vaultApy)

  reward -= getAnnualReward(mintedAssets, osTokenMintApy)
  reward -= getAnnualReward(borrowedAssets, borrowApy)

  return reward
}


export default getLeverageReward
