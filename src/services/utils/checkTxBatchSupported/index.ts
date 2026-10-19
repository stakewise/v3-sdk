import { validate } from './validate'


export type CheckTxBatchSupportedInput = StakeWise.CommonParams & {
  userAddress: string
}

type Capabilities = Record<string, { atomic?: { status?: string } }>

export const checkTxBatchSupported = async (values: CheckTxBatchSupportedInput): Promise<boolean> => {
  const { provider, options, userAddress } = values

  validate(values)

  const chainIdHex = `0x${options.network.toString(16)}`

  try {
    const capabilities: Capabilities | null = await provider.send('wallet_getCapabilities', [ userAddress, [ chainIdHex ] ])
    const chainEntry = Object.entries(capabilities || {}).find(([ chainId ]) => Number(chainId) === options.network)
    const status = chainEntry?.[1]?.atomic?.status

    return status === 'supported' || status === 'ready'
  }
  catch {
    return false
  }
}
