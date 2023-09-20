import parseExitRequests from './parseExitRequests'
import fetchExitQueuePositions from './fetchExitQueuePositions'
import type { FetchExitQueuePositionsInput } from './fetchExitQueuePositions'


type GetExitQueueInput = FetchExitQueuePositionsInput & {
  contracts: SDK.Contracts
  options: SDK.Options
}

const mock = {
  data: [],
  total: 0n,
  withdrawable: 0n,
}

const getExitQueue = async (input: GetExitQueueInput) => {
  const { options, contracts, vaultAddress, userAddress } = input

  const data = await fetchExitQueuePositions({ options, vaultAddress, userAddress })

  if (!data) {
    return mock
  }

  const totalShares = data.reduce((acc, { totalShares }) => acc + BigInt(totalShares), 0n)

  const exitQueue = await parseExitRequests({
    options,
    contracts,
    userAddress,
    totalShares,
    vaultAddress,
    exitRequests: data,
  })

  return exitQueue
}


export default getExitQueue
