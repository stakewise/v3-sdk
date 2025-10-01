import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.mainnet,
  api: {
    backend: 'https://mainnet-api-b.stakewise.io/graphql',
    subgraph: [
      'https://graphs.stakewise.io/mainnet-a/subgraphs/name/stakewise/prod',
      'https://graphs.stakewise.io/mainnet-b/subgraphs/name/stakewise/prod',
    ],
  },
  pages: {
    beaconchain: 'https://beaconcha.in',
  },
  addresses: {
    tokens: {
      ssv: '0x9d65ff81a3c488d585bbfb0bfe3c7707c7917f54',
      obol: '0x0b010000b7624eb9b3dfbc279673c76e9d29d5f7',
      swise: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      mintToken: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
      depositToken: ZeroAddress,
      v2RewardToken: '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
      v2StakedToken: '0xFe2e637202056d30016725477c5da089Ab0A043A',
    },
    base: {
      keeper: '0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5',
      multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
      priceOracle: '0x8023518b2192FB5384DAdc596765B3dD1cdFe471',
      vaultsRegistry: '0x3a0008a588772446f6e656133C2D5029CC4FC20E',
      sharedMevEscrow: '0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86',
      mintTokenConfigV1: '0xE8822246F8864DA92015813A39ae776087Fb1Cd5',
      mintTokenConfigV2: '0x287d1e2A8dE183A8bf8f2b09Fa1340fBd766eb59',
      depositDataRegistry: '0x75AB6DdCe07556639333d3Df1eaa684F5735223e',
      mintTokenController: '0x2A261e60FB14586B474C208b1B7AC6D0f5000306',
      rewardSplitterFactory: '0xd12Df8543e0522CCbF12d231e822B7264c634775',
    },
    factories: {
      vault: '0x7A8cbBf690084E43De778173cfAcf7313c9122DD',
      erc20Vault: '0x97795DA27138BD8d79204D37F3A2e80fA4d30488',

      privateVault: '0x4C958642F1CD735F13aed02A4FB015153edDf8Fd',
      erc20PrivateVault: '0x1831834dC4Bf88B9d9183015e1285B105Ec2FdC9',

      blocklistVault: '0x608d8Ca6916b96edf63Dd429e62Fe1366ae6f3B5',
      erc20BlocklistVault: '0x39c6eef5f955bcC280966504bc5c82F2394Fa368',
    },
    special: {
      stakeCalculator: '0x75c57bd50A3EB7291Da3429956D3566E0153A38f',
      leverageStrategy: '0x48cD14FDB8e72A03C8D952af081DBB127D6281fc',
      leverageStrategyV2: '0x7575BC9E5168f27B97F9028905A2Adf91d2fF53d',
      merkleDistributorV2: '0xa9dc250dF4EE9273D09CFa455da41FB1cAC78d34',
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
