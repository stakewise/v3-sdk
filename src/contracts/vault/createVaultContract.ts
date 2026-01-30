import type { Provider } from 'ethers'


import {
  DefaultVaultAbi,
  MetaVaultDiffAbi,
  GnosisVaultDiffAbi,
  MainnetVaultDiffAbi,
  PrivateVaultDiffAbi,
  BlocklistVaultDiffAbi,
  DepositWithMintDiffAbi,
} from './abis'

import {
  DefaultVaultAbi as DefaultVaultType,
  MetaVaultDiffAbi as MetaVaultDiffType,
  GnosisVaultDiffAbi as GnosisVaultDiffType,
  MainnetVaultDiffAbi as MainnetVaultDiffType,
  PrivateVaultDiffAbi as PrivateVaultDiffType,
  BlocklistVaultDiffAbi as BlocklistVaultDiffType,
  DepositWithMintDiffAbi as DepositWithMintDiffType,
} from './types'

import { Network } from '../../helpers'
import createContract from '../createContract'
import { ModifiedVault } from '../../services/vault/requests/getVault/types'


type Options = Partial<Pick<ModifiedVault, 'isBlocklist' | 'isPrivate' | 'isMetaVault'>> & {
  chainId?: Network
  isDepositWithMint?: boolean
}

type CreateContractsInput<T> = {
  vaultAddress: string
  options?: T
}

type Output<T extends Options> = Omit<
  (T['chainId'] extends Network.Gnosis
    ? DefaultVaultType & GnosisVaultDiffType
    : DefaultVaultType & MainnetVaultDiffType
  ) &
  (T['isBlocklist'] extends true
    ? BlocklistVaultDiffType
    : object
  ) &
  (T['isPrivate'] extends true
    ? PrivateVaultDiffType
    : object
  ) &
  (T['isDepositWithMint'] extends true
    ? DepositWithMintDiffType
    : object
  ) &
  (T['isMetaVault'] extends true
    ? MetaVaultDiffType
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

    const isGnosis = Network.Gnosis === (options?.chainId || Network.Mainnet)

    let baseAbi = isGnosis
      ? DefaultVaultAbi.concat(GnosisVaultDiffAbi)
      : DefaultVaultAbi.concat(MainnetVaultDiffAbi)

    if (options?.isBlocklist) {
      baseAbi = baseAbi.concat(BlocklistVaultDiffAbi)
    }

    if (options?.isPrivate) {
      baseAbi = baseAbi.concat(PrivateVaultDiffAbi)
    }

    if (options?.isDepositWithMint) {
      baseAbi = baseAbi.concat(DepositWithMintDiffAbi)
    }

    if (options?.isMetaVault) {
      baseAbi = baseAbi.concat(MetaVaultDiffAbi)
    }

    return createContract(vaultAddress, baseAbi, provider) as Output<T> & {
      connect: () => Output<T>
    }
  }
)


export default createVaultContract
