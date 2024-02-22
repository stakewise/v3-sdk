import AbortPromise from './abortPromise'


const wrapAbortPromise = <Input, Output>(action: (props: Input) => Promise<Output>) => (
  (props: Input): AbortPromise<Output> => {
    return new AbortPromise<Output>(async (resolve) => {
      const result = await action(props)

      return resolve(result)
    })
  }
)


export default wrapAbortPromise
