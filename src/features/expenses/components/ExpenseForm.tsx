import { useEffect, useState } from 'react'

import { supabase } from '../../../lib/supabase/client'
import type { Expense, ExpenseCategory } from '../../../types/database'
import { EXPENSE_CATEGORIES } from '../constants'

interface ExpenseFormProps {
  editingExpense: Expense | null
  onExpenseAdded: () => void
  onUpdate: () => void
}

export default function ExpenseForm({
  editingExpense,
  onExpenseAdded,
  onUpdate,
}: ExpenseFormProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title)
      setAmount(String(editingExpense.amount))
      setCategory(editingExpense.category)
      return
    }

    setTitle('')
    setAmount('')
    setCategory('Food')
  }, [editingExpense])

  const handleSubmit = async () => {
    if (!title.trim() || !amount) {
      setMessage('Please fill in all fields.')
      return
    }

    const parsedAmount = Number(amount)

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setMessage('Please enter a valid amount.')
      return
    }

    setLoading(true)
    setMessage('')

    if (editingExpense) {
      const { error } = await supabase
        .from('expenses')
        .update({ title: title.trim(), amount: parsedAmount, category })
        .eq('id', editingExpense.id)

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Expense updated.')
        onUpdate()
      }

      setLoading(false)
      return
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setMessage(userError?.message ?? 'Please sign in again.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('expenses').insert([
      {
        title: title.trim(),
        amount: parsedAmount,
        category,
        user_id: user.id,
      },
    ])

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Expense added.')
      setTitle('')
      setAmount('')
      setCategory('Food')
      onExpenseAdded()
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        background: 'white',
        padding: '1.75rem',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        marginBottom: '1.5rem',
      }}
    >
      <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <input
          type="text"
          placeholder="Expense title (e.g. Lunch)"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          style={{ padding: '0.75rem 1rem', width: '100%' }}
        />

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount (e.g. 250)"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          style={{ padding: '0.75rem 1rem', width: '100%' }}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as ExpenseCategory)}
          style={{ padding: '0.75rem 1rem', width: '100%', background: 'white' }}
        >
          {EXPENSE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '0.85rem',
            background: editingExpense
              ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
              : 'linear-gradient(135deg, #6c63ff, #3b82f6)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
          }}
        >
          {loading ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>

      {message && (
        <p
          style={{
            marginTop: '0.75rem',
            padding: '0.6rem 1rem',
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
}
