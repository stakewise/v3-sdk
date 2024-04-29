import { rewardSplitterMulticall } from '../../../../contracts'


type GetSharesInput = {
  vaultAddress: string
  userAddress: string
  rewardSplitterAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getShares = async (input: GetSharesInput) => {
  const { vaultAddress, userAddress, rewardSplitterAddress, options, contracts } = input

  const request = {
    params: [
      { method: 'syncRewards', args: [] },
      { method: 'rewardsOf', args: [ userAddress ] },
    ],
    callStatic: true,
  }

  const result = await rewardSplitterMulticall<[ [], [ bigint ] ]>({
    request,
    options,
    userAddress,
    vaultAddress,
    keeperContract: contracts.base.keeper,
    rewardSplitterContract: contracts.helpers.createRewardSplitter(rewardSplitterAddress),
  })

  return result?.[1]?.[0] || 0n
}


export default getShares
