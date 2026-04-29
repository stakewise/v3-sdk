import type { Provider } from 'ethers'


import {
  DefaultVaultAbi,
  GnosisVaultDiffAbi,
  MainnetVaultDiffAbi,
  PrivateVaultDiffAbi,
  BlocklistVaultDiffAbi,
  DepositWithMintDiffAbi,
} from './abis'

import {
  DefaultVaultAbi as DefaultVaultType,
  MainnetVaultDiffAbi as MainnetVaultDiffType,
  PrivateVaultDiffAbi as PrivateVaultDiffType,
  BlocklistVaultDiffAbi as BlocklistVaultDiffType,
  DepositWithMintDiffAbi as DepositWithMintDiffType,
} from './types'

import { Network } from '../../helpers'
import createContract from '../createContract'
import { ModifiedVault } from '../../services/vault/requests/getVault/types'


type Options = Partial<Pick<ModifiedVault, 'isBlocklist' | 'isPrivate'>> & {
  isDepositWithMint?: boolean
}

type CreateContractsInput<T> = {
  vaultAddress: string
  options?: T
}

type VaultType<T extends Options> = (
  DefaultVaultType
  & MainnetVaultDiffType
  & (T['isBlocklist'] extends true ? BlocklistVaultDiffType : object)
  & (T['isPrivate'] extends true ? PrivateVaultDiffType : object)
  & (T['isDepositWithMint'] extends true ? DepositWithMintDiffType : object)
)

type Output<T extends Options> = Omit<VaultType<T>, 'connect'> & {
  // overwrite, since each abi returns itself
  connect: (signer: any) => Output<T>
}

const createVaultContract = (provider: Provider, config: StakeWise.Config) => (
  <T extends Options>(input: CreateContractsInput<T>): Output<T> => {
    const { vaultAddress, options } = input

    const isGnosis = config.network.chainId === Network.Gnosis

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

    return createContract(vaultAddress, baseAbi, provider) as Output<T> & {
      connect: () => Output<T>
    }
  }
)


export default createVaultContract
