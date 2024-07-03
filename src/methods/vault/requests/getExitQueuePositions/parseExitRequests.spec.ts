import { JsonRpcProvider, ZeroAddress } from 'ethers'

import { Network, configs } from '../../../../utils'
import { createContracts } from '../../../../contracts'
import vaultMulticall from '../../../../contracts/multicall/vaultMulticall'
import parseExitRequests, { ParseExitRequestsInput } from './parseExitRequests'


jest.mock('../../../../contracts/multicall/vaultMulticall')

const getMockProvider = (timestamp: number) => ({
  getBlock() {
    return {
      timestamp,
    }
  },
}) as unknown as StakeWise.Provider

describe('parseExitRequests function', () => {
  const network = Network.Holesky
  const config = configs[network]

  const provider = new JsonRpcProvider(config.network.url)
  const contracts = createContracts({ provider, config })

  const input: ParseExitRequestsInput = {
    contracts,
    options: { network },
    userAddress: ZeroAddress,
    vaultAddress: ZeroAddress,
    provider: getMockProvider(9999999999),
    exitRequests: [
      {
        positionTicket: 'positionTicket-1',
        withdrawalTimestamp: '1718536919',
        timestamp: '123456',
        totalAssets: '0',
        totalShares: '100',
      },
      {
        positionTicket: 'positionTicket-2',
        withdrawalTimestamp: '1718536919',
        timestamp: '123457',
        totalAssets: '0',
        totalShares: '200',
      },
      {
        positionTicket: 'positionTicket-2',
        withdrawalTimestamp: '1718536919',
        timestamp: '123458',
        totalAssets: '300',
        totalShares: '0',
      },
    ],
  }

  beforeEach(() => {
    (vaultMulticall as jest.Mock).mockClear()
  })

  it('should parse exit requests correctly', async () => {
    (vaultMulticall as jest.Mock)
      .mockResolvedValueOnce([
        [ 1n ],
        [ 2n ],
        [ 3n ],
      ])
      .mockResolvedValueOnce([
        {
          exitedAssets: 30n,
          exitedTickets: 50n,
          leftTickets: 10n,
        },
        {
          exitedAssets: 1n,
          exitedTickets: 100n,
          leftTickets: 20n,
        },
        {
          exitedAssets: 250n,
          exitedTickets: 200n,
          leftTickets: 30n,
        },
      ])
      .mockResolvedValueOnce([
        { assets: 100n },
      ])

    const result = await parseExitRequests(input)

    expect(vaultMulticall).toHaveBeenCalledTimes(3)

    expect(result).toEqual({
      positions: [
        {
          exitQueueIndex: 1n,
          timestamp: '123456',
          isV1Position: true,
          positionTicket: 'positionTicket-1',
        },
        {
          exitQueueIndex: 2n,
          timestamp: '123457',
          isV1Position: true,
          positionTicket: 'positionTicket-2',
        },
        {
          exitQueueIndex: 3n,
          timestamp: '123458',
          isV1Position: false,
          positionTicket: 'positionTicket-2',
        },
      ],
      total: 431n,
      duration: 1718536919,
      withdrawable: 281n,
    })
  })

  it('should hide the position if it hasn\'t been 24 hours', async () => {
    (vaultMulticall as jest.Mock)
      .mockResolvedValueOnce([
        [ 1n ],
        [ 2n ],
      ])
      .mockResolvedValueOnce([
        { assets: 100n },
      ])

    const result = await parseExitRequests({
      ...input,
      provider: getMockProvider(1),
    })

    expect(vaultMulticall).toHaveBeenCalledTimes(2)

    expect(result).toEqual({
      total: 100n,
      duration: 0,
      positions: [],
      withdrawable: 0n,
    })
  })

  it('should handle -1 indexes from getExitQueueIndex', async () => {
    (vaultMulticall as jest.Mock)
      .mockResolvedValueOnce([
        [ -1n ],
        [ -1n ],
      ])
      .mockResolvedValueOnce([ { assets: 50n } ])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      positions: [],
      total: 50n,
      duration: 0,
      withdrawable: 0n,
    })
  })

  it('should handle mixed indexes from getExitQueueIndex', async () => {
    (vaultMulticall as jest.Mock)
      .mockResolvedValueOnce([
        [ -1n ],
        [ 1n ],
        [ -1n ],
      ])
      .mockResolvedValueOnce([
        {
          leftTickets: 10n,
          exitedTickets: 50n,
          exitedAssets: 30n,
        },
      ])
      .mockResolvedValueOnce([ { assets: 50n } ])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      positions: [ {
        exitQueueIndex: 1n,
        timestamp: '123457',
        isV1Position: true,
        positionTicket: 'positionTicket-2',
      } ],
      total: 380n,
      duration: 1718536919,
      withdrawable: 30n,
    })
  })

  it('should handle all newPositionTicket being 0', async () => {
    (vaultMulticall as jest.Mock)
      .mockResolvedValueOnce([
        [ 0n ],
        [ 1n ],
        [ 1n ],
      ])
      .mockResolvedValueOnce([
        { leftTickets: 0n, exitedTickets: 100n, exitedAssets: 101n },
        { leftTickets: 0n, exitedTickets: 200n, exitedAssets: 202n },
        { leftTickets: 0n, exitedTickets: 300n, exitedAssets: 300n },
      ])
      .mockResolvedValueOnce([ { assets: 0n } ])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      positions: [
        {
          exitQueueIndex: 0n,
          timestamp: '123456',
          isV1Position: true,
          positionTicket: 'positionTicket-1',
        },
        {
          exitQueueIndex: 1n,
          timestamp: '123457',
          isV1Position: true,
          positionTicket: 'positionTicket-2',
        },
        {
          exitQueueIndex: 1n,
          timestamp: '123458',
          isV1Position: false,
          positionTicket: 'positionTicket-2',
        },
      ],
      total: 603n,
      duration: 1718536919,
      withdrawable: 603n,
    })
  })
})
