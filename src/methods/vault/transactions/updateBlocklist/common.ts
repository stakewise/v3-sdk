import { UpdateBlocklistInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


const validateList = (blocklist: UpdateBlocklistInput['blocklist']) => {
  const isValid = blocklist.every((blocklistItem) => (
    blocklistItem
    && typeof blocklistItem === 'object'
    && typeof blocklistItem.address === 'string'
    && typeof blocklistItem.isNew === 'boolean'
  ))

  if (!isValid) {
    throw new Error('The "blocklist" argument must be an array of objects with "address" and "isNew" properties')
  }
}

export const commonLogic = (values: UpdateBlocklistInput) => {
  const { options, contracts, userAddress, vaultAddress, blocklist } = values

  validateArgs.array({ blocklist })
  validateArgs.address({ vaultAddress, userAddress })
  validateList(blocklist)

  const multicallCommonArgs: Omit<Parameters<typeof vaultMulticall>[0], 'request'> = {
    vaultContract: contracts.helpers.createBlocklistVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = blocklist.map(({ address, isNew }) => ({
    method: 'updateBlocklist',
    args: [ address, isNew ],
  }))

  return {
    params,
    multicallCommonArgs,
  }
}
