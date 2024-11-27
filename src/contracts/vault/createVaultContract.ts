import type { Provider } from 'ethers'


import {
  GnosisVaultDiffAbi,
  OtherTokenVaultAbi,
  NativeTokenVaultAbi,
  PrivateVaultDiffAbi,
  BlocklistVaultDiffAbi,
  DepositWithMintDiffAbi,
} from './abis'

import {
  GnosisVaultDiffAbi as GnosisVaultDiffType,
  OtherTokenVaultAbi as OtherTokenVaultType,
  NativeTokenVaultAbi as NativeTokenVaultType,
  PrivateVaultDiffAbi as PrivateVaultDiffType,
  BlocklistVaultDiffAbi as BlocklistVaultDiffType,
  DepositWithMintDiffAbi as DepositWithMintDiffType,
} from './types'

import { Network } from '../../utils'
import createContract from '../createContract'
import { ModifiedVault } from '../../methods/vault/requests/getVault/types'


type Options = Partial<Pick<ModifiedVault, 'isBlocklist' | 'isPrivate'>> & {
  chainId?: Network
  isDepositWithMint?: boolean
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
  (T['isPrivate'] extends true
    ? PrivateVaultDiffType
    : object
  ) &
  (T['isDepositWithMint'] extends true
    ? DepositWithMintDiffType
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

    if (options?.isDepositWithMint) {
      baseAbi = baseAbi.concat(DepositWithMintDiffAbi)
    }

    return createContract(vaultAddress, baseAbi, provider) as Output<T> & {
      connect: () => Output<T>
    }
  }
)


export default createVaultContract
