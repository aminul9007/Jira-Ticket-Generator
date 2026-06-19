import type { DefaultIssueType } from '../../types/appSettings'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'

interface JiraFieldsSectionProps {
  defaults: ExtensionJiraDefaults
  onChange: (patch: Partial<ExtensionJiraDefaults>) => void
  projectError?: string | null
  issueTypeError?: string | null
}

export function JiraFieldsSection({
  defaults,
  onChange,
  projectError,
  issueTypeError,
}: JiraFieldsSectionProps) {
  return (
    <section className="popup__jira-section">
      <h2 className="popup__footer-title">Jira</h2>

      <div className="popup__section">
        <label className="popup__label" htmlFor="jira-project">
          Jira Project
        </label>
        <input
          id="jira-project"
          className={`popup__input${projectError ? ' popup__input--invalid' : ''}`}
          placeholder="WEB"
          value={defaults.projectKey}
          onChange={(event) =>
            onChange({ projectKey: event.target.value.toUpperCase() })
          }
          aria-invalid={Boolean(projectError)}
          aria-describedby={projectError ? 'jira-project-error' : undefined}
        />
        {projectError && (
          <p id="jira-project-error" className="popup__field-error">
            {projectError}
          </p>
        )}
      </div>

      <div className="popup__section">
        <label className="popup__label" htmlFor="jira-issue-type">
          Issue Type
        </label>
        <select
          id="jira-issue-type"
          className={`popup__select${issueTypeError ? ' popup__input--invalid' : ''}`}
          value={defaults.issueType}
          onChange={(event) =>
            onChange({ issueType: event.target.value as DefaultIssueType })
          }
          aria-invalid={Boolean(issueTypeError)}
          aria-describedby={issueTypeError ? 'jira-issue-type-error' : undefined}
        >
          <option value="Bug">Bug</option>
          <option value="Task">Task</option>
          <option value="Story">Story</option>
        </select>
        {issueTypeError && (
          <p id="jira-issue-type-error" className="popup__field-error">
            {issueTypeError}
          </p>
        )}
      </div>

      <div className="popup__section">
        <label className="popup__label" htmlFor="jira-assignee">
          Assignee
          <span className="popup__label-optional"> (optional)</span>
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
          <span className="popup__label-optional"> (optional)</span>
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
