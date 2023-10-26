import type { MintInput } from './types'
import { getGas } from '../../../../utils'
import { commonLogic, referrer } from './common'
import { vaultMulticall } from '../../../../contracts'


const mintGas = async (values: MintInput) => {
  const { shares, provider, userAddress } = values

  const multicallArgs = commonLogic(values)

  const estimatedGas = await vaultMulticall<bigint>({
    ...multicallArgs,
    request: {
      params: [
        {
          method: 'mintOsToken',
          args: [ userAddress, shares, referrer ],
        },
      ],
      estimateGas: true,
    },
  })

  const gas = await getGas({ estimatedGas, provider })

  return gas
}


export default mintGas
