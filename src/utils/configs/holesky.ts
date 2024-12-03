import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.holesky,
  api: {
    backend: 'https://holesky-api.stakewise.io/graphql',
    subgraph: 'https://graphs.stakewise.io/holesky/subgraphs/name/stakewise/prod',
  },
  pages: {
    beaconchain: 'https://holesky.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x484871C6D54a3dAEBeBBDB0AB7a54c97D72986Bb',
      mintToken: '0xF603c5A3F774F05d4D848A9bB139809790890864',
      depositToken: ZeroAddress,
      v2RewardToken: '0x2ee2E20702B5881a1171c5dbEd01C3d1e49Bf632',
      v2StakedToken: '0x91167861c590Fd68bEbE662951fBE30C9B23D759',
    },
    base: {
      keeper: '0xB580799Bf7d62721D1a523f0FDF2f5Ed7BA4e259',
      oracles: ZeroAddress,
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0xe31FAf135A6047Cbe595F91B4b6802cDB9B46E2b',
      vaultsRegistry: '0xAa773c035Af95721C518eCd8250CadAC0AAB7ed0',
      sharedMevEscrow: '0xc98F25BcAA6B812a07460f18da77AF8385be7b56',
      mintTokenConfigV1: '0x4483965Ed85cd5e67f2a7a0EB462aCcC37b23D72',
      mintTokenConfigV2: '0x124C33d07F94B31aDF87C12F7cA3a586d3510928',
      merkleDistributor: ZeroAddress,
      depositDataRegistry: '0xAC0F906E433d58FA868F936E8A43230473652885',
      mintTokenController: '0x7BbC1733ee018f103A9a9052a18fA9273255Cf36',
      rewardSplitterFactory: '0x2Ed24638b3aB48cF0076f19199c78A62bfEb5889',
    },
    factories: {
      vault: '0x215f4c69c3d1461c7aA38c9c73c27e10cFB0eeE4',
      erc20Vault: '0x439b60d3C886e711Dad30CF23a2BbD5388febcd9',

      privateVault: '0xedeBE792C6190Be612Cbe97F628137fAa8C36ee5',
      erc20PrivateVault: '0xaC9125646185Cb58e86E77d5f402eFa3fAfAFc84',

      blocklistVault: '0x5FCd8Bb2e3DDE5809b2106039B741C041bd49E4e',
      erc20BlocklistVault: '0xeBe12d858E55DDc5FC5A8153dC3e117824fbf5d2',
    },
    special: {
      stakeCalculator: '0x90b82e4b3aa385b4a02b7ebc1892a4bed6b5c465',
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
