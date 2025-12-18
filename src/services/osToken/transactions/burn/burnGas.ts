import { commonLogic } from './common'
import type { BurnInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const burnGas = async (values: BurnInput) => {
  const { shares, provider, userAddress } = values

  const vaultContract = commonLogic(values)

  const estimatedGas = await wrapErrorHandler(
    vaultContract.burnOsToken.estimateGas(shares, { from: userAddress }),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default burnGas
