import parseExitRequests from './parseExitRequests'
import fetchExitQueuePositions from './fetchExitQueuePositions'
import type { FetchExitQueuePositionsInput } from './fetchExitQueuePositions'


type ExitQueueInput = FetchExitQueuePositionsInput & {
  options: SDK.Options
}

const mock = {
  data: [],
  total: 0n,
  withdrawable: 0n,
}

const exitQueue = async (input: ExitQueueInput) => {
  const { options, vaultAddress, userAddress } = input
  const { network } = options

  const data = await fetchExitQueuePositions({ options, vaultAddress, userAddress })

  if (!data) {
    return mock
  }

  const totalShares = data.reduce((acc, { totalShares }) => acc + BigInt(totalShares), 0n)

  const exitQueue = await parseExitRequests({
    network,
    userAddress,
    totalShares,
    vaultAddress,
    exitRequests: data,
  })

  return exitQueue
}


export default exitQueue
