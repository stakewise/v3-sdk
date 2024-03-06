import AbortPromise from './abortPromise'


const wrapAbortPromise = <Input, Output>(action: (props: Input) => Promise<Output>) => (
  (props: Input): AbortPromise<Output> => {
    return new AbortPromise<Output>(async (resolve, reject) => {
      try {
        const result = await action(props)

        return resolve(result)
      }
      catch (error) {
        return reject(error)
      }
    })
  }
)


export default wrapAbortPromise
