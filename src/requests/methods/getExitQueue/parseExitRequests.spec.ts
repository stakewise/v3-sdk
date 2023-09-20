import { Network, configs } from 'helpers'
import { JsonRpcProvider, ZeroAddress } from 'ethers'
import { vaultMulticall, createContracts } from 'contracts'

import parseExitRequests, { ParseExitRequestsInput } from './parseExitRequests'


jest.mock('contracts')

describe('parseExitRequests function', () => {
  const network = Network.Mainnet
  const config = configs[network]

  const provider = new JsonRpcProvider(config.network.url)
  const contracts = createContracts({ provider, config })

  const input: ParseExitRequestsInput = {
    contracts,
    options: { network },  // Use appropriate network enum value
    userAddress: ZeroAddress,
    vaultAddress: ZeroAddress,
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
