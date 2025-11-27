import { commonLogic } from './common'
import type { BurnInput } from './types'
import { getGas } from '../../../../helpers'


const burnGas = async (values: BurnInput) => {
  const { shares, provider, userAddress } = values

  const vaultContract = commonLogic(values)

  const estimatedGas = await vaultContract.burnOsToken.estimateGas(shares, {
    from: userAddress,
  })

  return getGas({ estimatedGas, provider })
}


export default burnGas
