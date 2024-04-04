import { VoidSigner } from 'ethers'
import { createProvider } from '../../../utils'
import { MulticallRequestInput, ContractAbi } from '../types'


type Input = {
  contract: ContractAbi
  userAddress: string
  options: StakeWise.Options
  request: MulticallRequestInput
}

const getSignedContract = async (props: Input) => {
  const { contract, userAddress, request, options } = props
  const { callStatic, transactionData } = request

  const withSigner = !callStatic && !transactionData

  if (withSigner) {
    let signer

    if (options.provider) {
      signer = await options.provider.getSigner(userAddress)
    }
    else {
      const library = createProvider(options)

      signer = new VoidSigner(userAddress, library)
    }

    return contract.connect(signer)
  }

  return contract
}


export default getSignedContract
