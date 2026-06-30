const statusConfirmed = 200
const statusTimeout = 180_000
const statusPollInterval = 2_000


export type SendCallsInput = StakeWise.CommonParams & {
  userAddress: string
  calls: StakeWise.BatchData['calls']
}

export const sendCalls = async (values: SendCallsInput): Promise<StakeWise.TransactionHash> => {
  const { provider, options, userAddress, calls } = values

  if (!options.provider) {
    throw new Error('To send this transaction, please provide BrowserProvider to the StakeWiseSDK')
  }

  const chainIdHex = `0x${options.network.toString(16)}`

  const sendResult = await provider.send('wallet_sendCalls', [
    {
      version: '2.0.0',
      from: userAddress,
      chainId: chainIdHex,
      atomicRequired: true,
      calls: calls.map(({ to, data, value }) => (
        value ? { to, data, value: `0x${value.toString(16)}` } : { to, data }
      )),
    },
  ])

  const id = typeof sendResult === 'string' ? sendResult : sendResult.id

  const startTime = Date.now()

  let result = await provider.send('wallet_getCallsStatus', [ id ])

  while (result.status < statusConfirmed) {
    if (Date.now() - startTime > statusTimeout) {
      throw new Error(`Transaction batch ${id} timed out`)
    }

    await new Promise((resolve) => setTimeout(resolve, statusPollInterval))

    result = await provider.send('wallet_getCallsStatus', [ id ])
  }

  if (result.status !== statusConfirmed) {
    throw new Error(`Transaction batch failed (status: ${result.status})`)
  }

  const receipts = result.receipts || []
  const hash = receipts[receipts.length - 1]?.transactionHash

  if (!hash) {
    throw new Error(`Transaction batch ${id} succeeded but returned no transaction hash`)
  }

  return hash
}
