import { UserRewardsQueryVariables } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import modifyUserRewards from './modifyUserRewards'
import { backend } from '../../../../graphql'
import { ModifyUserReward } from './types'


type GetUserRewardsInput = {
  options: StakeWise.Options
  userAddress: UserRewardsQueryVariables['user']
  vaultAddress: UserRewardsQueryVariables['vaultAddress']
  dateFrom: UserRewardsQueryVariables['dateFrom']
}

const getUserRewards = async (input: GetUserRewardsInput) => {
  const { options, vaultAddress, userAddress, dateFrom } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.string({ dateFrom })

  const data = await backend.vault.fetchUserRewardsQuery<ModifyUserReward>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      vaultAddress: vaultAddress.toLowerCase(),
      user: userAddress.toLowerCase(),
      dateFrom,
    } as UserRewardsQueryVariables,
    modifyResult: modifyUserRewards,
  })

  return data
}


export default getUserRewards
