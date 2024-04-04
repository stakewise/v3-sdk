import { vaultMulticall } from '../../contracts'


type Input = Parameters<typeof vaultMulticall>[0]

const getVaultMulticallEncode = async (values: Input): Promise<StakeWise.TransactionData> => {
  const rx = await vaultMulticall<{ data: string, to: string }>({
    ...values,
    request: {
      ...values.request,
      transactionData: true,
    },
  })

  return {
    data: rx.data,
    to: rx.to,
  }
}


export default getVaultMulticallEncode
