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

  namespace action {
    function openPopup(): Promise<void>
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

  namespace storage {
    namespace local {
      function get(
        keys: string | string[] | Record<string, unknown> | null,
        callback: (items: Record<string, unknown>) => void,
      ): void

      function set(
        items: Record<string, unknown>,
        callback?: () => void,
      ): void

      function remove(keys: string | string[], callback?: () => void): void
    }
  }
}
