import { MaxUint256 } from 'ethers'

import { CreateVaultCommonInput } from '../types'
import { VaultType, constants } from '../../../../../helpers'


const capacity = (value: bigint) => {
  if (value < constants.blockchain.amount32) {
    throw new Error(`The "capacity" argument must be at least ${constants.blockchain.amount32}`)
  }
  if (value > MaxUint256) {
    throw new Error(`The "capacity" argument must be at most ${MaxUint256}`)
  }
}

const mevEscrow = (value: unknown) => {
  if (typeof value !== 'boolean') {
    throw new Error(`The "isOwnMevEscrow" argument must be of boolean type`)
  }
}

const vaultType = (value: VaultType) => {
  const vaultTypes = Object.values(VaultType)
  const isValidType = vaultTypes.includes(value)

  if (!isValidType) {
    throw new Error(`The "type" argument must be one of the following: ${vaultTypes.join(', ')}`)
  }
}

const vaultToken = (vaultToken: CreateVaultCommonInput['vaultToken']) => {
  if (typeof vaultToken !== 'object') {
    throw new Error(`The "vaultToken" argument must be an object`)
  }

  const missingParams = Object.keys(vaultToken)
    .filter((key) => typeof vaultToken[key as keyof typeof vaultToken] !== 'string')

  if (missingParams.length) {
    const args = missingParams.map((key) => `"vaultToken.${key}"`).join(', ')

    throw new Error(`The ${args} ${missingParams.length === 1 ? 'argument' : 'arguments'} must be a string`)
  }

  const emptyParams = Object.keys(vaultToken)
    .filter((key) => !vaultToken[key as keyof typeof vaultToken])

  if (emptyParams.length) {
    const args = emptyParams.map((key) => `"vaultToken.${key}"`).join(', ')

    throw new Error(`The ${args} ${missingParams.length === 1 ? 'argument' : 'arguments'} must be not empty string`)
  }
}

const keysManagerFee = (value: number) => {
  if (value < 0) {
    throw new Error(`The "keysManagerFee" argument must be at least 0`)
  }
  if (value > 100) {
    throw new Error(`The "keysManagerFee" argument must be at most 100`)
  }

  const decimals = value.toString().split('.')[1]?.length

  if (decimals > 2) {
    throw new Error(`The "keysManagerFee" argument must have at most two decimal places`)
  }
}

type GnosisMetaVaultInput = Pick<CreateVaultCommonInput, 'vaultToken' | 'isOwnMevEscrow' | 'type'> & {
  isMainnet: boolean
}

const metaVault = (values: GnosisMetaVaultInput) => {
  const { type, vaultToken, isMainnet, isOwnMevEscrow } = values

  const isMetaVault = [
    VaultType.MetaVault,
    VaultType.PrivateMetaVault,
  ].includes(type as VaultType)

  if (isMetaVault) {
    return
  }

  if (isOwnMevEscrow) {
    throw new Error('MetaVault does not support the "isOwnMevEscrow" parameter.')
  }

  if (!isMainnet) {
    if (vaultToken) {
      throw new Error('MetaVault does not support the ERC20 token on gnosis chain.')
    }

    if (type === VaultType.PrivateMetaVault) {
      throw new Error('Gnosis chain does not support private MetaVault.')
    }
  }
}


export default {
  capacity,
  metaVault,
  mevEscrow,
  vaultType,
  vaultToken,
  keysManagerFee,
}
