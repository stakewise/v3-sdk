import { parseEther } from 'ethers'
import type { UnboostInput } from './types'
import { validateArgs } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'


export const commonLogic = (values: UnboostInput) => {
  const { contracts, options, percent, vaultAddress, userAddress } = values

  validateArgs.number({ percent })
  validateArgs.address({ vaultAddress, userAddress })

  const multicallArgs: Omit<Parameters<typeof boostMulticall>[0], 'request'> = {
    leverageStrategyContract: contracts.special.leverageStrategy,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof boostMulticall>[0]['request']['params'] = []

  params.push({
    method: 'enterExitQueue',
    args: [ vaultAddress, parseEther(String(percent / 100)) ],
  })

  return {
    ...multicallArgs,
    request: {
      params,
    },
  }
}
