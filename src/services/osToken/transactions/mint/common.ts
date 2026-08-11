import { validate } from './validate'
import type { MintInput } from './types'
import { vaultMulticall } from '../../../../contracts'


export const commonLogic = (values: MintInput) => {
  const { contracts } = values
  const { shares, userAddress, vaultAddress, referrerAddress } = validate(values)

  const multicallArgs: Omit<Parameters<typeof vaultMulticall>[0], 'request'> = {
    vaultContract: contracts.helpers.createVault({ vaultAddress }),
    ...values,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'mintOsToken',
      args: [ userAddress, shares, referrerAddress ],
    },
  ]

  return {
    ...multicallArgs,
    request: {
      params,
    },
  }
}
