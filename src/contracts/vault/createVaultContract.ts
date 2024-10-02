import type { Provider } from 'ethers'


import {
  GnosisVaultDiffAbi,
  OtherTokenVaultAbi,
  NativeTokenVaultAbi,
  PrivateVaultDiffAbi,
  GenesisVaultDiffAbi,
  BlocklistVaultDiffAbi,
  RestakingVaultDiffAbi,
} from './abis'

import {
  GnosisVaultDiffAbi as GnosisVaultDiffType,
  OtherTokenVaultAbi as OtherTokenVaultType,
  GenesisVaultDiffAbi as GenesisVaultDiffType,
  NativeTokenVaultAbi as NativeTokenVaultType,
  PrivateVaultDiffAbi as PrivateVaultDiffType,
  BlocklistVaultDiffAbi as BlocklistVaultDiffType,
  RestakingVaultDiffAbi as RestakingVaultDiffType,
} from './types'

import { Network } from '../../utils'
import createContract from '../createContract'
import { ModifiedVault } from '../../methods/vault/requests/getVault/types'


type Options = Partial<Pick<ModifiedVault, 'isBlocklist' | 'isPrivate' | 'isRestake' | 'isGenesis'>> & {
  chainId?: Network
}

type CreateContractsInput<T> = {
  vaultAddress: string
  options?: T
}

type Output<T extends Options> = Omit<
  (T['chainId'] extends Network.Chiado | Network.Gnosis
    ? OtherTokenVaultType & GnosisVaultDiffType
    : NativeTokenVaultType
  ) &
  (T['isBlocklist'] extends true
    ? BlocklistVaultDiffType
    : object
  ) &
  (T['isRestake'] extends true
    ? RestakingVaultDiffType
    : object
  ) &
  (T['isPrivate'] extends true
    ? PrivateVaultDiffType
    : object
  ) &
  (T['isGenesis'] extends true
    ? GenesisVaultDiffType
    : object
  ),
  'connect'
> & {
  // overwrite, since each abi returns itself
  connect: (signer: any) => Output<T>
}

const createVaultContract = (provider: Provider) => (
  <T extends Options>(input: CreateContractsInput<T>): Output<T> => {
    const { vaultAddress, options } = input

    const isGnosis = [
      Network.Chiado,
      Network.Gnosis,
    ].includes(options?.chainId || Network.Mainnet)

    let baseAbi = isGnosis
      ? OtherTokenVaultAbi.concat(GnosisVaultDiffAbi)
      : NativeTokenVaultAbi

    if (options?.isBlocklist) {
      baseAbi = baseAbi.concat(BlocklistVaultDiffAbi)
    }

    if (options?.isPrivate) {
      baseAbi = baseAbi.concat(PrivateVaultDiffAbi)
    }

    if (options?.isRestake) {
      baseAbi = baseAbi.concat(RestakingVaultDiffAbi)
    }

    if (options?.isGenesis) {
      baseAbi = baseAbi.concat(GenesisVaultDiffAbi)
    }

    return createContract(vaultAddress, baseAbi, provider) as Output<T> & {
      connect: () => Output<T>
    }
  }
)


export default createVaultContract
