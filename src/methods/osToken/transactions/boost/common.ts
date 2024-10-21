import type { BoostInput } from './types'
import { validateArgs } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'


export const commonLogic = (values: BoostInput) => {
  const { contracts, options, amount, vaultAddress, userAddress, boostAddress, permitParams } = values

  validateArgs.bigint({ amount })
  validateArgs.address({ vaultAddress, userAddress, boostAddress })

  if (permitParams) {
    validateArgs.object({ permitParams })

    const { vault, amount, deadline, v, r, s } = permitParams

    validateArgs.address({ 'permitParams.vault': vault })
    validateArgs.bigint({ 'permitParams.amount': amount })
    validateArgs.string({ 'permitParams.r': r, 'permitParams.s': s })
    validateArgs.number({ 'permitParams.v': v, 'permitParams.deadline': deadline })
  }

  const multicallArgs: Omit<Parameters<typeof boostMulticall>[0], 'request'> = {
    boostContract: contracts.helpers.createBoost(boostAddress),
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof boostMulticall>[0]['request']['params'] = []

  if (permitParams) {
    const { vault, amount, deadline, v, r, s } = permitParams

    params.push({
      method: 'permit',
      args: [
        vault,
        amount,
        deadline,
        v,
        r,
        s,
      ],
    })
  }

  params.push({
    method: 'deposit',
    args: [ vaultAddress, amount ],
  })

  return {
    ...multicallArgs,
    request: {
      params,
    },
  }
}
