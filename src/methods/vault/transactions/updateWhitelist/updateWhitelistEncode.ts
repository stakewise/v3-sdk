import { commonLogic } from './common'
import { UpdateWhitelistInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const updateWhitelistEncode = async (values: UpdateWhitelistInput): Promise<StakeWise.TransactionData> => {
  const { params, multicallCommonArgs } = commonLogic(values)

  const rx = await vaultMulticall<{ data: string, to: string }>({
    ...multicallCommonArgs,
    request: {
      params,
      transactionData: true,
    },
  })

  return {
    data: rx.data,
    to: rx.to,
  }
}


export default updateWhitelistEncode
