import type { CheckInput } from './types'


type Action<Input, Output> = (props: Input) => Promise<Output>

const checkAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const restakingVaultContract = contracts.helpers.createVault({
      options: { isRestake: true },
      vaultAddress,
    })

    const restakeOperatorsManager = await restakingVaultContract.restakeOperatorsManager()
    const hasAccess = restakeOperatorsManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the restake operators manager to perform this action')
    }
  }
  catch {}
}

const checkRestakeOperatorsManagerAccess = <Input, Output>(action: Action<Input, Output>) => (
  async (values: Input) => {
    try {
      const result = await action(values)

      return result
    }
    catch (actionError) {
      return checkAccess(values as unknown as CheckInput)
        .then(
          () => Promise.reject(actionError),
          (error) => Promise.reject(error)
        )
    }
  }
)


export default checkRestakeOperatorsManagerAccess
