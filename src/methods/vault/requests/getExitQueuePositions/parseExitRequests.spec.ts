import { JsonRpcProvider, ZeroAddress } from 'ethers'

import { Network, configs } from '../../../../utils'
import { createContracts } from '../../../../contracts'
import vaultMulticall from '../../../../contracts/vaultMulticall'
import parseExitRequests, { ParseExitRequestsInput } from './parseExitRequests'


jest.mock('../../../../contracts/vaultMulticall')

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
    totalShares: 1000n,
    options: { network },
    userAddress: ZeroAddress,
    vaultAddress: ZeroAddress,
    provider: getMockProvider(9999999999),
    exitRequests: [
      {
        positionTicket: 'positionTicket-1',
        timestamp: '123456',
        totalShares: '100',
      },
      {
        positionTicket: 'positionTicket-2',
        timestamp: '123456',
        totalShares: '200',
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
      ])
      .mockResolvedValueOnce([
        {
          claimedAssets: 30n,
          claimedShares: 50n,
          leftShares: 10n,
        },
        {
          claimedAssets: 1n,
          claimedShares: 100n,
          leftShares: 20n,
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
          positionTicket: 'positionTicket-1',
        },
        {
          exitQueueIndex: 2n,
          timestamp: '123456',
          positionTicket: 'positionTicket-2',
        },
      ],
      total: 131n,
      withdrawable: 31n,
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
      withdrawable: 0n,
    })
  })

  it('should handle mixed indexes from getExitQueueIndex', async () => {
    (vaultMulticall as jest.Mock)
      .mockResolvedValueOnce([
        [ -1n ],
        [ 1n ],
      ])
      .mockResolvedValueOnce([
        {
          leftShares: 10n,
          claimedShares: 50n,
          claimedAssets: 30n,
        },
      ])
      .mockResolvedValueOnce([ { assets: 50n } ])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      positions: [ {
        exitQueueIndex: 1n,
        timestamp: '123456',
        positionTicket: 'positionTicket-2',
      } ],
      total: 80n,
      withdrawable: 30n,
    })
  })

  it('should handle all newPositionTicket being 0', async () => {
    (vaultMulticall as jest.Mock)
      .mockResolvedValueOnce([
        [ 0n ],
        [ 1n ],
      ])
      .mockResolvedValueOnce([
        { leftShares: 0n, claimedShares: 0n, claimedAssets: 0n },
        { leftShares: 0n, claimedShares: 0n, claimedAssets: 0n },
      ])
      .mockResolvedValueOnce([ { assets: 0n } ])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      positions: [
        {
          exitQueueIndex: 0n,
          timestamp: '123456',
          positionTicket: 'positionTicket-1',
        },
        {
          exitQueueIndex: 1n,
          timestamp: '123456',
          positionTicket: 'positionTicket-2',
        },
      ],
      total: 0n,
      withdrawable: 0n,
    })
  })

  it('should handle remainingShares being 0', async () => {
    (vaultMulticall as jest.Mock)
      .mockResolvedValueOnce([
        [ 0n ],
        [ 1n ],
      ])
      .mockResolvedValueOnce([
        { leftShares: 10n, claimedShares: 1000n, claimedAssets: 30n },
      ])
      .mockResolvedValueOnce([])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      positions: [
        {
          exitQueueIndex: 0n,
          timestamp: '123456',
          positionTicket: 'positionTicket-1',
        },
        {
          exitQueueIndex: 1n,
          timestamp: '123456',
          positionTicket: 'positionTicket-2',
        },
      ],
      total: 30n,
      withdrawable: 30n,
    })
  })
})
