type Action<Input, Output> = (props: Input) => Promise<Output>
type Check<Input> = (props: Input) => Promise<boolean | null>

type CheckAccessCommonInput<Input, Output> = {
  action: Action<Input, Output>
  check: Check<Input>
  error: string
}

const checkAccessCommon = <Input, Output>({ action, check, error }: CheckAccessCommonInput<Input, Output>): Action<Input, Output> => (
  async (props) => {
    try {
      const result = await action(props)

      return result
    } catch (actionError) {
      const hasAccess = await check(props)

      if (hasAccess === false) {
        return Promise.reject(error)
      }

      return Promise.reject(actionError)
    }
  }
)


export default checkAccessCommon
