import { ZeroAddress } from 'ethers'

import tokens from '../constants/tokens'


export default {
  api: {
    backend: 'https://holesky-api.stakewise.io/graphql',
    subgraph: 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  network: {
    chainId: 17000,
    id: 'holesky',
    name: 'Holesky Testnet',
    hexadecimalChainId: '0x4268',
    url: 'https://ethereum-holesky.publicnode.com/',
    blockExplorerUrl: 'https://holesky.etherscan.io',
    nativeCurrency: {
      symbol: tokens.eth,
      name: 'Ethereum',
      decimals: 18,
    },
  },
  pages: {
    etherscan: 'https://holesky.etherscan.io',
    beaconchain: 'https://holesky.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x484871C6D54a3dAEBeBBDB0AB7a54c97D72986Bb',
      mintToken: '0x1fA3d360eeFA3ae8091A21eBAd234a61184e9827',
      v2RewardToken: ZeroAddress,
      v2StakedToken: ZeroAddress,
    },
    base: {
      keeper: '0xc3e8c8BA310b62540FBb5eB81c9028444D35e568',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0x8cE94676F28fAE24eBb4a0D6dc0bDCC0aDa10d2D',
      vaultsRegistry: '0x39B541dAA5B93bEE3a429d82c8cEcdFCE1b36566',
      sharedMevEscrow: '0xd7C4C59CB635Fcfef880A4a6Fd6563A582E1CFC1',
      mintTokenConfig: '0xC31ffC4CA45e4DDBFb88933C500115c87Cc543B5',
      mintTokenController: '0xB3BE6f7544393f6FbAd8b92B2D7328891a8d8C4b',
      rewardSplitterFactory: '0x4FeB4CD84A3b5e1f2dC3E472F2231C71687F16E1',
    },
    factories: {
      vault: '0xAd47f6F705a03D6a77b24d586428A3B83f6Cc92b',
      erc20Vault: '0xc13B362FBEbBc56Ee18496786fd5aDe0a3c6cF38',
      privateVault: '0x930b1DF55f1775eee2f7d527e61eBDE7d421F1Ee',
      erc20PrivateVault: '0x2d567070f1d14A915aF23Ec45875Ad643D4D73DF',
    },
    uniswap: {
      positionManager: ZeroAddress,
    },
  },
  tokens: {
    mintToken: tokens.osETH,
    nativeToken: tokens.eth,
    depositToken: tokens.eth,
    v2RewardToken: tokens.rETH2,
    v2StakedToken: tokens.sETH2,
  },
} as const
