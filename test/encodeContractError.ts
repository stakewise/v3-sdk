import { Interface } from 'ethers'

import ErrorsAbi from '../src/helpers/wrapErrorHandler/ErrorsAbi.json'


const errorsInterface = new Interface(ErrorsAbi)

const encodeContractError = (name: string) => errorsInterface.encodeErrorResult(name, [])


export default encodeContractError
