import { vaultMulticall } from '../../contracts'


export type GetVaultMulticallEncodeInput = Parameters<typeof vaultMulticall>[0]

export const getVaultMulticallEncode = async (values: GetVaultMulticallEncodeInput): Promise<StakeWise.TransactionData> => {
  return vaultMulticall<{ data: string, to: string }>({
    ...values,
    request: {
      ...values.request,
      transactionData: true,
    },
  })
}
