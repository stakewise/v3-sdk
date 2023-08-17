import { isAddress } from 'ethers'


const validateAddress = (address: string) => {
  if (!isAddress(address)) {
    throw new Error('Valid address is required')
  }
}


export default validateAddress
