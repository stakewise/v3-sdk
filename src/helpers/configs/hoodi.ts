import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.hoodi,
  api: {
    backend: 'https://hoodi-api.stakewise.io/graphql',
    subgraph: [
      'https://graphs.stakewise.io/hoodi/subgraphs/name/stakewise/prod',
      'https://graphs-replica.stakewise.io/hoodi/subgraphs/name/stakewise/prod',
    ],
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
      osTokenRedeemer: '0x3A422b2433f28CD123a8DE665887f7a040BF0258',
      mintTokenConfigV1: ZeroAddress,
      mintTokenConfigV2: '0x5b817621EBE00622b9a71b53c942b392751c8197',
      depositDataRegistry: '0x93a3f880E07B27dacA6Ef2d3C23E77DBd6294487',
      mintTokenController: '0x140Fc69Eabd77fFF91d9852B612B2323256f7Ac1',
      rewardSplitterFactory: '0xd12Df8543e0522CCbF12d231e822B7264c634775',
      curator: {
        v1: '0xD30E7e4bDbd396cfBe72Ad2f4856769C54eA6b0b',
        v2: '0x59EdC6edA87885e4A3e2beb9B55AF535a363b306',
      },
    },
    factories: {
      vault: '0x7A8cbBf690084E43De778173cfAcf7313c9122DD',
      erc20Vault: '0x97795DA27138BD8d79204D37F3A2e80fA4d30488',

      privateVault: '0x4C958642F1CD735F13aed02A4FB015153edDf8Fd',
      erc20PrivateVault: '0x1831834dC4Bf88B9d9183015e1285B105Ec2FdC9',

      blocklistVault: '0x608d8Ca6916b96edf63Dd429e62Fe1366ae6f3B5',
      erc20BlocklistVault: '0x39c6eef5f955bcC280966504bc5c82F2394Fa368',

      metavault: '0xB7cB12e10f4eb2E118c57cd67BBeAE027A1DA53d',
      erc20Metavault: '0x57582d566be7ebf9046CA015c8059132DAb85FD8',

      privateMetavault: '0x40471cE713EfB3CB83fF25A754b8BfA28D322A1b',
      erc20PrivateMetavault: '0xe3fc7aBcFFe4E313bDB5DAE7d1e9B1054d417A34',
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
