import { ZeroAddress } from 'ethers'

import constants from '../constants'


export default {
  network: constants.chains.chiado,
  api: {
    backend: 'https://chiado-api.stakewise.io/graphql',
    subgraph: 'https://graphs.stakewise.io/chiado/subgraphs/name/stakewise/prod',
  },
  pages: {
    beaconchain: 'https://beacon.chiadochain.net',
  },
  addresses: {
    tokens: {
      ssv: ZeroAddress,
      swise: '0x460d2c6c3254809949a7d0b4646ce15F77e9c545',
      mintToken: '0x0b4F6bFB694790051E0203Db83edbB5888099556',
      depositToken: '0x19C653Da7c37c66208fbfbE8908A5051B57b4C70',
      v2RewardToken: '0x14c74b1C7eCa8362D4ABcCd71051Ce174d61a3D4',
      v2StakedToken: '0xee2493a42861a0a49f88525c44aab8126d04b761',
    },
    base: {
      keeper: '0x5f31eD13eBF81B67a9f9498F3d1D2Da553058988',
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      priceOracle: '0x3CC131e6f6b975423151E5aaE8C466f4f81A8A4c',
      vaultsRegistry: '0x8750594B33516232e751C8B9C350a660cD5f1BB8',
      sharedMevEscrow: '0x453056f0bc4631abB15eEC656139f88067668E3E',
      mintTokenConfigV1: ZeroAddress,
      mintTokenConfigV2: '0x6D5957e075fd93b3B9F36Da93d7462F14387706d',
      depositDataRegistry: '0xFAce8504462AEb9BB6ae7Ecb206BD7B1EdF7956D',
      mintTokenController: '0x5518052f2d898f062ee59964004A560F24E2eE7d',
      rewardSplitterFactory: '0xC98a333aED3Cfb082842723aFA23692d3E801A3d',
    },
    factories: {
      vault: '0xD65DB6c716019D21b27b29D72cc105b805A9660e',
      erc20Vault: '0xaD582dB240b6232166A3d27aa08F029a1831074C',

      privateVault: '0x50Bd721909a222cF474eaB476e66a7032CA1E6b5',
      erc20PrivateVault: '0x01C2c9a99b16f1dB288558072249C8FA7241a35c',

      blocklistVault: '0x197C9CDc85B555787a4b7CA719aeB2c4197b4059',
      erc20BlocklistVault: '0x702D18D182aEf50aB008735b2234Db4A7147BE5A',
    },
    special: {
      stakeCalculator: '0x35704E96851d4aDd48475757b8f9bbb2390D9e4E',
      leverageStrategy: ZeroAddress,
    },
  },
  tokens: {
    ssv: constants.tokens.ssv,
    swise: constants.tokens.swise,
    mintToken: constants.tokens.osGNO,
    nativeToken: constants.tokens.xdai,
    depositToken: constants.tokens.gno,
    v2RewardToken: constants.tokens.rGNO,
    v2StakedToken: constants.tokens.sGNO,
  },
} as const
