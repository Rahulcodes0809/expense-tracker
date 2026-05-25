import { useEffect, useState } from 'react'

import Authenticator from '../features/auth/components/Authenticator'
import ExpenseForm from '../features/expenses/components/ExpenseForm'
import ExpenseList from '../features/expenses/components/ExpenseList'
import { supabase } from '../lib/supabase/client'
import type { Expense } from '../types/database'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [refresh, setRefresh] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleExpenseSaved = () => {
    setRefresh((current) => !current)
    setEditingExpense(null)
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '2rem 1rem' }}>
      {!session ? (
        <Authenticator />
      ) : (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              background: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <div>
              <h2 style={{ fontWeight: '700', color: '#1a1a2e' }}>Expense Tracker</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>{session.user.email}</span>
              <button
                type="button"
                onClick={() => void supabase.auth.signOut()}
                style={{
                  padding: '6px 16px',
                  background: '#fff1f2',
                  color: '#ef4444',
                  border: '1px solid #fecdd3',
                  borderRadius: '6px',
                  fontWeight: '500',
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <ExpenseForm
            onExpenseAdded={handleExpenseSaved}
            editingExpense={editingExpense}
            onUpdate={handleExpenseSaved}
          />

          <ExpenseList refresh={refresh} onEdit={handleEdit} />
        </div>
      )}
    </div>
  )
}
