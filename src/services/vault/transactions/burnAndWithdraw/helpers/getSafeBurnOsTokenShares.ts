import { constants } from '../../../../../helpers'
import getOsTokenConfig from '../../../requests/getOsTokenConfig'

import type { BurnAndWithdrawInput } from '../types'


type Input = BurnAndWithdrawInput & {
  exitShares: bigint
  burnOsTokenShares: bigint
}

const secondsInHour = 60n * 60n

// calculateUnstake can leave the burn a couple wei short of the vault's exact LTV check
// (VaultOsToken._checkOsTokenPosition), reverting LowLtv at max LTV. Raise it to the exact minimum the check
// needs, plus one hour of debt accrual so it still holds once the tx lands
const getSafeBurnOsTokenShares = async (values: Input): Promise<bigint> => {
  const { contracts, vaultAddress, userAddress, exitShares, burnOsTokenShares } = values

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const [ config, stakeShares, osTokenShares, avgRewardPerSecond ] = await Promise.all([
    getOsTokenConfig(values),
    vaultContract.getShares(userAddress),
    vaultContract.osTokenPositions(userAddress),
    contracts.base.mintTokenController.avgRewardPerSecond(),
  ])

  const remainingStakeShares = stakeShares > exitShares ? stakeShares - exitShares : 0n
  const remainingStakeAssets = await vaultContract.convertToAssets(remainingStakeShares)

  const bufferedMaxPercent = constants.blockchain.amount1 + avgRewardPerSecond * secondsInHour
  const maxOsTokenAssets = remainingStakeAssets * BigInt(config.ltvPercent) / bufferedMaxPercent
  const maxOsTokenShares = await contracts.base.mintTokenController.convertToShares(maxOsTokenAssets)

  const requiredBurnShares = osTokenShares > maxOsTokenShares ? osTokenShares - maxOsTokenShares : 0n

  return burnOsTokenShares > requiredBurnShares ? burnOsTokenShares : requiredBurnShares
}


export default getSafeBurnOsTokenShares
