import { ZeroAddress } from 'ethers'

import { validate } from '../validate'
import type { DepositInput } from '../types'
import { vaultMulticall } from '../../../../../contracts'
import type { VaultMulticallBaseInput } from '../../../../../contracts'


export const commonLogic = (values: DepositInput) => {
  const { options, contracts, vaultAddress, userAddress, referrerAddress = ZeroAddress, assets } = values

  validate(values)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'deposit',
      args: [ assets, userAddress, referrerAddress ],
    },
  ]

  const vaultContract = contracts.helpers.createVault({
    options: { chainId: options.network },
    vaultAddress,
  })

  const baseInput: VaultMulticallBaseInput = {
    vaultContract,
    ...values,
  }

  return {
    ...baseInput,
    request: { params },
  }
}
