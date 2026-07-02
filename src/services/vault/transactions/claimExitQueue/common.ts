import * as z from 'zod/mini'

import { vaultMulticall } from '../../../../contracts'
import { parseArgs, schema } from '../../../../helpers'
import type { VaultMulticallBaseInput } from '../../../../contracts'

import type { ClaimExitQueueInput } from './types'


const positionsSchema = z.object({
  positions: schema.array(),
})

const positionItemSchema = z.object({
  exitQueueIndex: schema.string,
  positionTicket: schema.string,
})

const validatePositions = (positions: ClaimExitQueueInput['positions']) => {
  parseArgs(positionsSchema, { positions })

  positions.forEach((position) => {
    parseArgs(positionItemSchema, position)
  })
}

export const commonLogic = (values: ClaimExitQueueInput) => {
  const { contracts, positions, vaultAddress } = values

  validatePositions(positions)

  const baseMulticallArgs: VaultMulticallBaseInput = {
    vaultContract: contracts.helpers.createVault({ vaultAddress }),
    ...values,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = positions.map((position) => {
    const { positionTicket, exitQueueIndex, timestamp } = position

    return {
      method: 'claimExitedAssets',
      args: [ positionTicket, timestamp, exitQueueIndex ],
    }
  })

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
