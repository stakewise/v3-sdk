import { vi, onTestFinished } from 'vitest'

import type { Fixture } from './types'


const clock: Fixture<'clock'> = () => {
  onTestFinished(() => {
    vi.useRealTimers()
  })

  return vi.useFakeTimers()
}


export default clock
