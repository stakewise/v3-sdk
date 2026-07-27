import getHarvestParams from '../../requests/getHarvestParams'
import getMintedBalance from '../../../osToken/requests/getBalance'
import getMaxWithdrawAmount from '../../requests/getMaxWithdrawAmount'
import getBurnAmountForUnstake from '../../../osToken/helpers/getBurnAmountForUnstake'
import { vaultMulticall, VaultMulticallBaseInput } from '../../../../contracts'

import { validate } from './validate'
import { normalizeBurnShares } from './helpers'
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
    const [ harvest, mint, walletShares ] = await Promise.all([
      getHarvestParams(values),
      getMintedBalance(values),
      contracts.tokens.mintToken.balanceOf(userAddress),
    ])

    const maxBurnShares = walletShares < mint.shares ? walletShares : mint.shares

    if (shares > maxBurnShares) {
      throw new Error(`The "shares" argument must be at most ${maxBurnShares}`)
    }

    const { exitQueueShares, burnOsTokenShares } = await contracts.special.stakeCalculator.calculateUnstake.staticCall({
      user: userAddress,
      vault: vaultAddress,
      harvestParams: harvest.params,
      osTokenShares: shares,
    })

    const normalizedBurnShares = await normalizeBurnShares({
      ...values,
      exitShares: exitQueueShares,
      burnOsTokenShares,
    })

    const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
      { method: 'burnOsToken', args: [ normalizedBurnShares ] },
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

  const normalizedBurnShares = await normalizeBurnShares({
    ...values,
    exitShares,
    burnOsTokenShares,
  })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    { method: 'burnOsToken', args: [ normalizedBurnShares ] },
    { method: 'enterExitQueue', args: [ exitShares, userAddress ] },
  ]

  return {
    ...baseMulticallArgs,
    request: { params },
  }
}
