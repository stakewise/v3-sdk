import { parseArgs, positionDeltasSchema } from '../../../../helpers'


export const validate = (values: unknown) => parseArgs(positionDeltasSchema, values)
