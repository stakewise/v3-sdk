import validateList from './validateList'
import { vaultMulticall } from '../../../../../../contracts'


export type UpdateWhitelistParams = {
  whitelist: Array<{
    address: string
    isNew: boolean
  }>
}

const getParams = (values: UpdateWhitelistParams) => {
  const { whitelist } = values

  validateList({ whitelist })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = whitelist.map(({ address, isNew }) => ({
    method: 'updateWhitelist',
    args: [ address, isNew ],
  }))

  return params
}


export default getParams
