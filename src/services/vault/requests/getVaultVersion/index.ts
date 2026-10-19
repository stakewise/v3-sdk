import type * as z from 'zod/mini'

import { wrapAbortPromise } from '../../../../modules/gql-module'

import { validate, validateSchema } from './validate'


export type GetVaultVersionInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getVaultVersion = async (input: GetVaultVersionInput) => {
  const { contracts } = input

  const { vaultAddress } = validate(input)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })
  const version = await vaultContract.version()

  const isV1Version = version === 1n
  const isV2Version = version === 2n

  const isMoreV1 = version > 1n
  const isMoreV2 = version > 2n

  return {
    version: Number(version),
    isV1Version,
    isV2Version,
    isMoreV1,
    isMoreV2,
  }
}


export default wrapAbortPromise(getVaultVersion)
