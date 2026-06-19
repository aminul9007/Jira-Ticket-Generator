import { describe, expect, it, vi, beforeEach } from 'vitest'
import { RequestLock } from './requestLock'

describe('RequestLock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('blocks overlapping runs', async () => {
    const lock = new RequestLock()
    let concurrent = 0
    let maxConcurrent = 0

    const task = async () => {
      concurrent += 1
      maxConcurrent = Math.max(maxConcurrent, concurrent)
      await new Promise((resolve) => setTimeout(resolve, 10))
      concurrent -= 1
      return 'done'
    }

    const first = lock.run(task)
    const second = lock.run(task)

    await vi.runAllTimersAsync()

    const [a, b] = await Promise.all([first, second])
    expect(a).toBe('done')
    expect(b).toBeUndefined()
    expect(maxConcurrent).toBe(1)

    vi.useRealTimers()
  })
})
