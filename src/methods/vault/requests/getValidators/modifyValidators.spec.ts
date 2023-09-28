import { VaultValidatorsQueryPayload } from 'graphql/backend/vault'
import { Network, configs } from 'helpers'
import { formatEther } from 'ethers'

import modifyValidators from './modifyValidators'


describe('modifyValidators', () => {
  it('should modify validators data', () => {
    const mockData: VaultValidatorsQueryPayload = {
      vaults: [
        {
          validators: [
            {
              apy: '5.5',
              earned: '2',
              publicKey: 'testPublicKey',
              createdAt: '2023-05-05T12:00:00Z',
            },
          ],
        },
      ],
    }
    const mockNetwork = Network.Mainnet

    const expectedOutput = [
      {
        apy: '5.5',
        createdAt: new Date('2023-05-05T12:00:00Z').getTime(),
        earned: formatEther('2'),
        publicKey: 'testPublicKey',
        link: `${configs[mockNetwork].pages.beaconchain}/validator/testPublicKey`,
      },
    ]

    const result = modifyValidators({
      data: mockData,
      network: mockNetwork,
    })

    expect(result).toEqual(expectedOutput)
  })
})
