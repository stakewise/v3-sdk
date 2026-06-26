import { parseArgs } from '../../../../helpers'

import { depositSchema } from './types'


export const validate = (values: unknown) => parseArgs(depositSchema, values)
