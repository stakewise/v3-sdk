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
      rewardSplitterFactory: '0x80353898B72417AC5701a9809A9eF63F691BdE86',
    },
    factories: {
      vault: '0x508e82B5119CCfB923C387d62D2Ae7B56Df79906',
      erc20Vault: '0xBb1B3E55315967c65133A0e942d8EA7a992aF6C7',

      privateVault: '0x9115E176C3d034339036194c3EB7014Ef04A2e4b',
      erc20PrivateVault: '0x76D90928645065b4D4212eE62ce1ba8f90718f14',

      blocklistVault: '0xE2121568066C0a9d794bbB95D0Ade0ebd81cCaf9',
      erc20BlocklistVault: '0x4E3dE90882B3d10D067b8954909D4A4b0Bb390D0',
    },
    special: {
      stakeCalculator: '0xaE9A192Ed2030444eB9323C592F1b85801EA0Ec3',
      leverageStrategy: ZeroAddress,
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
