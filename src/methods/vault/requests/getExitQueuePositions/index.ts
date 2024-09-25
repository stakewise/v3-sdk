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
  pending: [],
  duration: 0,
  positions: [],
  withdrawable: 0n,
}

const getExitQueuePositions = async (input: GetExitQueuePositionsInput): Promise<ParseExitRequestsOutput> => {
  const { options, contracts, provider, vaultAddress, userAddress, isClaimed } = input

  validateArgs.address({ vaultAddress, userAddress })

  if (typeof isClaimed !== 'undefined') {
    validateArgs.boolean({ isClaimed })
  }

  return fetchExitQueuePositions({ options, vaultAddress, userAddress, isClaimed })
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
