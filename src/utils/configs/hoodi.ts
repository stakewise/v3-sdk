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
      rewardSplitterFactory: '0x3b7084088d5fff385E6F834bd00EB30D17cb01bB',
    },
    factories: {
      vault: '0x1f0BB366daDCFb6b0E160C91824800E446D040D5',
      erc20Vault: '0x8BE70FBD0bF9577afF94f27144A1EfacAA9FF885',

      privateVault: '0x7212A20cc0679b22f794F5E36F94Ae4BA3513aB7',
      erc20PrivateVault: '0x5293D058c276e157F5F6F7BAd5A85FE20d6b4138',

      blocklistVault: '0x675A6f7e3eEE510E0ee4c83e0BA3076988de1085',
      erc20BlocklistVault: '0x92F5546d0F351D9Bc49DF760944DE61225c53a47',
    },
    special: {
      stakeCalculator: '0xaE9A192Ed2030444eB9323C592F1b85801EA0Ec3',
      leverageStrategy: ZeroAddress,
    },
  },
  tokens: {
    ssv: constants.tokens.ssv,
    swise: constants.tokens.swise,
    mintToken: constants.tokens.osETH,
    nativeToken: constants.tokens.eth,
    depositToken: constants.tokens.eth,
    v2RewardToken: constants.tokens.rETH2,
    v2StakedToken: constants.tokens.sETH2,
  },
} as const
