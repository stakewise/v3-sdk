type Input = {
  proof: string[]
  reward: string
  rewardsRoot: string
  unlockedMevReward: string
}

const getDefaultHarvestParams = (values: Input) => ({
  proof: values.proof || [],
  reward: values.reward || '0',
  rewardsRoot: values.rewardsRoot || '0x0000000000000000000000000000000000000000000000000000000000000000',
  unlockedMevReward: values.unlockedMevReward || '0',
})


export default getDefaultHarvestParams
