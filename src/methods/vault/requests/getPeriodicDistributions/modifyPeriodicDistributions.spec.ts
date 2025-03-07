import type { PeriodicDistributionsQueryPayload } from '../../../../graphql/subgraph/vault'

import modifyPeriodicDistributions from './modifyPeriodicDistributions'


describe('modifyPeriodicDistributions', () => {
  it('should modify PeriodicDistributions data', () => {
    const mockData: PeriodicDistributionsQueryPayload = {
      periodicDistributions: [
        {
          apy: '0.5',
          token: '0x9d65ff81a3c488d585bbfb0bfe3c7707c7917f54',
        },
        {
          apy: '0.5',
          token: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
        },
        {
          apy: '0.5',
          token: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
        },
        {
          apy: '1.5',
          token: '0x9d65ff81a3c488d585bbfb0bfe3c7707c7917f54',
        },
        {
          apy: '2.5',
          token: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
        },
        {
          apy: '3.5',
          token: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
        },
      ],
    }

    const expectedOutput = [
      {
        apy: '2',
        token: '0x9d65ff81a3c488d585bbfb0bfe3c7707c7917f54',
      },
      {
        apy: '3',
        token: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      },
      {
        apy: '4',
        token: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
      },
    ]

    const result = modifyPeriodicDistributions({
      data: mockData,
    })

    expect(result).toEqual(expectedOutput)
  })
})
