import { useEffect, useState } from 'react'
import { supabase } from './supabase/supabaseClient'
import Auth from './components/Authenticator'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

function App() {
  const [session, setSession] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleExpenseAdded = () => {
    setRefresh(!refresh)
    setEditingExpense(null)
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
  <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '2rem 1rem' }}>
    {!session ? (
      <Auth />
    ) : (
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          background: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            <h2 style={{ fontWeight: '700', color: '#1a1a2e' }}>Expense Tracker</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>{session.user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                padding: '6px 16px',
                background: '#fff1f2',
                color: '#ef4444',
                border: '1px solid #fecdd3',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Form */}
        <ExpenseForm
          onExpenseAdded={handleExpenseAdded}
          editingExpense={editingExpense}
          onUpdate={handleExpenseAdded}
        />

        {/* List */}
        <ExpenseList
          refresh={refresh}
          onEdit={handleEdit}
        />

      </div>
    )}
  </div>
)
}

export default App