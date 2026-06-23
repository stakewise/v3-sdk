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

  if (!isAddress(userAddress)) {
    ctx.addIssue({
      code: 'custom',
      path: [ 'userAddress' ],
      message: 'must be a valid address',
    })
  }

  if (!vaultTypes.includes(type)) {
    ctx.addIssue({
      code: 'custom',
      path: [ 'type' ],
      message: `must be one of the following: ${vaultTypes.join(', ')}`,
    })
  }

  if (!isMetaVault) {
    if (isOwnMevEscrow) {
      ctx.addIssue({
        code: 'custom',
        message: 'MetaVault does not support the "isOwnMevEscrow" parameter.',
      })
    }

    if (!isMainnet) {
      if (vaultToken) {
        ctx.addIssue({
          code: 'custom',
          message: 'MetaVault does not support the ERC20 token on gnosis chain.',
        })
      }

      if (type === VaultType.PrivateMetaVault) {
        ctx.addIssue({
          code: 'custom',
          message: 'Gnosis chain does not support private MetaVault.',
        })
      }
    }

    if (typeof isOwnMevEscrow !== 'boolean') {
      ctx.addIssue({
        code: 'custom',
        path: [ 'isOwnMevEscrow' ],
        message: 'must be of boolean type',
      })
    }
  }

  if (vaultToken) {
    if (typeof vaultToken !== 'object') {
      ctx.addIssue({
        code: 'custom',
        path: [ 'vaultToken' ],
        message: 'must be an object',
      })
    }
    else {
      const token = vaultToken as Record<string, unknown>

      const missingParams = Object.keys(token).filter((key) => typeof token[key] !== 'string')
      const argWord = missingParams.length === 1 ? 'argument' : 'arguments'

      if (missingParams.length) {
        const args = missingParams.map((key) => `"vaultToken.${key}"`).join(', ')

        ctx.addIssue({
          code: 'custom',
          message: `The ${args} ${argWord} must be a string`,
        })
      }

      const emptyParams = Object.keys(token).filter((key) => !token[key])

      if (emptyParams.length) {
        const args = emptyParams.map((key) => `"vaultToken.${key}"`).join(', ')

        ctx.addIssue({
          code: 'custom',
          message: `The ${args} ${argWord} must be not empty string`,
        })
      }
    }
  }

  if (capacity) {
    if (typeof capacity !== 'bigint') {
      ctx.addIssue({
        code: 'custom',
        path: [ 'capacity' ],
        message: 'must be of type bigint',
      })
    }
    else {
      if (capacity < constants.blockchain.amount32) {
        ctx.addIssue({
          code: 'custom',
          path: [ 'capacity' ],
          message: `must be at least ${constants.blockchain.amount32}`,
        })
      }

      if (capacity > MaxUint256) {
        ctx.addIssue({
          code: 'custom',
          path: [ 'capacity' ],
          message: `must be at most ${MaxUint256}`,
        })
      }
    }
  }

  if (keysManagerFee) {
    const fee = keysManagerFee as number

    if (fee < 0) {
      ctx.addIssue({
        code: 'custom',
        path: [ 'keysManagerFee' ],
        message: 'must be at least 0',
      })
    }

    if (fee > 100) {
      ctx.addIssue({
        code: 'custom',
        path: [ 'keysManagerFee' ],
        message: 'must be at most 100',
      })
    }

    const decimals = fee.toString().split('.')[1]?.length

    if (decimals && decimals > 2) {
      ctx.addIssue({
        code: 'custom',
        path: [ 'keysManagerFee' ],
        message: 'must have at most two decimal places',
      })
    }
  }
})

const validateCreateVaultArgs = (values: ValidateInput) => {
  parseArgs(schema, values)
}


export default validateCreateVaultArgs
