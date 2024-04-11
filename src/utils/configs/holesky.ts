import { ZeroAddress } from 'ethers'

import tokens from '../constants/tokens'
import { Network } from '../enums'


export default {
  api: {
    backend: 'https://holesky-api.stakewise.io/graphql',
    subgraph: 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  network: {
    id: 'holesky',
    name: 'Holesky Testnet',
    chainId: Network.Holesky,
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
    beaconchain: 'https://holesky.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0x484871C6D54a3dAEBeBBDB0AB7a54c97D72986Bb',
      mintToken: '0xF603c5A3F774F05d4D848A9bB139809790890864',
      depositToken: ZeroAddress,
      v2RewardToken: ZeroAddress,
      v2StakedToken: ZeroAddress,
    },
    base: {
      keeper: '0xB580799Bf7d62721D1a523f0FDF2f5Ed7BA4e259',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0xe31FAf135A6047Cbe595F91B4b6802cDB9B46E2b',
      vaultsRegistry: '0xAa773c035Af95721C518eCd8250CadAC0AAB7ed0',
      sharedMevEscrow: '0xc98F25BcAA6B812a07460f18da77AF8385be7b56',
      mintTokenConfig: '0x4483965Ed85cd5e67f2a7a0EB462aCcC37b23D72',
      depositDataRegistry: ZeroAddress,
      mintTokenController: '0x7BbC1733ee018f103A9a9052a18fA9273255Cf36',
      rewardSplitterFactory: '0x6c56AC64457B8AeA1Bb8d1f5eA2d1E397C9c7a13',
    },
    balancer: {
      vault: ZeroAddress,
    },
    factories: {
      vault: '0x61E12791C717B80CcE1a50bC97548fA281493e2a',
      erc20Vault: '0x7a77934d32D78bFe8Dc1e23415b5679960a1c610',

      privateVault: '0x47Bf64605a71f5ea1FBE230735ab04669cC312D5',
      erc20PrivateVault: '0x93a3f880E07B27dacA6Ef2d3C23E77DBd6294487',

      blocklistVault: '0x0a57971758644A61279756591100c19e1691D068',
      erc20BlocklistVault: '0x0F8c209445282d937DaC0eA0a6706590250F9aFD',
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
  isTestnet: true,
} as const
