import getHarvestParams from '../../requests/getHarvestParams'
import getMaxWithdrawAmount from '../../requests/getMaxWithdrawAmount'
import getBurnAmountForUnstake from '../../../osToken/helpers/getBurnAmountForUnstake'
import { vaultMulticall, VaultMulticallBaseInput } from '../../../../contracts'

import { validate } from './validate'
import type { BurnAndWithdrawInput } from './types'


export const commonLogic = async (values: BurnAndWithdrawInput) => {
  const { contracts } = values

  const { vaultAddress, userAddress } = validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const baseMulticallArgs: VaultMulticallBaseInput = {
    vaultContract,
    ...values,
  }

  const [ burnShares, maxWithdrawAssets, harvest ] = await Promise.all([
    getBurnAmountForUnstake(values),
    getMaxWithdrawAmount(values),
    getHarvestParams(values),
  ])

  const { exitQueueShares, burnOsTokenShares } = await contracts.special.stakeCalculator.calculateUnstake.staticCall({
    user: userAddress,
    vault: vaultAddress,
    harvestParams: harvest.params,
    osTokenShares: burnShares,
  })

  const [ { shares: baseShares } ] = await vaultMulticall<[ { shares: bigint } ]>({
    ...baseMulticallArgs,
    request: {
      params: [ { method: 'convertToShares', args: [ maxWithdrawAssets ] } ],
      callStatic: true,
    },
  })

  const exitShares = exitQueueShares + baseShares

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    { method: 'burnOsToken', args: [ burnOsTokenShares ] },
    { method: 'enterExitQueue', args: [ exitShares, userAddress ] },
  ]

  return {
    ...baseMulticallArgs,
    request: { params },
  }
}
