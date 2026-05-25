import type { ExpenseCategory } from '../../types/database'

export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Health',
  'Other',
] as const satisfies readonly ExpenseCategory[]

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  Food: 'Food',
  Travel: 'Travel',
  Shopping: 'Shopping',
  Bills: 'Bills',
  Health: 'Health',
  Other: 'Other',
}
