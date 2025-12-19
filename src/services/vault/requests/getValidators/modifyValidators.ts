import { formatEther } from 'ethers'

import type { ModifiedValidators } from './types'
import { Network, configs } from '../../../../helpers'
import type { ValidatorsQueryPayload } from '../../../../graphql/backend/vault'


type ModifyValidatorsInput = {
  data: ValidatorsQueryPayload
  network: Network
}

const modifyValidators = (input: ModifyValidatorsInput): ModifiedValidators => {
  const { data, network } = input
  const validators = data?.vaultValidators || []

  return validators.map((validator) => {
    const { apy, createdAt, income, publicKey } = validator

    return {
      publicKey,
      apy: Number(apy).toFixed(2),
      earned: formatEther(income),
      createdAt: new Date(createdAt).getTime(),
      link: `${configs[network].pages.beaconchain}/validator/${publicKey}`,
    }
  })
}


export default modifyValidators
