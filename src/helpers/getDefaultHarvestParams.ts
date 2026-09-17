import { ZeroHash } from 'ethers'


type Input = {
  proof: string[]
  reward: string
  rewardsRoot: string
  unlockedMevReward: string
}

const getDefaultHarvestParams = (values: Input) => ({
  proof: values.proof || [],
  reward: values.reward || '0',
  rewardsRoot: values.rewardsRoot || ZeroHash,
  unlockedMevReward: values.unlockedMevReward || '0',
})


export default getDefaultHarvestParams
