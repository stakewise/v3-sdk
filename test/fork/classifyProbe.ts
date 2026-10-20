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

const classifyProbe = (result: ProbeResult): ProbeExpected | 'empty revert' => {
  if (!('error' in result)) {
    return 'success'
  }

  const { error } = result

  if (!error) {
    return 'empty revert'
  }

  const { name } = new ContractError(error as OriginalError)

  return contractErrorNames.includes(name) ? { error: name } : 'empty revert'
}


export default classifyProbe
