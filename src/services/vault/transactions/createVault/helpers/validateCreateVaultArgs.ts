import { z } from 'zod'
import { MaxUint256, isAddress } from 'ethers'

import { CreateVaultTransactionInput } from '../types'
import { VaultType, constants, parseArgs } from '../../../../../helpers'


type ValidateInput = CreateVaultTransactionInput & {
  isMainnet: boolean
}

const vaultTypes = Object.values(VaultType)

const schema = z.object({
  type: z.unknown(),
  capacity: z.unknown(),
  isMainnet: z.unknown(),
  vaultToken: z.unknown(),
  userAddress: z.unknown(),
  keysManagerFee: z.unknown(),
  isOwnMevEscrow: z.unknown(),
}).superRefine((values, ctx) => {
  const { userAddress, capacity, keysManagerFee, vaultToken, isMainnet, isOwnMevEscrow } = values

  const type = values.type as VaultType
  const isMetaVault = [ VaultType.MetaVault, VaultType.PrivateMetaVault ].includes(type)

  const addIssue = (message: string, field?: string) => ctx.addIssue({
    code: 'custom',
    message,
    path: field ? [ field ] : undefined,
  })

  if (!isAddress(userAddress)) {
    addIssue('must be a valid address', 'userAddress')
  }

  if (!vaultTypes.includes(type)) {
    addIssue(`must be one of the following: ${vaultTypes.join(', ')}`, 'type')
  }

  if (!isMetaVault) {
    if (isOwnMevEscrow) {
      addIssue('MetaVault does not support the "isOwnMevEscrow" parameter.')
    }

    if (!isMainnet) {
      if (vaultToken) {
        addIssue('MetaVault does not support the ERC20 token on gnosis chain.')
      }

      if (type === VaultType.PrivateMetaVault) {
        addIssue('Gnosis chain does not support private MetaVault.')
      }
    }

    if (typeof isOwnMevEscrow !== 'boolean') {
      addIssue('must be of boolean type', 'isOwnMevEscrow')
    }
  }

  if (vaultToken) {
    if (typeof vaultToken !== 'object') {
      addIssue('must be an object', 'vaultToken')
    }
    else {
      const token = vaultToken as Record<string, unknown>

      const missingParams = Object.keys(token).filter((key) => typeof token[key] !== 'string')
      const argWord = missingParams.length === 1 ? 'argument' : 'arguments'

      if (missingParams.length) {
        const args = missingParams.map((key) => `"vaultToken.${key}"`).join(', ')

        addIssue(`The ${args} ${argWord} must be a string`)
      }

      const emptyParams = Object.keys(token).filter((key) => !token[key])

      if (emptyParams.length) {
        const args = emptyParams.map((key) => `"vaultToken.${key}"`).join(', ')

        addIssue(`The ${args} ${argWord} must be not empty string`)
      }
    }
  }

  if (capacity) {
    if (typeof capacity !== 'bigint') {
      addIssue('must be of type bigint', 'capacity')
    }
    else {
      if (capacity < constants.blockchain.amount32) {
        addIssue(`must be at least ${constants.blockchain.amount32}`, 'capacity')
      }

      if (capacity > MaxUint256) {
        addIssue(`must be at most ${MaxUint256}`, 'capacity')
      }
    }
  }

  if (keysManagerFee) {
    const fee = keysManagerFee as number

    if (fee < 0) {
      addIssue('must be at least 0', 'keysManagerFee')
    }

    if (fee > 100) {
      addIssue('must be at most 100', 'keysManagerFee')
    }

    const decimals = fee.toString().split('.')[1]?.length

    if (decimals && decimals > 2) {
      addIssue('must have at most two decimal places', 'keysManagerFee')
    }
  }
})

const validateCreateVaultArgs = (values: ValidateInput) => {
  parseArgs(schema, values)
}


export default validateCreateVaultArgs
