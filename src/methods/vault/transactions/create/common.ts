import { AbiCoder, MaxUint256 } from 'ethers'
import type { CreateVaultTransactionInput } from './types'
import { PayableOverrides } from '../../../../contracts/types/common'
import { constants, Network, validateArgs, VaultType } from '../../../../utils'
import validateCreateVaultArgs from './validateCreateVaultArgs'


export const commonLogic = async (values: CreateVaultTransactionInput) => {
  const {
    type = VaultType.Default, vaultToken, capacity, keysManagerFee, isOwnMevEscrow = false, metadataIpfsHash = '',
    contracts, userAddress, options,
  } = values

  validateArgs.address({ userAddress })
  validateCreateVaultArgs.vaultType(type)
  validateCreateVaultArgs.mevEscrow(isOwnMevEscrow)

  if (vaultToken) {
    validateCreateVaultArgs.vaultToken(vaultToken)
  }

  if (capacity) {
    validateArgs.bigint({ capacity })
    validateCreateVaultArgs.capacity(capacity)
  }

  if (keysManagerFee) {
    validateCreateVaultArgs.keysManagerFee(keysManagerFee)
  }

  const vaultFactories = vaultToken ? {
    [VaultType.Default]: contracts.factories.erc20Vault,
    [VaultType.Private]: contracts.factories.erc20PrivateVault,
    [VaultType.Blocklist]: contracts.factories.erc20BlocklistVault,
  } : {
    [VaultType.Default]: contracts.factories.vault,
    [VaultType.Private]: contracts.factories.privateVault,
    [VaultType.Blocklist]: contracts.factories.blocklistVault,
  }

  const vaultFactory = vaultFactories[type]
  const defaultAbiCoder = AbiCoder.defaultAbiCoder()

  const formattedParams = {
    feePercent: (keysManagerFee || 0) * 100,
    capacity: capacity || MaxUint256,
    symbol: vaultToken?.symbol,
    name: vaultToken?.name,
  }

  const encodedParams = vaultToken
    ? defaultAbiCoder.encode(
      [ 'tuple(uint256 capacity, uint16 feePercent, string name, string symbol, string metadataIpfsHash)' ],
      [ [ formattedParams.capacity, formattedParams.feePercent, formattedParams.name, formattedParams.symbol, metadataIpfsHash ] ]
    )
    : defaultAbiCoder.encode(
      [ 'tuple(uint256 capacity, uint16 feePercent, string metadataIpfsHash)' ],
      [ [ formattedParams.capacity, formattedParams.feePercent, metadataIpfsHash ] ]
    )

  const isStakeNativeToken = [ Network.Mainnet, Network.Holesky ].includes(options.network)
  const params: [ string, boolean, PayableOverrides ] = isStakeNativeToken
    ? [ encodedParams, isOwnMevEscrow, { value: constants.blockchain.gwei } ]
    : [ encodedParams, isOwnMevEscrow, {} ]

  return {
    vaultFactory,
    params,
  }
}
