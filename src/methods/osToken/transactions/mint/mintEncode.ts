import { MintInput } from './types'
import { commonLogic, referrer } from './common'
import { vaultMulticall } from '../../../../contracts'


const mintEncode = async (values: MintInput): Promise<StakeWise.TransactionData> => {
  const { shares, userAddress } = values

  const multicallArgs = commonLogic(values)

  const rx = await vaultMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      params: [
        {
          method: 'mintOsToken',
          args: [ userAddress, shares, referrer ],
        },
      ],
      transactionData: true,
    },
  })

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default mintEncode
