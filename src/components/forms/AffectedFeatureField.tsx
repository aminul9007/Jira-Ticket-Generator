import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'

interface AffectedFeatureFieldProps {
  value: string
  onChange: (value: string) => void
}

export function AffectedFeatureField({ value, onChange }: AffectedFeatureFieldProps) {
  return (
    <FormField>
      <Label
        htmlFor="affected-feature"
        hint="Screen, module, or URL — improves titles and routing"
      >
        Affected Feature / Page
      </Label>
      <Input
        id="affected-feature"
        type="text"
        placeholder="e.g. Checkout, User Profile, /settings/billing"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={200}
      />
    </FormField>
  )
}
