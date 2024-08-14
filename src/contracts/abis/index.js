import RewardSplitterFactoryAbi from './RewardSplitterFactoryAbi.json'
import VestingEscrowFactoryAbi from './VestingEscrowFactoryAbi.json'
import MintTokenControllerAbi from './MintTokenControllerAbi.json'
import DepositDataRegistryAbi from './DepositDataRegistryAbi.json'
import BlocklistVaultDiffAbi from './BlocklistVaultDiffAbi.json'
import RestakingVaultDiffAbi from './RestakingVaultDiffAbi.json'
import MerkleDistributorAbi from './MerkleDistributorAbi.json'
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
import MulticallAbi from './MulticallAbi.json'
import UsdRateAbi from './UsdRateAbi.json'
import OraclesAbi from './OraclesAbi.json'
import KeeperAbi from './KeeperAbi.json'
import Erc20Abi from './Erc20Abi.json'
import InitialVaultAbi from './VaultAbi.json'


// ATTN temp solution to handle swapXdaiToGno, need to fix within https://app.clickup.com/t/8694zcfv8
const VaultAbi = InitialVaultAbi.concat(GnosisVaultDiffAbi)

const PrivateVaultAbi = VaultAbi.concat(PrivateVaultDiffAbi)
const BlocklistVaultAbi = VaultAbi.concat(BlocklistVaultDiffAbi)
const RestakingVaultAbi = VaultAbi.concat(RestakingVaultDiffAbi)

export {
  RewardSplitterFactoryAbi,
  VestingEscrowFactoryAbi,
  MintTokenControllerAbi,
  DepositDataRegistryAbi,
  MerkleDistributorAbi,
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
  MulticallAbi,
  OraclesAbi,
  UsdRateAbi,
  KeeperAbi,
  VaultAbi,
  Erc20Abi,
}
