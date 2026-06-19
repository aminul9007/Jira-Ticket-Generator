/** Prevents overlapping async operations (e.g. double-click generate). */
export class RequestLock {
  private locked = false

  isLocked(): boolean {
    return this.locked
  }

  async run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    if (this.locked) return undefined
    this.locked = true
    try {
      return await fn()
    } finally {
      this.locked = false
    }
  }
}
