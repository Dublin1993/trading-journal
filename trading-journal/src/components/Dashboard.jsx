import React, { useMemo, useEffect, useRef } from 'react'

export default function Dashboard({ trades, title }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const stats = useMemo(() => {
    if (!trades.length) return null
    const winners = trades.filter(t => t.result > 0)
    const losers = trades.filter(t => t.result < 0)
    const totalR = trades.reduce((s, t) => s + Number(t.result), 0)
    const winRate = (winners.length / trades.length * 100).toFixed(1)
    const avgR = totalR / trades.length
    const best = Math.max(...trades.map(t => Number(t.result)))
    const worst = Math.min(...trades.map(t => Number(t.result)))
    return { winners: winners.length, losers: losers.length, totalR, winRate, avgR, best, worst }
  }, [trades])

  const chartData = useMemo(() => {
    const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date))
    let equity = 0
    const data = [0]
    const labels = ['Start']
    sorted.forEach((t, i) => {
      equity += Number(t.result)
      data.push(parseFloat(equity.toFixed(2)))
      labels.push(`#${i + 1}`)
    })
    return { labels, data, positive: equity >= 0 }
  }, [trades])

  useEffect(() => {
    if (!canvasRef.current || !trades.length) return

    import('chart.js').then(({ Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip }) => {
      Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }

      const color = chartData.positive ? '#00ff88' : '#ff3b5c'
      const bgColor = chartData.positive ? 'rgba(0,255,136,0.08)' : 'rgba(255,59,92,0.08)'

      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            data: chartData.data,
            borderColor: color,
            backgroundColor: bgColor,
            borderWidth: 2,
            pointRadius: chartData.data.length > 20 ? 0 : 3,
            pointBackgroundColor: color,
            tension: 0.35,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `${ctx.raw >= 0 ? '+' : ''}${ctx.raw}R` } }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: 'rgba(232,234,240,0.4)', font: { family: 'Space Mono', size: 10 } }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: 'rgba(232,234,240,0.4)',
                font: { family: 'Space Mono', size: 10 },
                callback: v => `${v >= 0 ? '+' : ''}${v}R`
              }
            }
          }
        }
      })
    })

    return () => {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }
    }
  }, [trades, chartData])

  const r = (val, decimals = 2) => `${val >= 0 ? '+' : ''}${parseFloat(val).toFixed(decimals)}R`

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {!trades.length ? (
        <div style={styles.empty}>
          <span style={{ fontSize: '48px' }}>📭</span>
          <p>No trades recorded for this period.</p>
          <p style={{ fontSize: '13px', opacity: 0.5 }}>Add your first trade using the form below.</p>
        </div>
      ) : (
        <>
          <div style={styles.statsGrid}>
            <StatCard label="Total Trades" value={trades.length} />
            <StatCard label="Win Rate" value={`${stats.winRate}%`} />
            <StatCard label="Winners" value={stats.winners} color="#00ff88" />
            <StatCard label="Losers" value={stats.losers} color="#ff3b5c" />
            <StatCard label="Total R" value={r(stats.totalR)} color={stats.totalR >= 0 ? '#00ff88' : '#ff3b5c'} />
            <StatCard label="Avg R" value={r(stats.avgR)} color={stats.avgR >= 0 ? '#00ff88' : '#ff3b5c'} />
            <StatCard label="Best Trade" value={r(stats.best)} color="#00ff88" />
            <StatCard label="Worst Trade" value={r(stats.worst)} color="#ff3b5c" />
          </div>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartLabel}>Equity Curve</span>
              <span style={{ ...styles.chartLabel, color: chartData.positive ? '#00ff88' : '#ff3b5c', fontWeight: 700 }}>
                {r(stats.totalR)}
              </span>
            </div>
            <div style={{ height: '180px' }}>
              <canvas ref={canvasRef} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color: color || 'var(--text)', fontFamily: 'var(--font-mono)' }}>{value}</div>
    </div>
  )
}

const styles = {
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)', letterSpacing: '-0.3px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' },
  statCard: { background: 'var(--surface2)', borderRadius: '14px', padding: '14px 16px', border: '1px solid var(--border)' },
  statLabel: { fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' },
  statValue: { fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' },
  chartCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px' },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  chartLabel: { fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.5px' },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }
}