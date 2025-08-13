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
      rewardSplitterFactory: '0x02dAC662FBda9f63dcbf98D610b2f29dA5dFf3cC',
    },
    factories: {
      vault: '0xA97Be1971781941eEA687A1d3027327757D8FEe4',
      erc20Vault: '0x759Fc6b3c960a07F1BA29A450fE3ADeB56D7b032',

      privateVault: '0x51F1BB9D033EF3e04c557EB65FAB7375572eD8B8',
      erc20PrivateVault: '0x3E6200c314D8f3E261b24d264FD7272c161ff674',

      blocklistVault: '0x4427Aa014Dd5CFF9e629492B0D62dE7aFA9c5e59',
      erc20BlocklistVault: '0x11a38091cCbcbAB14b9754C7aF5138c79020E8f7',
    },
    special: {
      stakeCalculator: '0xaE9A192Ed2030444eB9323C592F1b85801EA0Ec3',
      leverageStrategy: '0x154628AC72533aad39aBdcaE2055Dced0b4Eef4D',
      merkleDistributorV2: '0xc61847D6fc1F64162ff9f1D06205d9C4cDb2F239',
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
