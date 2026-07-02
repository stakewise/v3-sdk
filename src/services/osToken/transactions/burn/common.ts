import type { BurnInput } from './types'
import { validate } from './validate'


export const commonLogic = (values: BurnInput) => {
  const { contracts } = values
  const { vaultAddress } = validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  return vaultContract
}
