import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  percent: schema.number,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
