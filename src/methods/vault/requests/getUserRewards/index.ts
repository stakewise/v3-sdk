import type { UserRewardsQueryVariables } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import modifyUserRewards from './modifyUserRewards'
import graphql from '../../../../graphql'
import { ModifyUserReward } from './types'


type GetUserRewardsInput = {
  options: StakeWise.Options
  userAddress: UserRewardsQueryVariables['user']
  vaultAddress: UserRewardsQueryVariables['vaultAddress']
  dateFrom: number
  dateTo?: number
}

const getUserRewards = async (input: GetUserRewardsInput) => {
  const { options, vaultAddress, userAddress, dateFrom, dateTo } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ dateFrom })

  if (dateTo) {
    validateArgs.number({ dateTo })
  }

  const data = await graphql.backend.vault.fetchUserRewardsQuery<ModifyUserReward>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      vaultAddress: vaultAddress.toLowerCase(),
      user: userAddress.toLowerCase(),
      dateFrom: String(dateFrom),
      dateTo: dateTo ? String(dateTo) : null,
    } as UserRewardsQueryVariables,
    modifyResult: modifyUserRewards,
  })

  return data?.days || []
}


export default getUserRewards
