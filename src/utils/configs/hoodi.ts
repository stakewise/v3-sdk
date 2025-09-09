import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.hoodi,
  api: {
    backend: 'https://hoodi-api.stakewise.io/graphql',
    subgraph: 'https://graphs.stakewise.io/hoodi/subgraphs/name/stakewise/prod',
  },
  pages: {
    beaconchain: 'https://hoodi.beaconcha.in/',
  },
  addresses: {
    tokens: {
      ssv: ZeroAddress,
      obol: ZeroAddress,
      swise: '0x3c5634a5437A394353F49fe04FE5db11961c5c2D',
      mintToken: '0x7345fC8268459413beE9e9dd327f31283C65Ee7e',
      depositToken: ZeroAddress,
      v2RewardToken: '0x75c57bd50A3EB7291Da3429956D3566E0153A38f',
      v2StakedToken: '0xe684eD3e740A3fD62e86b6bD6a8865e070568BCa',
    },
    base: {
      keeper: '0xA7D1Ac9D6F32B404C75626874BA56f7654c1dC0f',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0xe8a222D887b468a71Ee8a27df4fa3b886A4B7BA1',
      vaultsRegistry: '0xf16fea93D3253A401C3f73B0De890C6586740B25',
      sharedMevEscrow: '0x51FD45BAEfB12f54766B5C4d639b360Ea50063bd',
      mintTokenConfigV1: ZeroAddress,
      mintTokenConfigV2: '0x5b817621EBE00622b9a71b53c942b392751c8197',
      depositDataRegistry: '0x93a3f880E07B27dacA6Ef2d3C23E77DBd6294487',
      mintTokenController: '0x140Fc69Eabd77fFF91d9852B612B2323256f7Ac1',
      rewardSplitterFactory: '0x765860f5B231aB597e308adAf667851107924Ad6',
    },
    factories: {
      vault: '0xbb4e0ec6BcEbD583DC1A1c1123557eeadC4f8769',
      erc20Vault: '0x1669875a4f9f549C5F878cf5d2d5D5a01cbA162d',

      privateVault: '0xbb91b06C6038F9be3E0CE9C4192f152837dA5F55',
      erc20PrivateVault: '0x886A7Ca996003F77b70890a94c2C1ca9d64099C0',

      blocklistVault: '0xE0766385879F16Ff626C2651d254131A4675DB43',
      erc20BlocklistVault: '0xEC739F8DE9576c342Cd16A0FfBd58A8d5D72E5e4',
    },
    special: {
      stakeCalculator: '0xaE9A192Ed2030444eB9323C592F1b85801EA0Ec3',
      leverageStrategy: '0x154628AC72533aad39aBdcaE2055Dced0b4Eef4D',
      leverageStrategyV2: '0xe382BD0c48A7dd435bE911e0f663cbCAa94AF965',
      merkleDistributorV2: '0xc61847D6Fc1F64162fF9F1d06205D9c4cDb2f239',
    },
  },
  tokens: {
    ssv: constants.tokens.ssv,
    obol: constants.tokens.obol,
    swise: constants.tokens.swise,
    mintToken: constants.tokens.osETH,
    nativeToken: constants.tokens.eth,
    depositToken: constants.tokens.eth,
    v2RewardToken: constants.tokens.rETH2,
    v2StakedToken: constants.tokens.sETH2,
  },
} as const
