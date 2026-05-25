export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Other'

export type Expense = {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
  user_id: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: Expense
        Insert: Omit<Expense, 'id' | 'created_at'>
        Update: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
