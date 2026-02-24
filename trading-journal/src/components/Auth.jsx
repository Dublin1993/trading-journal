import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Check your email for a confirmation link!')
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setMessage('Password reset email sent!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Background effects */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.floatIcon}>⚔️</div>

      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>📊</span>
          <h1 style={styles.title}>Trading Journal</h1>
          <p style={styles.subtitle}>Master Your Edge. Track Every Battle.</p>
        </div>

        <div style={styles.tabs}>
          {['login', 'signup'].map(t => (
            <button
              key={t}
              style={{ ...styles.tabBtn, ...(mode === t ? styles.tabBtnActive : {}) }}
              onClick={() => { setMode(t); setError(''); setMessage('') }}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {mode === 'reset' && (
          <p style={styles.resetLabel}>Enter your email to reset your password</p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          {mode !== 'reset' && (
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
              />
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
          </button>
        </form>

        {mode === 'login' && (
          <button
            onClick={() => { setMode('reset'); setError(''); setMessage('') }}
            style={styles.forgotBtn}
          >
            Forgot password?
          </button>
        )}

        {mode === 'reset' && (
          <button
            onClick={() => { setMode('login'); setError(''); setMessage('') }}
            style={styles.forgotBtn}
          >
            ← Back to Sign In
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    background: 'var(--bg)',
  },
  orb1: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
    animation: 'pulse 5s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79,172,254,0.08) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-100px',
    animation: 'pulse 7s ease-in-out infinite 2s',
    pointerEvents: 'none',
  },
  floatIcon: {
    position: 'fixed',
    fontSize: '600px',
    opacity: 0.02,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-20deg)',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 1,
    animation: 'fadeIn 0.4s ease',
    boxShadow: '0 0 80px rgba(0,255,136,0.04)',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '12px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '26px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: 'var(--text)',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.5px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '28px',
    background: 'var(--surface2)',
    padding: '4px',
    borderRadius: '12px',
  },
  tabBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '9px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  tabBtnActive: {
    background: 'var(--green)',
    color: '#040812',
  },
  resetLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '16px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontFamily: 'var(--font-mono)',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    background: 'var(--red-dim)',
    border: '1px solid var(--red)',
    color: 'var(--red)',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  success: {
    background: 'var(--green-dim)',
    border: '1px solid var(--green)',
    color: 'var(--green)',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  submitBtn: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'var(--green)',
    color: '#040812',
    fontWeight: '800',
    fontSize: '15px',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s',
    marginTop: '4px',
  },
  forgotBtn: {
    display: 'block',
    margin: '16px auto 0',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '13px',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}
