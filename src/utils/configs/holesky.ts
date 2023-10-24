import tokens from '../constants/tokens'


export default {
  api: {
    backend: 'https://testnet-api.stakewise.io/graphql',
    subgraph: 'https://graph-holesky.stakewise.io/subgraphs/name/stakewise/stakewise/graphql',
  },
  network: {
    chainId: 5,
    id: 'holesky',
    name: 'Holesky Testnet',
    hexadecimalChainId: '0x4268',
    blockExplorerUrl: 'https://holesky.etherscan.io',
    url: 'https://holesky.infura.io/v3/84842078b09946638c03157f83405213',
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
      swise: '0x0e2497aACec2755d831E4AFDEA25B4ef1B823855',
      mintToken: '0x1fA3d360eeFA3ae8091A21eBAd234a61184e9827',
      v2RewardToken: '0x826f88d423440c305D9096cC1581Ae751eFCAfB0',
      v2StakedToken: '0x221D9812823DBAb0F1fB40b0D294D9875980Ac19',
    },
    base: {
      keeper: '0xc3e8c8BA310b62540FBb5eB81c9028444D35e568',
      multicall: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
      priceOracle: '0x8cE94676F28fAE24eBb4a0D6dc0bDCC0aDa10d2D',
      vaultsRegistry: '0x39B541dAA5B93bEE3a429d82c8cEcdFCE1b36566',
      mintTokenConfig: '0xC31ffC4CA45e4DDBFb88933C500115c87Cc543B5',
      sharedMevEscrow: '0xd7C4C59CB635Fcfef880A4a6Fd6563A582E1CFC1',
      rewardSplitterFactory: '0x4FeB4CD84A3b5e1f2dC3E472F2231C71687F16E1',
    },
    factories: {
      vault: '0xAd47f6F705a03D6a77b24d586428A3B83f6Cc92b',
      erc20Vault: '0xc13B362FBEbBc56Ee18496786fd5aDe0a3c6cF38',
      privateVault: '0x930b1DF55f1775eee2f7d527e61eBDE7d421F1Ee',
      erc20PrivateVault: '0x2d567070f1d14A915aF23Ec45875Ad643D4D73DF',
    },
    uniswap: {
      positionManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
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
