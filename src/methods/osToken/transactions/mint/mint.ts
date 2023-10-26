import mintGas from './mintGas'
import type { Mint } from './types'
import mintEncode from './mintEncode'
import { commonLogic, referrer } from './common'
import { vaultMulticall } from '../../../../contracts'


const mint: Mint = async (values) => {
  const { shares, userAddress } = values

  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>({
    ...multicallArgs,
    request: {
      params: [
        {
          method: 'mintOsToken',
          args: [ userAddress, shares, referrer ],
        },
      ],
    },
  })

  return result.hash
}

mint.encode = mintEncode
mint.estimateGas = mintGas


export default mint
