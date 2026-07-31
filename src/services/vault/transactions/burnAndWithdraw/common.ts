import getMaxExitShares from '../../helpers/getMaxExitShares'
import getBurnAmountForUnstake from '../../../osToken/helpers/getBurnAmountForUnstake'
import getUnstakeAmountForBurn from '../../../osToken/helpers/getUnstakeAmountForBurn'
import { vaultMulticall, VaultMulticallBaseInput } from '../../../../contracts'

import { validate } from './validate'
import type { BurnAndWithdrawInput } from './types'


type GetParamsInput = {
  userAddress: string
  burnShares: bigint
  exitShares: bigint
}

const getParams = (values: GetParamsInput): Parameters<typeof vaultMulticall>[0]['request']['params'] => {
  const { userAddress, burnShares, exitShares } = values

  if (!exitShares) {
    throw new Error('Nothing can be withdrawn without breaking the osToken position LTV')
  }

  const burnParams = burnShares > 0n
    ? [ { method: 'burnOsToken' as const, args: [ burnShares ] } ]
    : []

  return [
    ...burnParams,
    { method: 'enterExitQueue', args: [ exitShares, userAddress ] },
  ]
}

export const commonLogic = async (values: BurnAndWithdrawInput) => {
  const { contracts } = values

  const { vaultAddress, userAddress, assets, shares } = validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const baseMulticallArgs: VaultMulticallBaseInput = {
    vaultContract,
    ...values,
  }

  const [ walletShares, osTokenShares ] = await Promise.all([
    contracts.tokens.mintToken.balanceOf(userAddress),
    vaultContract.osTokenPositions(userAddress),
  ])

  const maxBurnShares = walletShares < osTokenShares ? walletShares : osTokenShares

  if (typeof shares !== 'undefined') {
    if (shares > maxBurnShares) {
      throw new Error(`The "shares" argument must be at most ${maxBurnShares}`)
    }

    const { exitQueueShares } = await getUnstakeAmountForBurn({ ...values, shares })

    const params = getParams({
      userAddress,
      burnShares: shares,
      exitShares: exitQueueShares,
    })

    return {
      ...baseMulticallArgs,
      request: {
        params,
      },
    }
  }

  const requiredBurnShares = await getBurnAmountForUnstake(values)

  const burnShares = requiredBurnShares < maxBurnShares ? requiredBurnShares : maxBurnShares

  const [ maxExitShares, [ { shares: requestedShares } ] ] = await Promise.all([
    getMaxExitShares({ ...values, userAddress, vaultAddress, burnShares }),
    vaultMulticall<[ { shares: bigint } ]>({
      ...baseMulticallArgs,
      request: {
        params: [ { method: 'convertToShares', args: [ assets ] } ],
        callStatic: true,
      },
    }),
  ])

  const exitShares = requestedShares < maxExitShares ? requestedShares : maxExitShares

  const params = getParams({
    userAddress,
    burnShares,
    exitShares,
  })

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
