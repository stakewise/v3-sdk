import createVaultGas from './createVaultGas'
import createVaultEncode from './createVaultEncode'
import type { BaseInput } from '../../../utils'
import type { VaultType } from '../../../../utils'
import type { UploadMetadataInput } from '../util/metadata/uploadMetadata'


export type CreateVaultCommonInput = Omit<BaseInput, 'vaultAddress'> & {
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

export interface CreateVault {
  (values: CreateVaultInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof createVaultGas
  encode: typeof createVaultEncode
}
