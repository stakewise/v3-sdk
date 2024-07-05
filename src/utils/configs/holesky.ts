import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.holesky,
  api: {
    backend: 'https://holesky-api.stakewise.io/graphql',
    subgraph: 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  pages: {
    beaconchain: 'https://holesky.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x484871C6D54a3dAEBeBBDB0AB7a54c97D72986Bb',
      mintToken: '0xF603c5A3F774F05d4D848A9bB139809790890864',
      depositToken: ZeroAddress,
      v2RewardToken: '0xd57c19f20168406d162852515030e00e49bB7781',
      v2StakedToken: '0xFb534BB912Eb83b7b629329195b8DF798Ea325b2',
    },
    base: {
      keeper: '0xB580799Bf7d62721D1a523f0FDF2f5Ed7BA4e259',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0xe31FAf135A6047Cbe595F91B4b6802cDB9B46E2b',
      vaultsRegistry: '0xAa773c035Af95721C518eCd8250CadAC0AAB7ed0',
      sharedMevEscrow: '0xc98F25BcAA6B812a07460f18da77AF8385be7b56',
      mintTokenConfigV1: '0x4483965Ed85cd5e67f2a7a0EB462aCcC37b23D72',
      mintTokenConfigV2: '0x191599BAF9ad40Ae28EeD7ee6F5C38B5325746E7',
      depositDataRegistry: '0xf25f9A254F38aF10Dc352bF8F446Dc09a820ca76',
      mintTokenController: '0x7BbC1733ee018f103A9a9052a18fA9273255Cf36',
      rewardSplitterFactory: '0x7Fcb1857011BAF51003018e9299deE9012de0967',
    },
    factories: {
      vault: '0xd68ef965D4E32b99Fd2D014Fc35304f3C273277E',
      erc20Vault: '0x10C5066FB5DA1C0D7eb189DE4dfA26d23e8e4aDa',

      privateVault: '0x09fD091483d64b3b9d5474F374ddFE6039F79aAd',
      erc20PrivateVault: '0x5da7d1De2e84047De2A7988a7E01B494d54284e7',

      blocklistVault: '0x473a94aBe8f173cac48A6213f61335E21B913875',
      erc20BlocklistVault: '0x3A945FD94A1d810B5e1c4536747F0de358d32854',
    },
    balancer: {
      vault: ZeroAddress,
    },
    uniswap: {
      positionManager: ZeroAddress,
    },
  },
  tokens: {
    mintToken: constants.tokens.osETH,
    nativeToken: constants.tokens.eth,
    depositToken: constants.tokens.eth,
    v2RewardToken: constants.tokens.rETH2,
    v2StakedToken: constants.tokens.sETH2,
  },
} as const
