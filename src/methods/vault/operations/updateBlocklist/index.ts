import { vaultMulticall } from '../../../../contracts'
import { validateArgs } from '../../../../utils'
import { validateList } from '../util'


export type UpdateBlocklistParams = {
  blocklist: Array<{
    address: string
    isNew: boolean
  }>
}

const validateBlocklist = (blocklist: UpdateBlocklistParams['blocklist']) => {
  const isValid = validateList(blocklist)

  if (!isValid) {
    throw new Error('The "blocklist" argument must be an array of objects with "address" and "isNew" properties')
  }
}

export const getParams = (values: UpdateBlocklistParams) => {
  const { blocklist } = values

  validateArgs.array({ blocklist })
  validateBlocklist(blocklist)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = blocklist.map(({ address, isNew }) => ({
    method: 'updateBlocklist',
    args: [ address, isNew ],
  }))

  return params
}
