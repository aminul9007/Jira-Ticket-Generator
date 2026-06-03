import { BUG_CATEGORIES } from '../../data/constants'
import type { BugCategory } from '../../types/bugReport'
import { Label } from '../ui/Label'
import { Select } from '../ui/Select'

interface CategorySelectProps {
  value: BugCategory | ''
  onChange: (category: BugCategory | '') => void
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <div>
      <Label htmlFor="bug-category" required>
        Bug Category
      </Label>
      <Select
        id="bug-category"
        value={value}
        onChange={(e) => onChange(e.target.value as BugCategory | '')}
      >
        <option value="" disabled>
          Select a category
        </option>
        {BUG_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
    </div>
  )
}
