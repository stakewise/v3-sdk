import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  assets: z.optional(schema.bigint),
  shares: z.optional(schema.bigint),
}).check((ctx) => {
  const { assets, shares } = ctx.value

  const hasAssets = typeof assets !== 'undefined'
  const hasShares = typeof shares !== 'undefined'

  if (hasAssets === hasShares) {
    ctx.issues.push({
      code: 'custom',
      message: 'Provide either the "assets" or the "shares" argument, but not both',
      input: ctx.value,
    })
  }
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
