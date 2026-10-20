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
  input: Parameters<StakeWiseSDK['vault']['deposit']>[0]
}

const depositToFork = async (values: Input) => {
  const { sdk, provider, graphql, input } = values

  const canHarvest = await sdk.contracts.base.keeper.canHarvest(input.vaultAddress)

  expect(canHarvest, 'fixture does not match the fork block').toBe(true)

  graphql.mock<HarvestParamsQueryPayload>({ name: 'HarvestParams', data: { harvestParams: fork.harvestParams } })

  const hash = await sdk.vault.deposit(input)

  return provider.waitForTransaction(hash)
}


export default depositToFork
