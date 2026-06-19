import type { DefaultIssueType } from '../../types/appSettings'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'

interface JiraFieldsSectionProps {
  defaults: ExtensionJiraDefaults
  onChange: (patch: Partial<ExtensionJiraDefaults>) => void
}

export function JiraFieldsSection({ defaults, onChange }: JiraFieldsSectionProps) {
  return (
    <section className="popup__jira-section">
      <h2 className="popup__footer-title">Jira</h2>

      <div className="popup__section">
        <label className="popup__label" htmlFor="jira-project">
          Jira Project
        </label>
        <input
          id="jira-project"
          className="popup__input"
          placeholder="WEB"
          value={defaults.projectKey}
          onChange={(event) =>
            onChange({ projectKey: event.target.value.toUpperCase() })
          }
        />
      </div>

      <div className="popup__section">
        <label className="popup__label" htmlFor="jira-issue-type">
          Issue Type
        </label>
        <select
          id="jira-issue-type"
          className="popup__select"
          value={defaults.issueType}
          onChange={(event) =>
            onChange({ issueType: event.target.value as DefaultIssueType })
          }
        >
          <option value="Bug">Bug</option>
          <option value="Task">Task</option>
          <option value="Story">Story</option>
        </select>
      </div>

      <div className="popup__section">
        <label className="popup__label" htmlFor="jira-assignee">
          Assignee
        </label>
        <input
          id="jira-assignee"
          className="popup__input"
          placeholder="Optional account ID or email"
          value={defaults.assignee}
          onChange={(event) => onChange({ assignee: event.target.value })}
        />
      </div>

      <div className="popup__section">
        <label className="popup__label" htmlFor="jira-reporter">
          Reporter
        </label>
        <input
          id="jira-reporter"
          className="popup__input"
          placeholder="Optional account ID or email"
          value={defaults.reporter}
          onChange={(event) => onChange({ reporter: event.target.value })}
        />
      </div>
    </section>
  )
}
