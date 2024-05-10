import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.gnosis,
  api: {
    backend: 'https://api-gnosis.stakewise.io/graphql',
    subgraph: 'https://graph-gno.stakewise.io/subgraphs/name/stakewise/stakewise',
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
    },
    base: {
      keeper: ZeroAddress,
      multicall: '0xb5b692a88BDFc81ca69dcB1d924f59f0413A602a',
      priceOracle: ZeroAddress,
      vaultsRegistry: ZeroAddress,
      sharedMevEscrow: ZeroAddress,
      mintTokenConfig: ZeroAddress,
      depositDataRegistry: ZeroAddress,
      mintTokenController: ZeroAddress,
      rewardSplitterFactory: ZeroAddress,
    },
    balancer: {
      vault: ZeroAddress,
    },
    factories: {
      vault: ZeroAddress,
      erc20Vault: ZeroAddress,

      privateVault: ZeroAddress,
      erc20PrivateVault: ZeroAddress,

      blocklistVault: ZeroAddress,
      erc20BlocklistVault: ZeroAddress,
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
