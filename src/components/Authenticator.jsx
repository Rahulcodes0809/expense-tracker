import { useState } from 'react'
import { supabase } from '../supabase/supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account!')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6c63ff 0%, #3b82f6 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>💰</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e' }}>
            Expense Tracker
          </h1>
          <p style={{ color: '#666', marginTop: '0.25rem' }}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.85rem 1rem', width: '100%' }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.85rem 1rem', width: '100%' }}
          />

          <button
            onClick={handleAuth}
            disabled={loading}
            style={{
              padding: '0.85rem',
              background: 'linear-gradient(135deg, #6c63ff, #3b82f6)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#fff3cd',
            borderRadius: '6px',
            color: '#856404',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}

        {/* Toggle */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#6c63ff', fontWeight: '600', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Loginn'}
          </span>
        </p>
      </div>
    </div>
  )
}