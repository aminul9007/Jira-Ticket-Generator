import { useState } from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'
import {
  applyHistoryRetentionLimit,
  clearAllTicketHistory,
  exportTicketHistory,
  getTicketHistory,
} from '../../services/history/ticketHistoryService'
import type { HistoryRetentionCount } from '../../types/appSettings'
import { downloadJsonFile } from '../../utils/downloadJson'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { SettingsSelect } from './SettingsSelect'

interface DataHistorySectionProps {
  onHistoryCleared?: () => void
}

export function DataHistorySection({ onHistoryCleared }: DataHistorySectionProps) {
  const { settings, updateData } = useAppSettings()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleExport = () => {
    const records = exportTicketHistory()
    const stamp = new Date().toISOString().slice(0, 10)
    downloadJsonFile(`qa-ticket-history-${stamp}.json`, records)
  }

  const handleClear = () => {
    clearAllTicketHistory()
    setConfirmOpen(false)
    onHistoryCleared?.()
  }

  const recordCount = getTicketHistory().length

  return (
    <>
      <SettingsSelect
        fieldId="history-retention"
        label="Ticket history retention"
        hint={`Keeps up to this many tickets in local storage. Currently storing ${recordCount}.`}
        value={String(settings.data.historyRetention)}
        onChange={(e) => {
          updateData({
            historyRetention: Number(e.target.value) as HistoryRetentionCount,
          })
          applyHistoryRetentionLimit()
        }}
      >
        <option value="30">30 tickets</option>
        <option value="50">50 tickets</option>
        <option value="100">100 tickets</option>
      </SettingsSelect>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={handleExport}>
          Export History
        </Button>
        <Button type="button" variant="danger" onClick={() => setConfirmOpen(true)}>
          Clear History
        </Button>
      </div>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear ticket history?"
        description="This permanently deletes all generated tickets stored in this browser. This cannot be undone."
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleClear}>
              Delete all history
            </Button>
          </div>
        }
      >
        <p className="text-sm text-text-secondary">
          You have {recordCount} ticket{recordCount === 1 ? '' : 's'} saved locally.
        </p>
      </Modal>
    </>
  )
}
