import type { VaultType } from '../../../../helpers'
import type { UploadMetadataInput } from '../util/metadata/uploadMetadata'


export type CreateVaultCommonInput = Omit<StakeWise.BaseInput, 'vaultAddress'> & {
  type?: VaultType
  vaultToken?: {
    name: string
    symbol: string
  }
  capacity?: bigint
  keysManagerFee?: number
  isOwnMevEscrow?: boolean
}

export type CreateVaultInput = CreateVaultCommonInput & UploadMetadataInput

export type CreateVaultTransactionInput = CreateVaultCommonInput & {
  metadataIpfsHash?: string
}

export interface ExtractCreateVault {
  (values: StakeWise.ExtractInput<CreateVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<CreateVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<CreateVaultInput>) => Promise<StakeWise.TransactionData>
}
