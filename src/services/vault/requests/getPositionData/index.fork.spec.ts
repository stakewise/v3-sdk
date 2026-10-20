import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import mockGraphql from '../../../../../test/mockGraphql'
import { useForkSdk } from '../../../../../test/fork'
import { allocatorPosition } from '../../../../../test/mocks/positionData'

import type { PositionDataQueryPayload } from '../../../../graphql/subgraph/vault'


const oneShare = parseEther('1')

describe('getPositionData', () => {
  const { sdk, snapshot } = useForkSdk()
  const vaultAddress = getAddress(snapshot.vaultAddress)

  it('osToken rate', async () => {
    mockGraphql<PositionDataQueryPayload>({
      name: 'PositionData',
      data: { ...allocatorPosition.positionData, leverageStrategyPositions: [] },
    })

    const positionData = await sdk.vault.getPositionData({ userAddress, vaultAddress })

    const oneShareAssets = await sdk.contracts.base.mintTokenController.convertToAssets(oneShare)

    expect(positionData.vault?.apyData.osTokenRate).toBe(oneShareAssets)
  })
})
