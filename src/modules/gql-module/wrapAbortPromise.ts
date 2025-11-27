import AbortPromise from './abortPromise'


const wrapAbortPromise = <Input, Output>(action: (values: Input) => Promise<Output>) => (
  (values: Input): AbortPromise<Output> => {
    return new AbortPromise<Output>(async (resolve, reject) => {
      try {
        const result = await action(values)

        return resolve(result)
      }
      catch (error) {
        return reject(error)
      }
    })
  }
)


export default wrapAbortPromise
