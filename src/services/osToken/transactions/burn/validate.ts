import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


const burnSchema = z.extend(baseInputSchema, {
  shares: schema.bigint,
})


export type BurnArgs = z.input<typeof burnSchema>

export const validate = (values: unknown) => parseArgs(burnSchema, values)
