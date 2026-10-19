import type { PositionDataQueryPayload, BoostProxyApyDataQueryPayload } from '../../src/graphql/subgraph/vault'


export const positionUserAddress = '0xec01cb780202595ce2fb11225aabfad201b54e0f'

export const osTokenTotalAssets = 4329827079651370114575n
export const osTokenTotalSupply = 4230152989944622053125n

const osToken = {
  apy: '0.08070751844537142857142857142857143',
  feePercent: 500,
}

const aave = {
  borrowApy: '0.500000000256',
  leverageMaxBorrowLtvPercent: '929999999995000000',
}

const osTokenHolder = {
  balance: '2266692295708583108',
}

export const allocatorPosition = {
  vaultAddress: '0xf92eff17ac8cef8e45dec00abdcd8788ecf83309',
  positionData: {
    vaults: [
      {
        apy: '2.133815312040782060628400725740101',
        isOsTokenEnabled: true,
        isCollateralized: true,
        allocatorMaxBoostApy: '10.4973469181154493',
        osTokenConfig: {
          ltvPercent: '900000000000000000',
          leverageMaxMintLtvPercent: '998000000000000000',
        },
      },
    ],
    allocators: [
      {
        assets: '3710862651233533935',
        exitingAssets: '200006337236577684',
        mintedOsTokenShares: '3097350165031248540',
      },
    ],
    osToken,
    aave,
    leverageStrategyPositions: [
      {
        proxy: '0xd411a10c97a640c221d92f960289c2081c2b78cc',
        assets: '44200348906598570',
        exitingAssets: '0',
        osTokenShares: '3381925724504392761',
        exitingOsTokenShares: '0',
        exitRequest: null,
      },
    ],
    osTokenHolder,
  } satisfies PositionDataQueryPayload,
  boostProxyApyData: {
    allocators: [
      {
        assets: '19741928518957294165',
        mintedOsTokenShares: '17444397368145616153',
      },
    ],
    aavePositions: [
      {
        borrowedAssets: '19697728170050695595',
      },
    ],
    osTokenExitRequests: [],
  } satisfies BoostProxyApyDataQueryPayload,
  subgraph: {
    apy: '10.02445766225788146479430004138036',
  },
  formula: {
    totalAssets: '4002143596991925850',
  },
}

export const stakerPosition = {
  vaultAddress: '0x15639e82d2072fa510e5d2b5f0db361c823bcad3',
  positionData: {
    vaults: [
      {
        apy: '-0.64114046920727858027189279476147468',
        isOsTokenEnabled: true,
        isCollateralized: true,
        allocatorMaxBoostApy: '-15.4672227762794392',
        osTokenConfig: {
          ltvPercent: '999900000000000000',
          leverageMaxMintLtvPercent: '998000000000000000',
        },
      },
    ],
    allocators: [
      {
        assets: '2202362770101229261',
        exitingAssets: '1501992510803812899',
        mintedOsTokenShares: '2169752604121706809',
      },
    ],
    osToken,
    aave,
    leverageStrategyPositions: [
      {
        proxy: '0x64925aafa84327a49db4f000d5c14a986a93f5f4',
        assets: '0',
        exitingAssets: '0',
        osTokenShares: '955992475514628548',
        exitingOsTokenShares: '0',
        exitRequest: null,
      },
    ],
    osTokenHolder,
  } satisfies PositionDataQueryPayload,
  boostProxyApyData: {
    allocators: [
      {
        assets: '12914635274551094529',
        mintedOsTokenShares: '12699915834846779409',
      },
    ],
    aavePositions: [
      {
        borrowedAssets: '12940537384892338110',
      },
    ],
    osTokenExitRequests: [],
  } satisfies BoostProxyApyDataQueryPayload,
  subgraph: {
    apy: '-3.3752112874593361251749475196870022',
  },
  formula: {
    totalAssets: '4782097438455656026',
  },
}
