import { validate } from '../validate'
import type { DepositAndMintInput } from '../types'
import { vaultMulticall } from '../../../../../contracts'
import type { VaultMulticallBaseInput } from '../../../../../contracts'


export const commonLogic = (values: DepositAndMintInput) => {
  const { contracts } = values

  const { vaultAddress, userAddress, referrerAddress, assets, receiveShares } = validate(values)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'deposit',
      args: [ assets, userAddress, referrerAddress ],
    },
    {
      method: 'mintOsToken',
      args: [ userAddress, receiveShares, referrerAddress ],
    },
  ]

  const vaultContract = contracts.helpers.createVault({
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
