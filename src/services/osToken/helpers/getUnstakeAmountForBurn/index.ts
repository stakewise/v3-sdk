import { vaultMulticall } from '../../../../contracts'
import { constants, divideRoundingUp } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getOsTokenConfig from '../../../vault/requests/getOsTokenConfig'

import { validate } from './validate'


export type GetUnstakeAmountForBurnInput = StakeWise.BaseInput & {
  shares: bigint
}

type Output = {
  receivedAssets: bigint
  exitQueueShares: bigint
}

const secondsInHour = 60n * 60n

const getUnstakeAmountForBurn = async (values: GetUnstakeAmountForBurnInput): Promise<Output> => {
  const { contracts } = values

  const { userAddress, vaultAddress, shares } = validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const multicallArgs = { ...values, userAddress, vaultAddress, vaultContract }

  const [ config, stakeShares, osTokenShares, avgRewardPerSecond ] = await Promise.all([
    getOsTokenConfig(values),
    vaultContract.getShares(userAddress),
    vaultContract.osTokenPositions(userAddress),
    contracts.base.mintTokenController.avgRewardPerSecond(),
  ])

  const ltvPercent = BigInt(config.ltvPercent)

  if (ltvPercent <= 0n) {
    return {
      receivedAssets: 0n,
      exitQueueShares: 0n,
    }
  }

  const debtShares = osTokenShares > shares ? osTokenShares - shares : 0n

  const [ burnedAssets, debtAssets ] = await Promise.all([
    contracts.base.mintTokenController.convertToAssets(shares),
    contracts.base.mintTokenController.convertToAssets(debtShares),
  ])

  const bufferedMaxPercent = constants.blockchain.amount1 + avgRewardPerSecond * secondsInHour
  const freedAssets = burnedAssets * constants.blockchain.amount1 / ltvPercent

  // The vault rounds down when it checks the position so we add 1n back
  const debtAssetsRoundedUp = debtShares > 0n ? debtAssets + 1n : 0n
  const lockedAssets = divideRoundingUp(debtAssetsRoundedUp * bufferedMaxPercent, ltvPercent)

  const [
    { shares: freedShares },
    { shares: lockedShares },
  ] = await vaultMulticall<[
    { shares: bigint },
    { shares: bigint },
  ]>({
    ...multicallArgs,
    request: {
      params: [
        { method: 'convertToShares', args: [ freedAssets ] },
        { method: 'convertToShares', args: [ lockedAssets ] },
      ],
      callStatic: true,
    },
  })

  const lockedSharesRoundedUp = lockedAssets > 0n ? lockedShares + 1n : 0n
  const maxExitShares = stakeShares > lockedSharesRoundedUp ? stakeShares - lockedSharesRoundedUp : 0n
  const cappedExitShares = freedShares < maxExitShares ? freedShares : maxExitShares
  const exitQueueShares = debtShares > 0n ? cappedExitShares : maxExitShares

  const [ { assets: receivedAssets } ] = await vaultMulticall<[ { assets: bigint } ]>({
    ...multicallArgs,
    request: {
      params: [ { method: 'convertToAssets', args: [ exitQueueShares ] } ],
      callStatic: true,
    },
  })

  return {
    receivedAssets,
    exitQueueShares,
  }
}


export default wrapAbortPromise<GetUnstakeAmountForBurnInput, Output>(getUnstakeAmountForBurn)
