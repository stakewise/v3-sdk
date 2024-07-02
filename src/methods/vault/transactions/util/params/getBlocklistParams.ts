import validateList from './validateList'
import { vaultMulticall } from '../../../../../contracts'


export type UpdateBlocklistParams = {
  blocklist: Array<{
    address: string
    isNew: boolean
  }>
}

const getBlocklistParams = (values: UpdateBlocklistParams) => {
  const { blocklist } = values

  validateList({ blocklist })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = blocklist.map(({ address, isNew }) => ({
    method: 'updateBlocklist',
    args: [ address, isNew ],
  }))

  return params
}


export default getBlocklistParams
