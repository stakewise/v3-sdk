import { validate } from './validate'
import type { ClaimInput } from './types'


export const commonLogic = async (values: ClaimInput) => {
  const { provider, contracts } = values
  const { userAddress, proof, tokens, cumulativeAmounts } = validate(values)

  const signer = await provider.getSigner(userAddress)

  return {
    merkleDistributorV2: contracts.special.merkleDistributorV2.connect(signer),
    params: [ userAddress, tokens, cumulativeAmounts, proof ] as Parameters<typeof contracts.special.merkleDistributorV2.claim>,
  }
}
