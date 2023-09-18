import { Network } from 'helpers'

import * as methods from './methods'


type Methods = typeof methods

type CheckArgs<Obj extends Record<PropertyKey, unknown>> = [ keyof Obj ] extends [ never ] ? [] : [ Obj ]

type ModifyRequests<T extends Record<string, any>> = {
  [K in keyof T]: (...values: CheckArgs<Omit<Parameters<T[K]>[0], 'network'>>) => ReturnType<T[K]>
}

type CreateRequestsInput = {
  network: Network
}

type CreateRequestsOutput = ModifyRequests<Methods>

const createRequests = (input: CreateRequestsInput): CreateRequestsOutput => (
  Object.keys(methods).reduce((acc, method) => {
    const fn = methods[method as keyof typeof methods]

    return {
      ...acc,
    [method]: (values: unknown) => fn({ ...(values || {}), network: input.network } as any),
    }
  }, {} as CreateRequestsOutput)
)


export default createRequests
