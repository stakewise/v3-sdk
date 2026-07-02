import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../helpers'


const validateSchema = z.object({
  leverageStrategyData: z.object({
    version: schema.number,
    isUpgradeRequired: schema.boolean,
  }),
})

const validateLeverageStrategyData = (leverageStrategyData?: unknown) => {
  if (leverageStrategyData) {
    parseArgs(validateSchema, { leverageStrategyData })
  }
}


export default validateLeverageStrategyData
