import { formatEther } from 'ethers'

import type { ModifiedValidators } from './types'
import { Network, configs } from '../../../../utils'
import type { VaultValidatorsQueryPayload } from '../../../../graphql/backend/vault'


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
      publicKey,
      apy: Number(apy).toFixed(2),
      createdAt: new Date(createdAt).getTime(),
      earned: formatEther(String(earned || 0)),
      link: `${configs[network].pages.beaconchain}/validator/${publicKey}`,
    }
  })
}


export default modifyValidators
