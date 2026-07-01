import { parseArgs, baseInputSchema } from '../../../../helpers'


export const validate = (values: unknown) => parseArgs(baseInputSchema, values)
