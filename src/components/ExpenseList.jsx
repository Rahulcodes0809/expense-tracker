import { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabaseClient'

export default function ExpenseList({ refresh, onEdit }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchExpenses = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setExpenses(data)
      const sum = data.reduce((acc, exp) => acc + parseFloat(exp.amount), 0)
      setTotal(sum)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchExpenses()
  }, [refresh])

  const handleDelete = async (id) => {
    const confirm = window.confirm('Delete this expense?')
    if (!confirm) return

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) console.error(error)
    else fetchExpenses()
  }

  if (loading) return <p>Loading expenses...</p>

 if (loading) return (
  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
    Loading expenses...
  </div>
)

return (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  }}>
    {/* Header */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem 1.75rem',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <h3 style={{ fontWeight: '600' }}>📋 My Expenses</h3>
      <div style={{
        background: 'linear-gradient(135deg, #6c63ff, #3b82f6)',
        color: 'white',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '0.95rem'
      }}>
        Total: ₹{total.toFixed(2)}
      </div>
    </div>

    {/* List */}
    {expenses.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧾</div>
        <p>No expenses yet. Add one above!</p>
      </div>
    ) : (
      expenses.map((exp) => (
        <div
          key={exp.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.75rem',
            borderBottom: '1px solid #f9f9f9',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          {/* Left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '1.5rem' }}>
              {exp.category === 'Food' ? '🍔' :
               exp.category === 'Travel' ? '✈️' :
               exp.category === 'Shopping' ? '🛍️' :
               exp.category === 'Bills' ? '📄' :
               exp.category === 'Health' ? '💊' : '💸'}
            </div>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{exp.title}</p>
              <span style={{
                fontSize: '0.75rem',
                background: '#f0f0ff',
                color: '#6c63ff',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: '500'
              }}>
                {exp.category}
              </span>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <strong style={{ fontSize: '1.05rem', color: '#1a1a2e' }}>
              ₹{parseFloat(exp.amount).toFixed(2)}
            </strong>

            <button
              onClick={() => onEdit(exp)}
              style={{
                padding: '5px 12px',
                background: '#eff6ff',
                color: '#3b82f6',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(exp.id)}
              style={{
                padding: '5px 12px',
                background: '#fff1f2',
                color: '#ef4444',
                border: '1px solid #fecdd3',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))
    )}
  </div>
)
}