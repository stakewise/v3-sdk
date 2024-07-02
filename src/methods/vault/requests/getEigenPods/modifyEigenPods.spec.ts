import { formatEther } from 'ethers'

import { Network } from '../../../../utils'

import type { ModifiedEigenPods } from './types'
import modifyEigenPods from './modifyEigenPods'


const network = Network.Mainnet

describe('modifyEigenPods function', () => {
  it('should correctly modify Eigen Pods', () => {
    const sampleInput: Parameters<typeof modifyEigenPods>[0] = {
      data: {
        eigenPods: [
          {

            createdAt: '1691309736',
            shares: '160000000000000000',
            address: '0x0000000000000000000000000000000000000000',
            operator: '0x0000000000000000000000000000000000000000',
            id: '0x285e4dcf02bfa8f8c6a656b85a565d962d1831556f5d2df03c082e9b82f4344f-52',
          },
        ],
      },
      network,
    }

    const expectedResult: ModifiedEigenPods = [
      {
        createdAt: 1691309736000,
        restaked: formatEther('160000000000000000'),
        podAddress: '0x0000000000000000000000000000000000000000',
        operator: '0x0000000000000000000000000000000000000000',
        owner: '0x285e4dcf02bfa8f8c6a656b85a565d962d1831556f5d2df03c082e9b82f4344f-52',
        link: `https://app.eigenlayer.xyz/operator/0x0000000000000000000000000000000000000000`,
      },
    ]

    const result = modifyEigenPods(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
