import { describe, expect } from 'vitest'

import { it, subgraphUrl, userAddress, checksumAddress, lowercaseChecksumAddress } from '../../../../../test'
import { userInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { GetRedeemerExitQueuePositionsInput } from './index'
import type { RedeemerExitQueueQueryPayload } from '../../../../graphql/subgraph/redeemerExitQueue'


type Input = StakeWise.ExtractInput<GetRedeemerExitQueuePositionsInput>

const owner = {
  owner: lowercaseChecksumAddress,
  receiver: lowercaseChecksumAddress,
}

const waitingRequest = {
  ...owner,
  isClaimed: false,
  timestamp: '1788335040',
  totalShares: '50320165372165955',
  totalAssets: '51505847471438995',
  exitedAssets: '0',
  isClaimable: false,
  positionTicket: '31065281178269236038',
  exitQueueIndex: null,
}

const claimableRequest = {
  ...owner,
  isClaimed: false,
  timestamp: '1787303856',
  totalShares: '2949854974471052698',
  totalAssets: '3019328065689691156',
  exitedAssets: '2999612562091715766',
  isClaimable: true,
  positionTicket: '25247357350772674696',
  exitQueueIndex: '2',
}

const firstTicketRequest = {
  ...owner,
  isClaimed: false,
  timestamp: '1777117464',
  totalShares: '20330932393320920198',
  totalAssets: '20743804111462513119',
  exitedAssets: '20667118429189033724',
  isClaimable: true,
  positionTicket: '0',
  exitQueueIndex: '0',
}

const claimedRequest = {
  ...owner,
  isClaimed: true,
  timestamp: '1787236692',
  totalShares: '4916424957451754498',
  totalAssets: '5032213442816151929',
  exitedAssets: '4999354270152859611',
  isClaimable: false,
  positionTicket: '20330932393320920198',
  exitQueueIndex: '2',
}

const unclaimedVariables = {
  where: { isClaimed: false, receiver: lowercaseChecksumAddress },
}

const claimedVariables = {
  where: { isClaimed: true, receiver: lowercaseChecksumAddress },
}

const resultCases = [
  {
    name: 'no requests',
    input: { userAddress: checksumAddress },
    variables: unclaimedVariables,
    osTokenRedeemerExitRequests: [],
    expected: {
      total: 0n,
      requests: [],
      positions: [],
      withdrawable: 0n,
    },
  },
  {
    name: 'several tickets',
    input: { userAddress: checksumAddress },
    variables: unclaimedVariables,
    osTokenRedeemerExitRequests: [ waitingRequest, claimableRequest, firstTicketRequest ],
    expected: {
      total: 23814638024623643270n,
      requests: [
        {
          ...waitingRequest,
          totalShares: 50320165372165955n,
          totalAssets: 51505847471438995n,
          exitedAssets: 0n,
        },
        {
          ...claimableRequest,
          totalShares: 2949854974471052698n,
          totalAssets: 3019328065689691156n,
          exitedAssets: 2999612562091715766n,
        },
        {
          ...firstTicketRequest,
          totalShares: 20330932393320920198n,
          totalAssets: 20743804111462513119n,
          exitedAssets: 20667118429189033724n,
        },
      ],
      positions: [
        { positionTicket: '25247357350772674696', exitQueueIndex: '2' },
        { positionTicket: '0', exitQueueIndex: '0' },
      ],
      withdrawable: 23666730991280749490n,
    },
  },
  {
    name: 'claimed',
    input: { userAddress: checksumAddress, isClaimed: true },
    variables: claimedVariables,
    osTokenRedeemerExitRequests: [ claimedRequest ],
    expected: {
      total: 5032213442816151929n,
      requests: [
        {
          ...claimedRequest,
          totalShares: 4916424957451754498n,
          totalAssets: 5032213442816151929n,
          exitedAssets: 4999354270152859611n,
        },
      ],
      positions: [],
      withdrawable: 0n,
    },
  },
]

const invalidCases = [
  userInvalidCase,
  {
    name: 'invalid claimed flag',
    input: { userAddress, isClaimed: 'yes' },
    message: 'The "isClaimed" argument must be a boolean',
  },
]

describe('getRedeemerExitQueuePositions', () => {
  it.for(resultCases)('$name', async (resultCase, { sdk, graphql }) => {
    const {
      input,
      expected,
      variables,
      osTokenRedeemerExitRequests,
    } = resultCase

    graphql.mock<RedeemerExitQueueQueryPayload>({
      name: 'redeemerExitQueue',
      data: { osTokenRedeemerExitRequests },
    })

    const result = await sdk.osToken.getRedeemerExitQueuePositions(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'redeemerExitQueue', variables }),
    ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getPositions = () => sdk.osToken.getRedeemerExitQueuePositions(input as Input)

    expect(getPositions).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
