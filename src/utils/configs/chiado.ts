import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.chiado,
  api: {
    backend: 'https://chiado-api.stakewise.io/graphql',
    subgraph: 'https://chiado-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  pages: {
    beaconchain: 'https://beacon.chiadochain.net',
  },
  addresses: {
    tokens: {
      swise: '0x460d2c6c3254809949a7d0b4646ce15F77e9c545',
      mintToken: '0x11Bd460C704b74Dc84Fce0C45d7dDA49EffCA59f',
      depositToken: '0x19C653Da7c37c66208fbfbE8908A5051B57b4C70',
      v2RewardToken: '0x0d6736e4ee767B1Bdfc1daeEfB74150643a50C15',
      v2StakedToken: '0x61A58F486c9E23D3ACB88792c50ddcdde7cda656',
    },
    base: {
      keeper: '0x13Af1266d8664aF3da4c711E7C86725D4779EA72',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0x6228CD90A4aB2949eb27763205dA288E23dC09d1',
      vaultsRegistry: '0x76C54Ec7E43974519eF72c283c2995B46A194a24',
      sharedMevEscrow: '0x069a8fF3cD84B2F861F9554E4b2c3FFA3F89b6bD',
      mintTokenConfigV1: ZeroAddress,
      mintTokenConfigV2: '0x80EF36dFf50a03d2333469122B08c0943bb55D97',
      depositDataRegistry: '0xf9eB9EAd3d71516bF5206F702B8BD0c183045474',
      mintTokenController: '0x28637130e692F821843eBAbeB8708dAB3F82cFa5',
      rewardSplitterFactory: '0x63De511Ff504E70109Bb8312d1329f2C88c14f77',
    },
    balancer: {
      vault: ZeroAddress,
    },
    factories: {
      vault: '0x3092C23185bCEFB440B0Bc8bFA1E340E40b3A410',
      erc20Vault: '0x951D3BAB6BebB42BEabf807df808b58a5c4FC55D',

      privateVault: '0xEBAF5bEbFb199D7c08fE82347C6D37914d07de70',
      erc20PrivateVault: '0x81feD710De1aC9D3D860F6C9aB4f150B1dfF621d',

      blocklistVault: '0x6e16fc22013e07B8C8e6d4b30280F44d42A60a97',
      erc20BlocklistVault: '0xdd9e0dBFb218fb17f0A2f96E77224e00dF095bf2',
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
