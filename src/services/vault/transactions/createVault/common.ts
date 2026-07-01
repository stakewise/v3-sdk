import getVaultFactory from '../../requests/getVaultFactory'
import { constants, Network, VaultType } from '../../../../helpers'
import { PayableOverrides } from '../../../../contracts/types/common'


import type { CreateVaultTransactionInput } from './types'
import { validateCreateVaultArgs, getEncodeBytes } from './helpers'


export const commonLogic = async (values: CreateVaultTransactionInput) => {
  const {
    options,
    vaultToken,
    isOwnMevEscrow = false,
    type = VaultType.Default,
  } = values

  const isMainnet = [ Network.Mainnet, Network.Hoodi ].includes(options.network)
  const isMetaVault = [ VaultType.MetaVault, VaultType.PrivateMetaVault ].includes(type)

  const vaultFactory = getVaultFactory({
    ...values,
    isErc20: Boolean(vaultToken),
    vaultType: type,
  }) as typeof isMetaVault extends true
    ? StakeWise.ABI.MetaVaultFactory
    : StakeWise.ABI.VaultFactory


  validateCreateVaultArgs({ ...values, type, isOwnMevEscrow, isMainnet })

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
    params,
  }
}
