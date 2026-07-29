import getMintedBalance from '../../../osToken/requests/getBalance'
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

  if (typeof shares !== 'undefined') {
    const [ mint, walletShares, { exitQueueShares } ] = await Promise.all([
      getMintedBalance(values),
      contracts.tokens.mintToken.balanceOf(userAddress),
      getUnstakeAmountForBurn({ ...values, shares }),
    ])

    const maxBurnShares = walletShares < mint.shares ? walletShares : mint.shares

    if (shares > maxBurnShares) {
      throw new Error(`The "shares" argument must be at most ${maxBurnShares}`)
    }

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

  const burnShares = await getBurnAmountForUnstake(values)

  const [ { exitQueueShares: unlockedShares }, [ { shares: requestedShares } ] ] = await Promise.all([
    getUnstakeAmountForBurn({ ...values, shares: burnShares }),
    vaultMulticall<[ { shares: bigint } ]>({
      ...baseMulticallArgs,
      request: {
        params: [ { method: 'convertToShares', args: [ assets ] } ],
        callStatic: true,
      },
    }),
  ])

  const exitShares = requestedShares < unlockedShares ? requestedShares : unlockedShares

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
