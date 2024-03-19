import { UpdateWhitelistInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


const validateList = (whitelist: UpdateWhitelistInput['whitelist']) => {
  const isValid = whitelist.every((whitelistItem) => (
    whitelistItem
    && typeof whitelistItem === 'object'
    && typeof whitelistItem.address === 'string'
    && typeof whitelistItem.isNew === 'boolean'
  ))

  if (!isValid) {
    throw new Error('The "whitelist" argument must be an array of objects with "address" and "isNew" properties')
  }
}

export const commonLogic = (values: UpdateWhitelistInput) => {
  const { options, contracts, userAddress, vaultAddress, whitelist } = values

  validateArgs.array({ whitelist })
  validateArgs.address({ vaultAddress, userAddress })
  validateList(whitelist)

  const multicallCommonArgs: Omit<Parameters<typeof vaultMulticall>[0], 'request'> = {
    vaultContract: contracts.helpers.createPrivateVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = whitelist.map(({ address, isNew }) => ({
    method: 'updateWhitelist',
    args: [ address, isNew ],
  }))

  return {
    params,
    multicallCommonArgs,
  }
}
