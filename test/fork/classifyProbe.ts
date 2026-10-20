import { ErrorFragment, Interface } from 'ethers'

import ErrorsAbi from '../../src/helpers/wrapErrorHandler/ErrorsAbi.json'
import ContractError from '../../src/helpers/wrapErrorHandler/ContractError'


export type ProbeExpected = 'success' | { error: string }

type ProbeResult = {
  value?: unknown
  error?: unknown
}

type OriginalError = ConstructorParameters<typeof ContractError>[0]

const contractErrorNames = new Interface(ErrorsAbi).fragments
  .filter(ErrorFragment.isFragment)
  .map(({ name }) => name)

const classifyProbe = ({ error }: ProbeResult): ProbeExpected | 'empty revert' => {
  if (!error) {
    return 'success'
  }

  const { name } = error instanceof ContractError ? error : new ContractError(error as OriginalError)

  return contractErrorNames.includes(name) ? { error: name } : 'empty revert'
}


export default classifyProbe
