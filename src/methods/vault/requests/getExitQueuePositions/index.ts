import { validateArgs } from '../../../../utils'
import parseExitRequests from './parseExitRequests'
import fetchExitQueuePositions from './fetchExitQueuePositions'
import type { ParseExitRequestsOutput } from './parseExitRequests'
import type { FetchExitQueuePositionsInput } from './fetchExitQueuePositions'


type GetExitQueuePositionsInput = FetchExitQueuePositionsInput & {
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
  options: StakeWise.Options
}

const mock: ParseExitRequestsOutput = {
  total: 0n,
  duration: 0,
  positions: [],
  withdrawable: 0n,
}

const getExitQueuePositions = async (input: GetExitQueuePositionsInput) => {
  const { options, contracts, provider, vaultAddress, userAddress } = input

  validateArgs.address({ vaultAddress, userAddress })

  return fetchExitQueuePositions({ options, vaultAddress, userAddress })
    .then((data) => {
      if (!data) {
        return mock
      }

      return parseExitRequests({
        options,
        provider,
        contracts,
        userAddress,
        vaultAddress,
        exitRequests: data,
      })
    })
}


export default getExitQueuePositions
