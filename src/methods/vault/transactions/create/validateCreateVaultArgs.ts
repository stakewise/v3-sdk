import { MaxUint256 } from 'ethers'
import { VaultType, constants } from '../../../../utils'


const capacity = (value: bigint) => {
  if (value < constants.blockchain.amount32) {
    throw new Error(`The "capacity" argument must be at least ${constants.blockchain.amount32}`)
  }
  if (value > MaxUint256) {
    throw new Error(`The "capacity" argument must be at most ${MaxUint256}`)
  }
}

const mevEscrow = (value: unknown) => {
  if (typeof value !== 'boolean') {
    throw new Error(`The "isOwnMevEscrow" argument must be of boolean type`)
  }
}

const vaultType = (value: VaultType) => {
  const vaultTypes = Object.values(VaultType)
  const isValidType = vaultTypes.includes(value)

  if (!isValidType) {
    throw new Error(`The "type" argument must be one of the following: ${vaultTypes.join(', ')}`)
  }
}

const vaultToken = (vaultToken: { name: string, symbol: string }) => {
  if (typeof vaultToken !== 'object') {
    throw new Error(`The "vaultToken" argument must be an object`)
  }

  const missingParams = Object.keys(vaultToken)
    .filter((key) => typeof vaultToken[key as keyof typeof vaultToken] !== 'string')

  if (missingParams.length) {
    const args = missingParams.map((key) => `"vaultToken.${key}"`).join(', ')

    throw new Error(`The ${args} ${missingParams.length === 1 ? 'argument' : 'arguments'} must be a string`)
  }

  const emptyParams = Object.keys(vaultToken)
    .filter((key) => !vaultToken[key as keyof typeof vaultToken])

  if (emptyParams.length) {
    const args = emptyParams.map((key) => `"vaultToken.${key}"`).join(', ')

    throw new Error(`The ${args} ${missingParams.length === 1 ? 'argument' : 'arguments'} must be not empty string`)
  }
}

const keysManagerFee = (value: number) => {
  if (value < 0) {
    throw new Error(`The "capacity" argument must be at least 0`)
  }
  if (value > 100) {
    throw new Error(`The "capacity" argument must be at most 100`)
  }

  const decimals = value.toString().split('.')[1]?.length

  if (decimals > 2) {
    throw new Error(`The "capacity" argument must have at most two decimal places`)
  }
}


export default {
  capacity,
  mevEscrow,
  vaultType,
  vaultToken,
  keysManagerFee,
}
