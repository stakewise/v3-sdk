import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.mainnet,
  api: {
    backend: 'https://mainnet-api.stakewise.io/graphql',
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
      swise: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
      mintToken: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
      depositToken: ZeroAddress,
      v2RewardToken: '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
      v2StakedToken: '0xFe2e637202056d30016725477c5da089Ab0A043A',
    },
    base: {
      keeper: '0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5',
      oracles: '0x2f1C5E86B13a74f5A6E7B4b35DD77fe29Aa47514',
      multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
      priceOracle: '0x8023518b2192FB5384DAdc596765B3dD1cdFe471',
      vaultsRegistry: '0x3a0008a588772446f6e656133C2D5029CC4FC20E',
      sharedMevEscrow: '0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86',
      mintTokenConfigV1: '0xE8822246F8864DA92015813A39ae776087Fb1Cd5',
      mintTokenConfigV2: '0x287d1e2A8dE183A8bf8f2b09Fa1340fBd766eb59',
      merkleDistributor: '0xA3F21010e8b9a3930996C8849Df38f9Ca3647c20',
      depositDataRegistry: '0x75AB6DdCe07556639333d3Df1eaa684F5735223e',
      mintTokenController: '0x2A261e60FB14586B474C208b1B7AC6D0f5000306',
      rewardSplitterFactory: '0x256aF27ce81282A0491A5361172c1Db08f6cC5F8',
    },
    factories: {
      vault: '0xfaa05900019f6E465086bcE16Bb3F06992715D53',
      erc20Vault: '0x7a4F9912a812d932da57d73Cb5E5784B2c1cBA4A',

      privateVault: '0xb7832C9e93e54661354C8B88F3Ce7c0915f4C896',
      erc20PrivateVault: '0x58FDD303ab66722130C01533e7A1177f2b3a2949',

      blocklistVault: '0x4E3D8197c2cb9bCd29e3DCeAE3670d3d5e774017',
      erc20BlocklistVault: '0x1bE3Ad178d85CE1b6a7fCF5baEFe68F26541b07C',
    },
    special: {
      stakeCalculator: '0x29c708d94521af2c88402858049bd33e4606a3a2',
      leverageStrategy: ZeroAddress,
    },
  },
  tokens: {
    mintToken: constants.tokens.osETH,
    nativeToken: constants.tokens.eth,
    depositToken: constants.tokens.eth,
    v2RewardToken: constants.tokens.rETH2,
    v2StakedToken: constants.tokens.sETH2,
  },
} as const
