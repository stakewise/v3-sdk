import { config, Network } from 'helpers'
import { JsonRpcProvider } from 'ethers'

import createContract from './createContract'

import {
  VaultAbi,
  KeeperAbi,
} from './abis'

import type {
  VaultAbi as VaultType,
  KeeperAbi as KeeperType,
} from './types'


type Config = typeof config
type Library = JsonRpcProvider

const getKeeper = (library: Library, config: Config[Network]) => createContract<KeeperType>(
  config.addresses.base.keeper,
  KeeperAbi,
  library
)

const getVault = (library: Library, address: string) => createContract<VaultType>(address, VaultAbi, library)

export const createContracts = (library: Library, network: Network) => {
  return {
    helpers: {
      getVault: (address: string) => getVault(library, address),
    },
    base: {
      keeper: getKeeper(library, config[network]),
    },
  }
}


export default createContracts
