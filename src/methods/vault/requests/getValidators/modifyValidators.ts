import { VaultValidatorsQueryPayload } from 'graphql/backend/vault'
import { Network, configs } from 'helpers'
import { formatEther } from 'ethers'

import type { ModifiedValidators } from './types'


type ModifyValidatorsInput = {
  data: VaultValidatorsQueryPayload
  network: Network
}

const modifyValidators = (input: ModifyValidatorsInput): ModifiedValidators => {
  const { data, network } = input
  const validators = data?.vaults?.[0]?.validators || []

  return validators.map((validator) => {
    const { apy, createdAt, earned, publicKey } = validator

    return {
      apy,
      publicKey,
      createdAt: new Date(createdAt).getTime(),
      earned: formatEther(String(earned || 0)),
      link: `${configs[network].pages.beaconchain}/validator/${publicKey}`,
    }
  })
}


export default modifyValidators
