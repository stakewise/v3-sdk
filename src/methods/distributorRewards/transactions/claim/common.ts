import { validateArgs } from '../../../../utils'
import type { ClaimInput } from './types'


export const commonLogic = async (values: ClaimInput) => {
  const { userAddress, proof, tokens, cumulativeAmounts, provider, contracts } = values

  validateArgs.address({ userAddress })
  validateArgs.array({ proof, tokens, cumulativeAmounts }, true)

  Object.keys({ proof, tokens, cumulativeAmounts }).forEach((key) => {
    const array = values[key]

    array.forEach((string) => {
      if (typeof string !== 'string') {
        throw new Error(`The "${key}" argument must be an array of strings`)
      }
    })
  })

  const signer = await provider.getSigner(userAddress)

  return {
    merkleDistributorV2: contracts.special.merkleDistributorV2.connect(signer),
    params: [ userAddress, tokens, cumulativeAmounts, proof ],
  }
}
