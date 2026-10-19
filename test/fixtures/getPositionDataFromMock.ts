import type { AbortPromise } from '../../src/modules/gql-module'
import type { PositionData } from '../../src/services/vault/requests/getPositionData'
import type { PositionDataQueryPayload, BoostProxyApyDataQueryPayload } from '../../src/graphql/subgraph/vault'

import { positionUserAddress, osTokenTotalAssets, osTokenTotalSupply } from '../mocks/positionData'

import type { Fixture } from './types'


type PositionMock = {
  vaultAddress: string
  positionData: PositionDataQueryPayload
  boostProxyApyData: BoostProxyApyDataQueryPayload
}

export type GetPositionDataFromMockFixture = (position: PositionMock) => AbortPromise<PositionData>

type Dependencies = 'sdk' | 'runner' | 'graphql'

const getPositionDataFromMock: Fixture<'getPositionDataFromMock', Dependencies> = ({ sdk, runner, graphql }) => (
  (position: PositionMock) => {
    const { vaultAddress, positionData, boostProxyApyData } = position
    const mintTokenControllerContract = sdk.contracts.base.mintTokenController
    const convertToAssets = ([ shares ]: bigint[]) => [ shares * osTokenTotalAssets / osTokenTotalSupply ]

    runner.on(mintTokenControllerContract, { convertToAssets })

    graphql.mock<PositionDataQueryPayload>({ name: 'PositionData', data: positionData })
    graphql.mock<BoostProxyApyDataQueryPayload>({ name: 'BoostProxyApyData', data: boostProxyApyData })

    return sdk.vault.getPositionData({ userAddress: positionUserAddress, vaultAddress })
  }
)


export default getPositionDataFromMock
