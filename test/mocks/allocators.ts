import type { AllocatorsQueryPayload } from '../../src/graphql/subgraph/allocator'


export const allocatorsPayload: AllocatorsQueryPayload = {
  allocators: [
    {
      apy: '9.274427522130059400241018692299731',
      assets: '3711145378128715532',
      totalEarnedAssets: '55037136560082430',
      totalStakeEarnedAssets: '10864133128366538',
      totalBoostEarnedAssets: '44173003431715892',
    },
  ],
}

export const emptyAllocatorsPayload: AllocatorsQueryPayload = { allocators: [] }
