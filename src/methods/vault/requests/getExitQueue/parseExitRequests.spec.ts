import { JsonRpcProvider, ZeroAddress } from 'ethers'

import { Network, configs } from '../../../../utils'
import { createContracts } from '../../../../contracts'
import vaultMulticall from '../../../../contracts/vaultMulticall'
import parseExitRequests, { ParseExitRequestsInput } from './parseExitRequests'


jest.mock('../../../../contracts/vaultMulticall')

describe('parseExitRequests function', () => {
  const network = Network.Goerli
  const config = configs[network]

  const provider = new JsonRpcProvider(config.network.url)
  const contracts = createContracts({ provider, config })

  const input: ParseExitRequestsInput = {
    contracts,
    options: { network },
    totalShares: 1000n,
    userAddress: ZeroAddress,
    vaultAddress: ZeroAddress,
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
      .mockResolvedValueOnce([
        [ 1n ],
        [ 2n ],
      ])
      .mockResolvedValueOnce([
        {
          claimedAssets: 30n,
          claimedShares: 50n,
          newPositionTicket: 10n,
        },
        {
          claimedAssets: 1n,
          claimedShares: 100n,
          newPositionTicket: 20n,
        },
      ])
      .mockResolvedValueOnce([
        { assets: 100n },
      ])

    const result = await parseExitRequests(input)

    expect(vaultMulticall).toHaveBeenCalledTimes(3)

    expect(result).toEqual({
      data: [
        { exitQueueIndex: 1n, positionTicket: 'positionTicket-1' },
        { exitQueueIndex: 2n, positionTicket: 'positionTicket-2' },
      ],
      total: 100n,
      withdrawable: 31n,
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
      data: [],
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
          newPositionTicket: 10n,
          claimedShares: 50n,
          claimedAssets: 30n,
        },
      ])
      .mockResolvedValueOnce([ { assets: 50n } ])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      data: [ { exitQueueIndex: 1n, positionTicket: 'positionTicket-2' } ],
      total: 50n,
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
        { newPositionTicket: 0n, claimedShares: 0n, claimedAssets: 0n },
        { newPositionTicket: 0n, claimedShares: 0n, claimedAssets: 0n },
      ])
      .mockResolvedValueOnce([ { assets: 0n } ])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      data: [
        { exitQueueIndex: 0n, positionTicket: 'positionTicket-1' },
        { exitQueueIndex: 1n, positionTicket: 'positionTicket-2' },
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
        { newPositionTicket: 10n, claimedShares: 1000n, claimedAssets: 30n },
      ])
      .mockResolvedValueOnce([])

    const result = await parseExitRequests(input)

    expect(result).toEqual({
      data: [
        { exitQueueIndex: 0n, positionTicket: 'positionTicket-1' },
        { exitQueueIndex: 1n, positionTicket: 'positionTicket-2' },
      ],
      total: 0n,
      withdrawable: 30n,
    })
  })
})
