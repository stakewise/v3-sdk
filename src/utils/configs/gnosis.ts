import { ZeroAddress } from 'ethers'

import tokens from '../constants/tokens'
import { Network } from '../enums'


export default {
  api: {
    backend: 'https://api-gnosis.stakewise.io/graphql',
    subgraph: 'https://graph-gno.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  network: {
    id: 'gnosis',
    name: 'Gnosis Chain',
    chainId: Network.Gnosis,
    hexadecimalChainId: '0x64',
    url: 'https://rpc.gnosischain.com',
    blockExplorerUrl: 'https://blockscout.com/xdai/mainnet',
    nativeCurrency: {
      symbol: tokens.xdai,
      name: tokens.xdai,
      decimals: 18,
    },
  },
  pages: {
    beaconchain: 'https://gnosis.beaconcha.in',
  },
  addresses: {
    tokens: {
      swise: '0xfdA94F056346d2320d4B5E468D6Ad099b2277746',
      mintToken: ZeroAddress,
      depositToken: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
      v2RewardToken: '0x6aC78efae880282396a335CA2F79863A1e6831D4',
      v2StakedToken: '0xA4eF9Da5BA71Cc0D2e5E877a910A37eC43420445',
      strk: ZeroAddress,
    },
    base: {
      keeper: ZeroAddress,
      priceOracle: ZeroAddress,
      vaultsRegistry: ZeroAddress,
      sharedMevEscrow: ZeroAddress,
      mintTokenConfig: ZeroAddress,
      mintTokenController: ZeroAddress,
      multicall: '0xb5b692a88BDFc81ca69dcB1d924f59f0413A602a',
      rewardSplitterFactory: ZeroAddress,
    },
    factories: {
      vault: ZeroAddress,
      erc20Vault: ZeroAddress,
      privateVault: ZeroAddress,
      erc20PrivateVault: ZeroAddress,
    },
    uniswap: {
      positionManager: ZeroAddress,
    },
  },
  tokens: {
    mintToken: tokens.osGNO,
    nativeToken: tokens.xdai,
    depositToken: tokens.gno,
    v2RewardToken: tokens.rGNO,
    v2StakedToken: tokens.sGNO,
  },
  isTestnet: false,
} as const
