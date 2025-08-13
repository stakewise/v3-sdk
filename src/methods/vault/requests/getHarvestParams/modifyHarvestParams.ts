import { HarvestParamsQueryPayload } from '../../../../graphql/subgraph/vault'


const modifyHarvestParams = (data: HarvestParamsQueryPayload) => {
  const { canHarvest, ...params } = data.harvestParams || {} as HarvestParamsQueryPayload['harvestParams']

  return {
    canHarvest,
    params: {
      proof: params.proof || [],
      reward: params.reward || '0',
      rewardsRoot: params.rewardsRoot,
      unlockedMevReward: params.unlockedMevReward || '0',
    },
  }
}


export default modifyHarvestParams
