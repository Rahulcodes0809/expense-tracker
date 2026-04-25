import { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabaseClient'

export default function ExpenseForm({ onExpenseAdded, editingExpense, onUpdate }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Other']

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title)
      setAmount(editingExpense.amount)
      setCategory(editingExpense.category)
    } else {
      setTitle('')
      setAmount('')
      setCategory('Food')
    }
  }, [editingExpense])

  const handleSubmit = async () => {
    if (!title || !amount) {
      setMessage('Please fill in all fields!')
      return
    }

    setLoading(true)
    setMessage('')

    if (editingExpense) {
      // UPDATE existing expense
      const { error } = await supabase
        .from('expenses')
        .update({ title, amount: parseFloat(amount), category })
        .eq('id', editingExpense.id)

      if (error) setMessage(error.message)
      else {
        setMessage('Expense updated! ✅')
        onUpdate()
      }
    } else {
      // INSERT new expense
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('expenses')
        .insert([{
          title,
          amount: parseFloat(amount),
          category,
          user_id: user.id
        }])

      if (error) setMessage(error.message)
      else {
        setMessage('Expense added! ✅')
        setTitle('')
        setAmount('')
        setCategory('Food')
        onExpenseAdded()
      }
    }

    setLoading(false)
  }

  return (
  <div style={{
    background: 'white',
    padding: '1.75rem',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: '1.5rem'
  }}>
    <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>
      {editingExpense ? '✏️ Edit Expense' : '➕ Add New Expense'}
    </h3>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <input
        type="text"
        placeholder="Expense title (e.g. Lunch)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '0.75rem 1rem', width: '100%' }}
      />

      <input
        type="number"
        placeholder="Amount (e.g. 250)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: '0.75rem 1rem', width: '100%' }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: '0.75rem 1rem', width: '100%', background: 'white' }}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button
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
          fontWeight: '600'
        }}
      >
        {loading ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
      </button>
    </div>

    {message && (
      <p style={{
        marginTop: '0.75rem',
        padding: '0.6rem 1rem',
        background: '#d1fae5',
        color: '#065f46',
        borderRadius: '6px',
        fontSize: '0.9rem'
      }}>
        {message}
      </p>
    )}
  </div>
)
}