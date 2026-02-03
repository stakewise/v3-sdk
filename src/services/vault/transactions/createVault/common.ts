import type { CreateVaultTransactionInput } from './types'
import getVaultFactory from '../../requests/getVaultFactory'
import { validateCreateVaultArgs, getEncodeBytes } from './helpers'
import { PayableOverrides } from '../../../../contracts/types/common'
import { constants, Network, validateArgs, VaultType } from '../../../../helpers'


export const commonLogic = async (values: CreateVaultTransactionInput) => {
  const {
    options,
    capacity,
    vaultToken,
    userAddress,
    keysManagerFee,
    isOwnMevEscrow = false,
    type = VaultType.Default,
  } = values

  const isMainnet = [ Network.Mainnet, Network.Hoodi ].includes(options.network)
  const isMetaVault = [ VaultType.MetaVault, VaultType.PrivateMetaVault ].includes(type)

  const vaultFactory = getVaultFactory({
    ...values,
    isErc20: Boolean(vaultToken),
    vaultType: type,
  })

  validateArgs.address({ userAddress })
  validateCreateVaultArgs.vaultType(type)
  validateCreateVaultArgs.metaVault({ type, vaultToken, isMainnet, isOwnMevEscrow })

  if (!isMetaVault) {
    validateCreateVaultArgs.mevEscrow(isOwnMevEscrow)
  }

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

  const encodedParams = getEncodeBytes({ ...values, isMetaVault })

  const params: [ string, boolean, PayableOverrides ] = isMainnet
    ? [ encodedParams, isOwnMevEscrow, { value: constants.blockchain.gwei } ]
    : [ encodedParams, isOwnMevEscrow, {} ]

  if (isMetaVault) {
    // MetaVault does not support isOwnMevEscrow
    params.splice(1, 1)
  }

  return {
    vaultFactory,
    isMetaVault,
    params,
  }
}
