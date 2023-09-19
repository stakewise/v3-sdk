import { Network, vaultMulticall } from 'helpers'

import parseExitRequests, { ParseExitRequestsInput } from './parseExitRequests'


jest.mock('helpers')

describe('parseExitRequests function', () => {
  const input: ParseExitRequestsInput = {
    network: Network.Mainnet,  // Use appropriate network enum value
    userAddress: 'userAddress',
    vaultAddress: 'vaultAddress',
    totalShares: 1000n,
    exitRequests: [
      {
        positionTicket: 'positionTicket-1',
        totalShares: '100',
      },
      {
        positionTicket: 'positionTicket-2',
        totalShares: '200',
      },
    ],
  }

  beforeEach(() => {
    (vaultMulticall as jest.Mock).mockClear()
  })

  it('should parse exit requests correctly', async () => {
    (vaultMulticall as jest.Mock)
      .mockImplementationOnce(() => [
        [ 1n ],
        [ 2n ],
      ])
      .mockImplementationOnce(() => [
        {
          newPositionTicket: 10n,
          claimedShares: 50n,
          claimedAssets: 30n,
        },
        {
          newPositionTicket: 20n,
          claimedShares: 100n,
          claimedAssets: 1n,
        },
      ])
      .mockImplementationOnce(() => [
        { assets: 100n },
      ])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      data: [
        { exitQueueIndex: 1n, positionTicket: 'positionTicket-1' },
        { exitQueueIndex: 2n, positionTicket: 'positionTicket-2' },
      ],
      total: 100n,
      withdrawable: 31n,
    })
  })
})
