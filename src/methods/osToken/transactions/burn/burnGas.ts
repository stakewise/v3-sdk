import { commonLogic } from './common'
import type { BurnInput } from './types'
import { getGas } from '../../../../utils'


const burnGas = async (values: BurnInput) => {
  const { shares, provider, userAddress } = values

  const vaultContract = commonLogic(values)

  const estimatedGas = await vaultContract.burnOsToken.estimateGas(shares, {
    from: userAddress,
  })

  const gas = await getGas({ estimatedGas, provider })

  return gas
}


export default burnGas
