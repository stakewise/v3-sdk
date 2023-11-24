import { validateArgs } from '../../../../utils'
import parseExitRequests from './parseExitRequests'
import fetchExitQueuePositions from './fetchExitQueuePositions'
import type { FetchExitQueuePositionsInput } from './fetchExitQueuePositions'


type GetExitQueuePositionsInput = FetchExitQueuePositionsInput & {
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
  options: StakeWise.Options
}

const mock = {
  total: 0n,
  positions: [],
  withdrawable: 0n,
}

const getExitQueuePositions = async (input: GetExitQueuePositionsInput) => {
  const { options, contracts, provider, vaultAddress, userAddress } = input

  validateArgs.address({ vaultAddress, userAddress })

  const data = await fetchExitQueuePositions({ options, vaultAddress, userAddress })

  if (!data) {
    return mock
  }

  const totalShares = data.reduce((acc, { totalShares }) => acc + BigInt(totalShares), 0n)

  const exitQueue = await parseExitRequests({
    options,
    provider,
    contracts,
    userAddress,
    totalShares,
    vaultAddress,
    exitRequests: data,
  })

  return exitQueue
}


export default getExitQueuePositions
