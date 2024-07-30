import { commonLogic } from './common'
import { getVaultMulticallGas } from '../../../utils'
import type { MulticallInput } from './types'
import { getMetadataHashMock } from '../util'


const multicallGas = async (props: MulticallInput) => {
  const { image, displayName, description, ...rest } = props
  const { provider } = rest

  const metadataIpfsHash = getMetadataHashMock({ image, displayName, description })
  const multicallArgs = await commonLogic({ metadataIpfsHash, ...rest })

  return getVaultMulticallGas({ ...multicallArgs, provider })
}


export default multicallGas
