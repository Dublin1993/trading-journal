import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import TradeList from './components/TradeList'
import AddTrade from './components/AddTrade'
import Playbook from './components/Playbook'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

const currentYear = new Date().getFullYear()

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trades, setTrades] = useState([])
  const [tradesLoading, setTradesLoading] = useState(false)
  const [tab, setTab] = useState('dashboard')
  const [year, setYear] = useState(currentYear)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [editingTrade, setEditingTrade] = useState(null)
  const [filterModel, setFilterModel] = useState('')
  const [filterSide, setFilterSide] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Theme
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light' : ''
    localStorage.setItem('theme', theme)
  }, [theme])

  // Load trades
  const loadTrades = useCallback(async () => {
    if (!session) return
    setTradesLoading(true)
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false })
    if (!error && data) setTrades(data)
    setTradesLoading(false)
  }, [session])

  useEffect(() => {
    loadTrades()
  }, [loadTrades])

  // Real-time sync
  useEffect(() => {
    if (!session) return
    const channel = supabase
      .channel('trades-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trades',
        filter: `user_id=eq.${session.user.id}`
      }, () => { loadTrades() })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [session, loadTrades])

  if (loading) return <Loader />
  if (!session) return <Auth />

  // Filter trades for current tab/year
  const filteredTrades = trades.filter(t => {
    const tradeYear = new Date(t.date).getFullYear()
    if (tradeYear !== year) return false
    if (tab === 'dashboard') return true
    if (tab === 'add') return false
    if (tab === 'playbook') return false
    const monthIdx = MONTHS.indexOf(tab)
    if (monthIdx === -1) return false
    return new Date(t.date).getMonth() === monthIdx
  })

  const tabTitle = tab === 'dashboard'
    ? `All ${year} Performance`
    : MONTHS.includes(tab)
    ? `${MONTH_NAMES[MONTHS.indexOf(tab)]} ${year} Performance`
    : ''

  const TABS = [
    { id: 'dashboard', label: '⬛ All' },
    ...MONTHS.map(m => ({ id: m, label: m })),
    { id: 'add', label: '+ Add Trade' },
    { id: 'playbook', label: '📖 Playbook' },
  ]

  async function handleDeleteTrade(id) {
    if (!confirm('Delete this trade?')) return
    await supabase.from('trades').delete().eq('id', id)
    loadTrades()
  }

  function handleEditTrade(trade) {
    setEditingTrade(trade)
    setTab('add')
    setMobileMenuOpen(false)
  }

  return (
    <div style={styles.app}>
      {/* Background effects */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.bgIcon}>⚔️</div>

      {/* Floating icons */}
      {['💹','📈','⚡','🎯'].map((icon, i) => (
        <div key={i} style={{
          ...styles.floatIcon,
          top: `${[10, 20, 60, 75][i]}%`,
          left: i < 2 ? `${[8, 88][i]}%` : undefined,
          right: i >= 2 ? `${[5, 10][i - 2]}%` : undefined,
          animationDuration: `${[6, 7, 8, 9][i]}s`,
          animationDelay: `${i * 1.5}s`,
        }}>{icon}</div>
      ))}

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>⚔️ Trading Journal</h1>
            <p style={styles.subtitle}>Track. Analyze. Dominate.</p>
          </div>
          <div style={styles.headerRight}>
            <select
              value={year}
              onChange={e => setYear(parseInt(e.target.value))}
              style={styles.yearSelect}
            >
              {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <button
              style={styles.themeBtn}
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              style={styles.signOutBtn}
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div style={styles.tabsWrap}>
          <div style={styles.tabs}>
            {TABS.map(t => (
              <button
                key={t.id}
                style={{
                  ...styles.tabBtn,
                  ...(tab === t.id ? styles.tabBtnActive : {}),
                  ...(t.id === 'add' ? styles.tabBtnAdd : {}),
                  ...(t.id === 'playbook' ? styles.tabBtnPlaybook : {}),
                }}
                onClick={() => {
                  setTab(t.id)
                  if (t.id !== 'add') setEditingTrade(null)
                  setMobileMenuOpen(false)
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar (shown on list-like views) */}
        {(tab === 'dashboard' || MONTHS.includes(tab)) && filteredTrades.length > 0 && (
          <div style={styles.filters}>
            <select value={filterModel} onChange={e => setFilterModel(e.target.value)} style={styles.filterSelect}>
              <option value="">All Models</option>
              {['Unicorn','Breaker Block','FVG','Judas Swing','Asia Range','Other'].map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <select value={filterSide} onChange={e => setFilterSide(e.target.value)} style={styles.filterSelect}>
              <option value="">All Sides</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
            {(filterModel || filterSide) && (
              <button style={styles.clearBtn} onClick={() => { setFilterModel(''); setFilterSide('') }}>
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Main content */}
        <main style={styles.main}>
          {tradesLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              Loading trades...
            </div>
          )}

          {!tradesLoading && (tab === 'dashboard' || MONTHS.includes(tab)) && (
            <>
              <Dashboard trades={filteredTrades} title={tabTitle} />
              <div style={styles.divider} />
              <TradeList
                trades={filteredTrades}
                onEdit={handleEditTrade}
                onDelete={handleDeleteTrade}
                filterModel={filterModel}
                filterSide={filterSide}
              />
            </>
          )}

          {tab === 'add' && (
            <AddTrade
              user={session.user}
              onSave={() => {
                loadTrades()
                setEditingTrade(null)
                setTab('dashboard')
              }}
              editingTrade={editingTrade}
              onCancelEdit={() => {
                setEditingTrade(null)
                setTab('dashboard')
              }}
            />
          )}

          {tab === 'playbook' && <Playbook />}
        </main>

        {/* User info bar */}
        <div style={styles.userBar}>
          <span style={styles.userEmail}>🔒 {session.user.email}</span>
          <span style={{ ...styles.userEmail, color: '#00ff88' }}>✓ Synced</span>
        </div>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '13px' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚔️</div>
        Loading...
      </div>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)',
    top: '-150px',
    right: '-150px',
    animation: 'pulse 6s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orb2: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79,172,254,0.06) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-100px',
    animation: 'pulse 8s ease-in-out infinite 2s',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgIcon: {
    position: 'fixed',
    fontSize: '700px',
    opacity: 0.018,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-20deg)',
    pointerEvents: 'none',
    zIndex: 0,
    userSelect: 'none',
  },
  floatIcon: {
    position: 'fixed',
    fontSize: '36px',
    opacity: 0.12,
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'float ease-in-out infinite',
    filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.3))',
  },
  container: {
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '20px 16px',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(22px, 4vw, 34px)',
    fontWeight: '800',
    letterSpacing: '-1px',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.5px',
    marginTop: '4px',
  },
  headerRight: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  yearSelect: {
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  themeBtn: {
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    fontSize: '16px',
    cursor: 'pointer',
  },
  signOutBtn: {
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: '600',
  },
  tabsWrap: {
    overflowX: 'auto',
    marginBottom: '16px',
    paddingBottom: '4px',
  },
  tabs: {
    display: 'flex',
    gap: '6px',
    minWidth: 'max-content',
  },
  tabBtn: {
    padding: '8px 14px',
    borderRadius: '999px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  tabBtnActive: {
    background: 'var(--green)',
    color: '#040812',
    borderColor: 'var(--green)',
  },
  tabBtnAdd: {
    background: 'rgba(0,255,136,0.1)',
    borderColor: 'rgba(0,255,136,0.3)',
    color: '#00ff88',
  },
  tabBtnPlaybook: {
    background: 'rgba(79,172,254,0.1)',
    borderColor: 'rgba(79,172,254,0.3)',
    color: '#4facfe',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterSelect: {
    padding: '7px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
  },
  clearBtn: {
    padding: '7px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,59,92,0.3)',
    background: 'rgba(255,59,92,0.08)',
    color: '#ff3b5c',
    fontSize: '12px',
    fontWeight: '600',
  },
  main: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '12px',
    boxShadow: '0 0 60px rgba(0,0,0,0.3)',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    margin: '24px 0',
  },
  userBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 4px',
  },
  userEmail: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
}
