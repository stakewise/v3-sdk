import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.chiado,
  api: {
    backend: 'https://chiado-api.stakewise.io/graphql',
    subgraph: 'https://chiado-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  pages: {
    beaconchain: 'https://gnosis.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x460d2c6c3254809949a7d0b4646ce15F77e9c545',
      mintToken: '0x2c72f8019BF6aab4D430f527DC35Ff8F903b7295',
      depositToken: '0x19C653Da7c37c66208fbfbE8908A5051B57b4C70',
      v2RewardToken: '0x3A945FD94A1d810B5e1c4536747F0de358d32854',
      v2StakedToken: '0x5da7d1De2e84047De2A7988a7E01B494d54284e7',
    },
    base: {
      keeper: '0x6DfF9E878a83A2d84ef5AC242705E08BF0F33fdD',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0xb948180A455ad82f5D1b2946F2972F6Cc15293a5',
      vaultsRegistry: '0x03d360c483014178bFB3d3c990448478b2Bf2575',
      sharedMevEscrow: '0xb7c8c515317490dbB0FF1809B09EABa6432B6A83',
      mintTokenConfig: '0xa567616A709dE0Ab69f12be0f0CD1bEABB9609AB',
      depositDataRegistry: '0x197292Fb9893Bc06329ee8E3Fd07d8ceF29E4d13',
      mintTokenController: '0x6d0e8Ceb65Ed8B954CBB8b32eaC034580ec07A59',
      rewardSplitterFactory: '0xa2D8b88EB39909dD5309542B3623eFA5640D5f24',
    },
    balancer: {
      vault: ZeroAddress,
    },
    factories: {
      vault: '0xfA14e7A35EA37c08eC006a15831dCC8eCcf2B51f',
      erc20Vault: '0x6A67A0caB72bF86a81A2E331949EC3890fcB37E5',

      privateVault: '0x1A9ADdd9ca10338cFd146578b5DfE3caAa660Dfa',
      erc20PrivateVault: '0xFD16734b47A570c7a446F879874A134dAa6ae496',

      blocklistVault: '0x4684FD7aEd17C389f39b23138260DfC4E05ca5Ca',
      erc20BlocklistVault: '0xFD6920C6D8D9f5a291B798B2F805d1c51CeEFaDe',
    },
    uniswap: {
      positionManager: ZeroAddress,
    },
  },
  tokens: {
    mintToken: constants.tokens.osGNO,
    nativeToken: constants.tokens.xdai,
    depositToken: constants.tokens.gno,
    v2RewardToken: constants.tokens.rGNO,
    v2StakedToken: constants.tokens.sGNO,
  },
} as const
