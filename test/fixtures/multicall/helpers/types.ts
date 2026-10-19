import type { BaseContract } from 'ethers'

import type { MulticallParameter, MulticallRequestInput } from '../../../../src/contracts/ownMulticalls/types'


type Run = (request: MulticallRequestInput) => Promise<any>

export type CheckInput = {
  run: Run
  contract: BaseContract
  params: MulticallParameter[]
  names: string[]
}

export type CheckCallStaticInput = {
  run: Run
  contract: BaseContract
  params: MulticallParameter[]
  values: unknown[][]
}
