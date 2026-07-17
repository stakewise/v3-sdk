import { validate } from './validate'


export type CheckTxBatchSupportedInput = StakeWise.CommonParams & {
  userAddress: string
}

export const checkTxBatchSupported = async (values: CheckTxBatchSupportedInput): Promise<boolean> => {
  const { provider, options, userAddress } = values

  validate(values)

  const chainIdHex = `0x${options.network.toString(16)}`

  try {
    const capabilities = await provider.send('wallet_getCapabilities', [ userAddress, [ chainIdHex ] ])
    const chainCapabilities = capabilities?.[chainIdHex] || Object.values(capabilities || {})[0]
    const status = chainCapabilities?.atomic?.status

    return status === 'supported' || status === 'ready'
  }
  catch {
    return false
  }
}
