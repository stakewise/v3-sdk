import { commonLogic } from './common'
import { UpdateBlocklistInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const updateBlocklistEncode = async (values: UpdateBlocklistInput): Promise<StakeWise.TransactionData> => {
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


export default updateBlocklistEncode
