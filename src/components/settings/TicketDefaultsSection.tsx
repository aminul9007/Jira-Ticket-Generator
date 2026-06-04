import { useAppSettings } from '../../hooks/useAppSettings'
import type { DefaultIssueType } from '../../types/appSettings'
import { Input } from '../ui/Input'
import { TagListEditor } from './TagListEditor'
import { SettingsField } from './SettingsField'
import { SettingsSelect } from './SettingsSelect'

export function TicketDefaultsSection() {
  const { settings, updateTicketDefaults } = useAppSettings()
  const { ticketDefaults } = settings

  return (
    <>
      <SettingsField
        id="default-project-key"
        label="Default project key"
        hint="Pre-fills Jira project when creating issues (future integration)."
      >
        <Input
          id="default-project-key"
          value={ticketDefaults.projectKey}
          placeholder="WEB"
          onChange={(e) =>
            updateTicketDefaults({ projectKey: e.target.value.toUpperCase() })
          }
        />
      </SettingsField>

      <SettingsSelect
        fieldId="default-issue-type"
        label="Default issue type"
        value={ticketDefaults.issueType}
        onChange={(e) =>
          updateTicketDefaults({ issueType: e.target.value as DefaultIssueType })
        }
      >
        <option value="Bug">Bug</option>
        <option value="Task">Task</option>
        <option value="Story">Story</option>
      </SettingsSelect>

      <TagListEditor
        id="default-labels"
        label="Default labels"
        hint="Applied when pushing tickets to Jira (future)."
        placeholder="frontend"
        values={ticketDefaults.labels}
        onChange={(labels) => updateTicketDefaults({ labels })}
      />

      <SettingsField
        id="default-assignee"
        label="Default assignee"
        hint="Optional Jira account ID or email for auto-assignment."
      >
        <Input
          id="default-assignee"
          value={ticketDefaults.assignee}
          placeholder="Optional"
          onChange={(e) => updateTicketDefaults({ assignee: e.target.value })}
        />
      </SettingsField>
    </>
  )
}
