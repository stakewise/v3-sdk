import { vaultMulticall } from '../../contracts'


type Input = Parameters<typeof vaultMulticall>[0]

const getVaultMulticallEncode = async (values: Input): Promise<StakeWise.TransactionData> => {
  return vaultMulticall<{ data: string, to: string }>({
    ...values,
    request: {
      ...values.request,
      transactionData: true,
    },
  })
}


export default getVaultMulticallEncode
