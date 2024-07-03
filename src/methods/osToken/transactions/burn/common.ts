import type { BurnInput } from './types'
import { validateArgs, Network } from '../../../../utils'


export const commonLogic = (values: BurnInput) => {
  const { contracts, options, vaultAddress, userAddress, shares } = values

  const isGnosis = (
    options.network === Network.Gnosis
    || options.network === Network.Chiado
  )

  validateArgs.bigint({ shares })
  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVault(vaultAddress, { isGnosis })

  return vaultContract
}
