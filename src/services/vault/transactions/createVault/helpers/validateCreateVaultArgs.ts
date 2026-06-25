import { z } from 'zod'
import { MaxUint256 } from 'ethers'

import { CreateVaultTransactionInput } from '../types'
import { VaultType, constants, parseArgs, schema } from '../../../../../helpers'


type ValidateInput = CreateVaultTransactionInput & {
  isMainnet: boolean
}

const vaultTypes = Object.values(VaultType)
const vaultTypeError = `must be one of the following: ${vaultTypes.join(', ')}`

const createVaultSchema = z.object({
  isMainnet: schema.boolean,
  userAddress: schema.ethAddress,
  capacity: schema.bigint.optional(),
  vaultToken: z.unknown().optional(),
  keysManagerFee: schema.number.optional(),
  isOwnMevEscrow: schema.boolean.optional(),
  type: z.enum(VaultType, { error: vaultTypeError }),
}).superRefine((values, ctx) => {
  const { capacity, keysManagerFee, vaultToken, isMainnet, isOwnMevEscrow } = values

  const { type } = values
  const isMetaVault = [ VaultType.MetaVault, VaultType.PrivateMetaVault ].includes(type)

  const addIssue = (message: string, field?: string) => ctx.addIssue({
    code: 'custom',
    message,
    path: field ? [ field ] : undefined,
  })

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
    if (capacity < constants.blockchain.amount32) {
      addIssue(`must be at least ${constants.blockchain.amount32}`, 'capacity')
    }

    if (capacity > MaxUint256) {
      addIssue(`must be at most ${MaxUint256}`, 'capacity')
    }
  }

  if (keysManagerFee) {
    if (keysManagerFee < 0) {
      addIssue('must be at least 0', 'keysManagerFee')
    }

    if (keysManagerFee > 100) {
      addIssue('must be at most 100', 'keysManagerFee')
    }

    const decimals = keysManagerFee.toString().split('.')[1]?.length

    if (decimals && decimals > 2) {
      addIssue('must have at most two decimal places', 'keysManagerFee')
    }
  }
})

const validateCreateVaultArgs = (values: ValidateInput) => {
  parseArgs(createVaultSchema, values)
}


export default validateCreateVaultArgs
