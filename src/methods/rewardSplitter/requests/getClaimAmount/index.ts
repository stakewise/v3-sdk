import { validateArgs } from '../../../../utils'
import { wrapAbortPromise } from '../../../../modules/gql-module'

import getShares from './getShares'
import getAssetsFromShares from './getAssetsFromShares'


type GetClaimAmountInput = {
  vaultAddress: string
  userAddress: string
  rewardSplitterAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getClaimAmount = async (input: GetClaimAmountInput) => {
  const { vaultAddress, userAddress, rewardSplitterAddress, options, contracts } = input

  validateArgs.address({ vaultAddress, userAddress, rewardSplitterAddress })

  const commonInput = { vaultAddress, userAddress, rewardSplitterAddress, options, contracts }
  const shares = await getShares({ ...commonInput, rewardSplitterAddress })

  if (shares) {
    return getAssetsFromShares({ ...commonInput, shares })
  }

  return 0n
}


export default wrapAbortPromise<GetClaimAmountInput, bigint>(getClaimAmount)
