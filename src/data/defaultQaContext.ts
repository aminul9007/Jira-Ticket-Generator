import { BUG_CATEGORIES, ENVIRONMENTS } from './constants'
import type { QaContextSettings } from '../types/qaContext'

export const DEFAULT_QA_CONTEXT: QaContextSettings = {
  productName: '',
  commonEnvironments: [...ENVIRONMENTS],
  commonFeatures: [],
  commonBugCategories: [...BUG_CATEGORIES],
}
