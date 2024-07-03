import UniswapPositionManagerAbi from './UniswapPositionManagerAbi.json'
import RewardSplitterFactoryAbi from './RewardSplitterFactoryAbi.json'
import VestingEscrowFactoryAbi from './VestingEscrowFactoryAbi.json'
import MintTokenControllerAbi from './MintTokenControllerAbi.json'
import DepositDataRegistryAbi from './DepositDataRegistryAbi.json'
import BlocklistVaultDiffAbi from './BlocklistVaultDiffAbi.json'
import RestakingVaultDiffAbi from './RestakingVaultDiffAbi.json'
import MintTokenConfigV1Abi from './MintTokenConfigV1Abi.json'
import MintTokenConfigV2Abi from './MintTokenConfigV2Abi.json'
import PrivateVaultDiffAbi from './PrivateVaultDiffAbi.json'
import OtherTokenVaultAbi from './OtherTokenVaultAbi.json'
import GnosisVaultDiffAbi from './GnosisVaultDiffAbi.json'
import VaultsRegistryAbi from './VaultsRegistryAbi.json'
import RewardSplitterAbi from './RewardSplitterAbi.json'
import V2RewardTokenAbi from './V2RewardTokenAbi.json'
import EigenPodOwnerAbi from './EigenPodOwnerAbi.json'
import VestingEscrowAbi from './VestingEscrowAbi.json'
import VaultFactoryAbi from './VaultFactoryAbi.json'
import PriceOracleAbi from './PriceOracleAbi.json'
import UniswapPoolAbi from './UniswapPoolAbi.json'
import MulticallAbi from './MulticallAbi.json'
import UsdRateAbi from './UsdRateAbi.json'
import KeeperAbi from './KeeperAbi.json'
import Erc20Abi from './Erc20Abi.json'
import InitialVaultAbi from './VaultAbi.json'


// ATTN temp solution to handle swapXdaiToGno, need to fix within https://app.clickup.com/t/8694zcfv8
const VaultAbi = InitialVaultAbi.concat(GnosisVaultDiffAbi)

const PrivateVaultAbi = VaultAbi.concat(PrivateVaultDiffAbi)
const BlocklistVaultAbi = VaultAbi.concat(BlocklistVaultDiffAbi)
const RestakingVaultAbi = VaultAbi.concat(RestakingVaultDiffAbi)

const GnosisVaultAbi = (() => {
  const copyVaultAbi = JSON.parse(JSON.stringify(VaultAbi))
  const burnIndex = VaultAbi.findIndex(({ name }) => name === 'burnOsToken')

  // Mainnet has uint128
  copyVaultAbi[burnIndex].inputs[0].type = 'uint256'

  return copyVaultAbi
})()

export {
  UniswapPositionManagerAbi,
  RewardSplitterFactoryAbi,
  VestingEscrowFactoryAbi,
  MintTokenControllerAbi,
  DepositDataRegistryAbi,
  MintTokenConfigV1Abi,
  MintTokenConfigV2Abi,
  OtherTokenVaultAbi,
  VaultsRegistryAbi,
  RestakingVaultAbi,
  RewardSplitterAbi,
  BlocklistVaultAbi,
  V2RewardTokenAbi,
  EigenPodOwnerAbi,
  VestingEscrowAbi,
  PrivateVaultAbi,
  VaultFactoryAbi,
  PriceOracleAbi,
  UniswapPoolAbi,
  GnosisVaultAbi,
  MulticallAbi,
  UsdRateAbi,
  KeeperAbi,
  VaultAbi,
  Erc20Abi,
}
