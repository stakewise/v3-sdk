import { ethers } from 'ethers'
import type { UnlockInput } from './types'
import { validateArgs } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'


export const commonLogic = (values: UnlockInput) => {
  const { contracts, options, percent, vaultAddress, userAddress } = values

  validateArgs.number({ percent })
  validateArgs.address({ vaultAddress, userAddress })

  if (percent <= 0) {
    throw new Error(`The "percent" argument must be greater than 0`)
  }
  if (percent > 100) {
    throw new Error(`The "percent" argument must be less than or equal to 100`)
  }

  const multicallArgs: Omit<Parameters<typeof boostMulticall>[0], 'request'> = {
    leverageStrategyContract: contracts.special.leverageStrategy,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof boostMulticall>[0]['request']['params'] = []

  params.push({
    method: 'enterExitQueue',
    args: [ vaultAddress, ethers.parseEther(String(percent / 100)) ],
  })

  return {
    ...multicallArgs,
    request: {
      params,
    },
  }
}
