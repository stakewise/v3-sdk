import tokens from '../constants/tokens'
import { ZeroAddress } from 'ethers'


export default {
  api: {
    backend: 'https://testnet-api.stakewise.io/graphql',
    subgraph: 'https://testnet-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  network: {
    chainId: 5,
    id: 'goerli',
    name: 'Goerli Testnet',
    hexadecimalChainId: '0x5',
    url: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213',
    blockExplorerUrl: 'https://goerli.etherscan.io',
    nativeCurrency: {
      symbol: tokens.eth,
      name: 'Ethereum',
      decimals: 18,
    },
  },
  pages: {
    etherscan: 'https://goerli.etherscan.io',
    beaconchain: 'https://goerli.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x0e2497aACec2755d831E4AFDEA25B4ef1B823855',
      mintToken: '0xBcF097a3d3D846934694C47058A3cc9D5A6f7457',
      v2RewardToken: '0x826f88d423440c305D9096cC1581Ae751eFCAfB0',
      v2StakedToken: '0x221D9812823DBAb0F1fB40b0D294D9875980Ac19',
    },
    base: {
      keeper: '0x893ceb1cF23475defE3747670EbE4b40e629c6fD',
      multicall: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
      priceOracle: '0xe977B1fADBD28Dff25b093Dd48c02b07921F15E4',
      vaultsRegistry: '0xA7b1A1469b6eCAF941E0Bb8d5BB50C572072Ec20',
      sharedMevEscrow: '0xb793c3D2Cec1d0F35fF88BCA7655B88A44669e4B',
      mintTokenConfig: '0x7869Fb1988554197d17F5aA846c98F7b01E8ddAc',
      mintTokenController: '0xBcF097a3d3D846934694C47058A3cc9D5A6f7457',
      rewardSplitterFactory: '0x6A0A71220Bd8864Deee6d8ABc0113B5589ECf2f8',
    },
    factories: {
      vault: '0x872870F43AD54e69CaC28456a9f397FCDcd4345C',
      erc20Vault: '0xD19dC15d0275c79984B69B961E77DA5D91E7125B',
      privateVault: '0xB3BE6f7544393f6FbAd8b92B2D7328891a8d8C4b',
      erc20PrivateVault: '0x21C199766Bb6cD4217f02A496f01D1AD41F799a9',
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
