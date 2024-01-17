import type { UserRewardsQueryVariables } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import modifyUserRewards from './modifyUserRewards'
import graphql from '../../../../graphql'
import { ModifyUserReward } from './types'


type GetUserRewardsInput = {
  options: StakeWise.Options
  userAddress: UserRewardsQueryVariables['user']
  vaultAddress: UserRewardsQueryVariables['vaultAddress']
  dateFrom: string
  dateTo?: string
  fillGaps?: boolean
}

const getUserRewards = async (input: GetUserRewardsInput) => {
  const { options, vaultAddress, userAddress, dateFrom, dateTo, fillGaps } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.string({ dateFrom })

  if (dateTo) {
    validateArgs.string({ dateTo })
  }

  const data = await graphql.backend.vault.fetchUserRewardsQuery<ModifyUserReward>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      dateTo,
      dateFrom,
      fillGaps,
      user: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    } as UserRewardsQueryVariables,
    modifyResult: modifyUserRewards,
  })

  return data?.days || []
}


export default getUserRewards
