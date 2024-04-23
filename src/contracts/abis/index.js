import UniswapPositionManagerAbi from './UniswapPositionManagerAbi.json'
import RewardSplitterFactoryAbi from './RewardSplitterFactoryAbi.json'
import VestingEscrowFactoryAbi from './VestingEscrowFactoryAbi.json'
import MintTokenControllerAbi from './MintTokenControllerAbi.json'
import BlocklistVaultDiffAbi from './BlocklistVaultDiffAbi.json'
import PrivateVaultDiffAbi from './PrivateVaultDiffAbi.json'
import MintTokenConfigAbi from './MintTokenConfigAbi.json'
import VaultsRegistryAbi from './VaultsRegistryAbi.json'
import RewardSplitterAbi from './RewardSplitterAbi.json'
import V2RewardTokenAbi from './V2RewardTokenAbi.json'
import VestingEscrowAbi from './VestingEscrowAbi.json'
import VaultFactoryAbi from './VaultFactoryAbi.json'
import PriceOracleAbi from './PriceOracleAbi.json'
import UniswapPoolAbi from './UniswapPoolAbi.json'
import MulticallAbi from './MulticallAbi.json'
import UsdRateAbi from './UsdRateAbi.json'
import KeeperAbi from './KeeperAbi.json'
import VaultAbi from './VaultAbi.json'
import Erc20Abi from './Erc20Abi.json'


const PrivateVaultAbi = VaultAbi.concat(PrivateVaultDiffAbi)
const BlocklistVaultAbi = VaultAbi.concat(BlocklistVaultDiffAbi)


export {
  UniswapPositionManagerAbi,
  RewardSplitterFactoryAbi,
  VestingEscrowFactoryAbi,
  MintTokenControllerAbi,
  MintTokenConfigAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  BlocklistVaultAbi,
  V2RewardTokenAbi,
  VestingEscrowAbi,
  PrivateVaultAbi,
  VaultFactoryAbi,
  PriceOracleAbi,
  UniswapPoolAbi,
  MulticallAbi,
  UsdRateAbi,
  KeeperAbi,
  VaultAbi,
  Erc20Abi,
}
