import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../helpers'


const positionApyDataSchema = z.object({
  vaultApy: schema.number,
  borrowApy: schema.number,
  osTokenApy: schema.number,
  feePercent: schema.number,
  ltvPercent: schema.bigint,
  osTokenRate: schema.bigint,
  osTokenMintApy: schema.number,
  allocatorMaxBoostApy: schema.number,
  leverageMaxMintLtvPercent: schema.bigint,
  leverageMaxBorrowLtvPercent: schema.bigint,
})

const positionDataSchema = z.object({
  vault: z.nullable(z.object({
    apyData: positionApyDataSchema,
    isCollateralized: schema.boolean,
    isOsTokenEnabled: schema.boolean,
  })),
  stakedAssets: schema.bigint,
  exitingAssets: schema.bigint,
  mintedShares: schema.bigint,
  walletShares: schema.bigint,
  boostedShares: schema.bigint,
  boostedAssets: schema.bigint,
  leverageReward: schema.bigint,
})

const validateSchema = z.object({
  data: positionDataSchema,
  stakedAssetsDelta: z._default(schema.bigint, 0n),
  mintedSharesDelta: z._default(schema.bigint, 0n),
  boostedSharesDelta: z._default(schema.bigint, 0n),
})

export type PositionInput = z.input<typeof validateSchema>

const validatePositionInput = (values: unknown) => parseArgs(validateSchema, values)


export default validatePositionInput
