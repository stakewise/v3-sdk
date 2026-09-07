type CapBoostApyInput = {
  apy: number
  vaultApy: number
  allocatorMaxBoostApy: number
}

const capBoostApy = (values: CapBoostApyInput): number => {
  const { apy, vaultApy, allocatorMaxBoostApy } = values

  if (!allocatorMaxBoostApy || allocatorMaxBoostApy <= vaultApy) {
    return apy
  }

  if (apy > allocatorMaxBoostApy) {
    return allocatorMaxBoostApy
  }

  return apy
}


export default capBoostApy
