import { expect } from 'vitest'
import type { JsonRpcProvider } from 'ethers'

import type StakeWiseSDK from '../../src/StakeWiseSDK'
import type { HarvestParamsQueryPayload } from '../../src/graphql/subgraph/vault'

import type { GraphqlFixture } from '../fixtures/graphql'

import fork from './mocks/fork.json'


type Input = {
  sdk: StakeWiseSDK
  provider: JsonRpcProvider
  graphql: GraphqlFixture
  input: Parameters<StakeWiseSDK['osToken']['mint']>[0]
}

const mintToFork = async (values: Input) => {
  const { sdk, provider, graphql, input } = values

  const canHarvest = await sdk.contracts.base.keeper.canHarvest(input.vaultAddress)

  expect(canHarvest, 'the vault must be harvested by the setup deposit').toBe(false)

  const harvestParams = { ...fork.harvestParams, canHarvest: false }

  graphql.mock<HarvestParamsQueryPayload>({ name: 'HarvestParams', data: { harvestParams } })

  const hash = await sdk.osToken.mint(input)

  return provider.waitForTransaction(hash)
}


export default mintToFork
