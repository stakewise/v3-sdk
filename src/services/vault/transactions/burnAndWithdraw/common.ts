import getHarvestParams from '../../requests/getHarvestParams'
import getMaxWithdrawAmount from '../../requests/getMaxWithdrawAmount'
import getBurnAmountForUnstake from '../../../osToken/helpers/getBurnAmountForUnstake'
import { vaultMulticall, VaultMulticallBaseInput } from '../../../../contracts'

import { validate } from './validate'
import { getSafeBurnOsTokenShares } from './helpers'
import type { BurnAndWithdrawInput } from './types'


export const commonLogic = async (values: BurnAndWithdrawInput) => {
  const { contracts } = values

  const { vaultAddress, userAddress, shares } = validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const baseMulticallArgs: VaultMulticallBaseInput = {
    vaultContract,
    ...values,
  }

  if (typeof shares !== 'undefined') {
    const harvest = await getHarvestParams(values)

    const { exitQueueShares, burnOsTokenShares } = await contracts.special.stakeCalculator.calculateUnstake.staticCall({
      user: userAddress,
      vault: vaultAddress,
      harvestParams: harvest.params,
      osTokenShares: shares,
    })

    const safeBurnOsTokenShares = await getSafeBurnOsTokenShares({
      ...values,
      exitShares: exitQueueShares,
      burnOsTokenShares,
    })

    const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
      { method: 'burnOsToken', args: [ safeBurnOsTokenShares ] },
      { method: 'enterExitQueue', args: [ exitQueueShares, userAddress ] },
    ]

    return {
      ...baseMulticallArgs,
      request: { params },
    }
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

  const safeBurnOsTokenShares = await getSafeBurnOsTokenShares({
    ...values,
    exitShares,
    burnOsTokenShares,
  })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    { method: 'burnOsToken', args: [ safeBurnOsTokenShares ] },
    { method: 'enterExitQueue', args: [ exitShares, userAddress ] },
  ]

  return {
    ...baseMulticallArgs,
    request: { params },
  }
}
