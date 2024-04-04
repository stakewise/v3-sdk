import { validateArgs } from '../../../../utils'
import parseExitRequests from './parseExitRequests'
import fetchExitQueuePositions from './fetchExitQueuePositions'
import fetchExitRequestDuration from './fetchExitRequestDuration'
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

  const duration = await fetchExitRequestDuration({ options, vaultAddress, userAddress })

  return fetchExitQueuePositions({ options, vaultAddress, userAddress })
    .then((data) => {
      if (!data) {
        return mock
      }

      return parseExitRequests({
        options,
        duration,
        provider,
        contracts,
        userAddress,
        vaultAddress,
        exitRequests: data,
      })
    })
}


export default getExitQueuePositions
