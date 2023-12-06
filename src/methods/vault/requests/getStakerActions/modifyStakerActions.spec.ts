import modifyStakerActions from './modifyStakerActions'
import { Network, AllocatorActionType, configs } from '../../../../utils'


const network = Network.Mainnet
const explorerUrl = configs[network].network.blockExplorerUrl

describe('modifyStakerActions function', () => {
  it('should correctly modify allocator actions', () => {
    const sampleInput: Parameters<typeof modifyStakerActions>[0] = {
      data: {
        allocatorActions: [
          {
            createdAt: '1691309736',
            assets: '260000000000000000',
            shares: '160000000000000000',
            actionType: AllocatorActionType.Deposited,
            id: '0x285e4dcf02bfa8f8c6a656b85a565d962d1831556f5d2df03c082e9b82f4344f-52',
          },
          {
            createdAt: '1690890396',
            assets: '5000000000000000000',
            shares: '4000000000000000000',
            actionType: AllocatorActionType.Redeemed,
            id: '0x1898c66c9898f060352e13c8a74a7748749a5774e36dc30ade8b36fce16c4817-357',
          },
        ],
      },
      network,
    }

    const expectedResult = [
      {
        assets: '0.26',
        shares: '0.16',
        createdAt: 1691309736000,
        actionType: AllocatorActionType.Deposited,
        id: '0x285e4dcf02bfa8f8c6a656b85a565d962d1831556f5d2df03c082e9b82f4344f-52',
        link: `${explorerUrl}/tx/0x285e4dcf02bfa8f8c6a656b85a565d962d1831556f5d2df03c082e9b82f4344f`,
      },
      {
        assets: '5.0',
        shares: '4.0',
        createdAt: 1690890396000,
        actionType: AllocatorActionType.Redeemed,
        id: '0x1898c66c9898f060352e13c8a74a7748749a5774e36dc30ade8b36fce16c4817-357',
        link: `${explorerUrl}/tx/0x1898c66c9898f060352e13c8a74a7748749a5774e36dc30ade8b36fce16c4817`,
      },
    ]

    const result = modifyStakerActions(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
