import validateList from './validateList'
import { validateArgs } from '../../../../../../utils'
import { vaultMulticall } from '../../../../../../contracts'


export type UpdateWhitelistParams = {
  whitelist: Array<{
    address: string
    isNew: boolean
  }>
}

const validateWhitelist = (whitelist: UpdateWhitelistParams['whitelist']) => {
  const isValid = validateList(whitelist)

  if (!isValid) {
    throw new Error('The "whitelist" argument must be an array of objects with "address" and "isNew" properties')
  }
}

const getParams = (values: UpdateWhitelistParams) => {
  const { whitelist } = values

  validateArgs.array({ whitelist })
  validateWhitelist(whitelist)

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = whitelist.map(({ address, isNew }) => ({
    method: 'updateWhitelist',
    args: [ address, isNew ],
  }))

  return params
}


export default getParams
