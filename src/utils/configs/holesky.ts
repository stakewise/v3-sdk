import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.holesky,
  api: {
    backend: 'https://holesky-api-b.stakewise.io/graphql',
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
      vault: '0x3acDBdbf0459d376dF9378c02Af50c83dc7646e9',
      erc20Vault: '0x7aa02B4Cf39f98FfEB324325775f840d18549733',

      privateVault: '0x453056f0bc4631abB15eEC656139f88067668E3E',
      erc20PrivateVault: '0xDecb606ee9140f229Df78F9E40041EAD61610F8f',

      blocklistVault: '0x0b4F6bFB694790051E0203Db83edbB5888099556',
      erc20BlocklistVault: '0xd19E4B1d680a6aA672b08ebf483381bc0C9c8478',
    },
    special: {
      stakeCalculator: '0x8381012Dad419808125F009351732af36d4e1507',
      leverageStrategy: '0xdB38cfc6e98a34Cdc60c568f607417E646C75B34',
    },
  },
  tokens: {
    swise: constants.tokens.swise,
    mintToken: constants.tokens.osETH,
    nativeToken: constants.tokens.eth,
    depositToken: constants.tokens.eth,
    v2RewardToken: constants.tokens.rETH2,
    v2StakedToken: constants.tokens.sETH2,
  },
} as const
