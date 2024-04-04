import { validateArgs } from '../../../../utils'
import parseExitRequests from './parseExitRequests'
import fetchExitQueuePositions from './fetchExitQueuePositions'
import fetchExitRequestDuration from './fetchExitRequestDuration'
import { wrapAbortPromise } from '../../../../modules/gql-module'
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

  const [ duration, data ] = await Promise.all([
    fetchExitRequestDuration({ options, vaultAddress, userAddress }),
    fetchExitQueuePositions({ options, vaultAddress, userAddress }),
  ])

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
}


export default wrapAbortPromise<GetExitQueuePositionsInput, ParseExitRequestsOutput>(getExitQueuePositions)
