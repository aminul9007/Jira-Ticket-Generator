import { PROJECT_ATTRIBUTION_PREFIX } from '../../data/constants'
import { AuthorLink } from '../../components/AuthorLink'

export function PopupAttributionFooter() {
  return (
    <footer className="popup__attribution" aria-label="Project attribution">
      <p className="popup__attribution-credit">
        {PROJECT_ATTRIBUTION_PREFIX}{' '}
        <strong>
          <AuthorLink className="popup__attribution-link" />
        </strong>
      </p>
    </footer>
  )
}
