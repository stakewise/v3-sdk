import parseExitRequests from './parseExitRequests'
import fetchExitQueuePositions from './fetchExitQueuePositions'
import type { FetchExitQueuePositionsInput } from './fetchExitQueuePositions'


type ExitQueueInput = FetchExitQueuePositionsInput & {}

const mock = {
  data: [],
  total: 0n,
  withdrawable: 0n,
}

const exitQueue = async (input: ExitQueueInput) => {
  const { network, vaultAddress, userAddress } = input

  const data = await fetchExitQueuePositions({ network, vaultAddress, userAddress })

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
