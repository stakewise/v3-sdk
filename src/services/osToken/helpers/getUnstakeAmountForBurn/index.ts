import { wrapAbortPromise } from '../../../../modules/gql-module'
import getHarvestParams from '../../../vault/requests/getHarvestParams'

import { validate } from './validate'


export type GetUnstakeAmountForBurnInput = StakeWise.BaseInput & {
  shares: bigint
}

type Output = {
  receivedAssets: bigint
  exitQueueShares: bigint
}

// The vault floors every conversion on its LTV check, the buffer adds 3 wei to fix that
const ltvCheckBuffer = 3n

const getUnstakeAmountForBurn = async (values: GetUnstakeAmountForBurnInput): Promise<Output> => {
  const { contracts } = values

  const { userAddress, vaultAddress, shares } = validate(values)

  const harvest = await getHarvestParams(values)

  const { exitQueueShares, receivedAssets } = await contracts.special.stakeCalculator.calculateUnstake.staticCall({
    user: userAddress,
    vault: vaultAddress,
    osTokenShares: shares,
    harvestParams: harvest.params,
  })

  if (exitQueueShares <= ltvCheckBuffer) {
    return {
      receivedAssets: 0n,
      exitQueueShares: 0n,
    }
  }

  return {
    receivedAssets,
    exitQueueShares: exitQueueShares - ltvCheckBuffer,
  }
}


export default wrapAbortPromise<GetUnstakeAmountForBurnInput, Output>(getUnstakeAmountForBurn)
