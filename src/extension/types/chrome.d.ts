/** Minimal Chrome extension API types for Phase 2 foundation. */

declare namespace chrome {
  namespace tabs {
    interface Tab {
      url?: string
      title?: string
    }

    function query(
      queryInfo: { active?: boolean; currentWindow?: boolean },
      callback: (tabs: Tab[]) => void,
    ): void
  }

  namespace runtime {
    const id: string | undefined
    const lastError: { message?: string } | undefined

    function getURL(path: string): string

    const onInstalled: {
      addListener(callback: () => void): void
    }
  }

  namespace commands {
    const onCommand: {
      addListener(callback: (command: string) => void): void
    }
  }
}
