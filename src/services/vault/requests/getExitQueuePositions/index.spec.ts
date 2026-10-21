import { describe, expect } from 'vitest'

import {
  it,
  userAddress,
  subgraphUrl,
  vaultAddress,
  checksumAddress,
  lowercaseChecksumAddress,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { GetExitQueuePositionsInput } from './index'
import type { VariablesCase } from '../../../../../test'
import type { ExitQueueQueryPayload } from '../../../../graphql/subgraph/exitQueue'


type Input = StakeWise.ExtractInput<GetExitQueuePositionsInput>

type ExitRequest = ExitQueueQueryPayload['exitRequests'][number]

type ExitRequestRow = Omit<ExitRequest, 'withdrawalTimestamp'> & {
  withdrawalTimestamp: string | null
}

type ExitQueuePayload = {
  exitRequests: ExitRequestRow[]
}

const claimableRow: ExitRequestRow = {
  receiver: userAddress,
  isClaimed: false,
  timestamp: '1785925236',
  totalAssets: '200006337236577684',
  isClaimable: true,
  exitedAssets: '150006337236577684',
  isV2Position: false,
  positionTicket: '3916376728791170602274',
  exitQueueIndex: '52',
  withdrawalTimestamp: '0',
}

const queuedRow: ExitRequestRow = {
  receiver: userAddress,
  isClaimed: false,
  timestamp: '1792014444',
  totalAssets: '50003010525516839',
  isClaimable: false,
  exitedAssets: '50003010525516839',
  isV2Position: false,
  positionTicket: '15766994882354086787142',
  exitQueueIndex: '205',
  withdrawalTimestamp: '1792100844',
}

const laterQueuedRow: ExitRequestRow = {
  receiver: userAddress,
  isClaimed: false,
  timestamp: '1792021056',
  totalAssets: '50003010525516839',
  isClaimable: false,
  exitedAssets: '50003010525516839',
  isV2Position: false,
  positionTicket: '15767092207774951844576',
  exitQueueIndex: '205',
  withdrawalTimestamp: '1792107456',
}

const pendingRow: ExitRequestRow = {
  receiver: userAddress,
  isClaimed: false,
  timestamp: '1792058760',
  totalAssets: '49999999999999999',
  isClaimable: false,
  exitedAssets: '0',
  isV2Position: false,
  positionTicket: '15767189533195816902010',
  exitQueueIndex: null,
  withdrawalTimestamp: null,
}

const pendingRequest = { ...pendingRow, totalAssets: 49999999999999999n, exitedAssets: 0n }
const queuedRequest = { ...queuedRow, totalAssets: 50003010525516839n, exitedAssets: 50003010525516839n }
const claimableRequest = { ...claimableRow, totalAssets: 200006337236577684n, exitedAssets: 150006337236577684n }
const laterQueuedRequest = { ...laterQueuedRow, totalAssets: 50003010525516839n, exitedAssets: 50003010525516839n }

const claimablePosition = {
  timestamp: '1785925236',
  positionTicket: '3916376728791170602274',
  exitQueueIndex: '52',
}

const resultCases = [
  {
    name: 'claimable',
    exitRequests: [ claimableRow ],
    expected: {
      total: 200006337236577684n,
      duration: 0,
      positions: [ claimablePosition ],
      requests: [ claimableRequest ],
      withdrawable: 150006337236577684n,
    },
  },
  {
    name: 'queued then claimable',
    exitRequests: [ queuedRow, laterQueuedRow, claimableRow ],
    expected: {
      total: 300012358287611362n,
      duration: 1792107456,
      positions: [ claimablePosition ],
      requests: [ queuedRequest, laterQueuedRequest, claimableRequest ],
      withdrawable: 150006337236577684n,
    },
  },
  {
    name: 'pending first',
    exitRequests: [ pendingRow, queuedRow ],
    expected: {
      total: 100003010525516838n,
      duration: null,
      positions: [],
      requests: [ pendingRequest, queuedRequest ],
      withdrawable: 0n,
    },
  },
  {
    name: 'empty queue',
    exitRequests: [],
    expected: {
      total: 0n,
      duration: 0,
      positions: [],
      requests: [],
      withdrawable: 0n,
    },
  },
]

const variablesCases: VariablesCase<Input>[] = [
  {
    name: 'unclaimed',
    input: { isClaimed: false },
    expected: { where: { isClaimed: false, vault: vaultAddress, receiver: userAddress } },
  },
  {
    name: 'checksum addresses',
    input: { vaultAddress: checksumAddress, userAddress: checksumAddress },
    expected: {
      where: {
        vault: lowercaseChecksumAddress,
        receiver: lowercaseChecksumAddress,
      },
    },
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'invalid claimed flag',
    input: { vaultAddress, userAddress, isClaimed: 'yes' },
    message: 'The "isClaimed" argument must be a boolean',
  },
]

describe('getExitQueuePositions', () => {
  it.for(resultCases)('$name', async ({ exitRequests, expected }, { sdk, graphql }) => {
    graphql.mock<ExitQueuePayload>({ name: 'exitQueue', data: { exitRequests } })

    const result = await sdk.vault.getExitQueuePositions({ vaultAddress, userAddress })

    expect(result).toEqual(expected)
  })

  it.for(variablesCases)('$name', async ({ input, expected }, { sdk, graphql }) => {
    graphql.mock<ExitQueuePayload>({ name: 'exitQueue', data: { exitRequests: [] } })

    await sdk.vault.getExitQueuePositions({ vaultAddress, userAddress, ...input })

    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'exitQueue', variables: expected }),
    ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getExitQueue = () => sdk.vault.getExitQueuePositions(input as Input)

    expect(getExitQueue).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
