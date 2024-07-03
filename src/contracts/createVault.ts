import type { Provider } from 'ethers'

import createContract from './createContract'
import { VaultAbi, GnosisVaultAbi } from './abis'


type Options = {
  isGnosis?: boolean
}

const createVault = (provider: Provider) => (address: string, options: Options = {}) => {
  const { isGnosis } = options

  if (isGnosis) {
    return createContract<StakeWise.ABI.Vault>(address, GnosisVaultAbi, provider)
  }

  return createContract<StakeWise.ABI.Vault>(address, VaultAbi, provider)
}


export default createVault
