import React, { useState } from 'react'

const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getOrdinal(n) {
  const s = ['th','st','nd','rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${dayNames[d.getDay()]}, ${getOrdinal(d.getDate())} of ${monthNames[d.getMonth()]}, ${d.getFullYear()}`
}

export default function TradeList({ trades, onEdit, onDelete, filterModel, filterSide }) {
  const [lightboxSrc, setLightboxSrc] = useState(null)

  const sorted = [...trades]
    .filter(t => !filterModel || t.model === filterModel)
    .filter(t => !filterSide || t.side === filterSide)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (!sorted.length) {
    return (
      <div style={styles.empty}>
        <span style={{ fontSize: '40px' }}>🔍</span>
        <p>No trades match the current filters.</p>
      </div>
    )
  }

  return (
    <>
      {lightboxSrc && (
        <div style={styles.lightbox} onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} style={styles.lightboxImg} alt="Screenshot" onClick={e => e.stopPropagation()} />
          <button style={styles.lightboxClose} onClick={() => setLightboxSrc(null)}>✕</button>
        </div>
      )}

      <div style={styles.list}>
        {sorted.map(trade => {
          const isWin = trade.result > 0
          const isLoss = trade.result < 0
          const resultStr = `${trade.result > 0 ? '+' : ''}${trade.result}R`

          return (
            <div key={trade.id} style={styles.item}>
              <div style={{ ...styles.accent, background: isWin ? '#00ff88' : isLoss ? '#ff3b5c' : '#888' }} />

              <div style={styles.itemBody}>
                <div style={styles.itemTop}>
                  <div>
                    <div style={styles.symbol}>{trade.symbol} · {trade.side.toUpperCase()}</div>
                    <div style={styles.meta}>
                      {formatDate(trade.date)} · {trade.model}
                    </div>
                  </div>
                  <div style={{ ...styles.result, color: isWin ? '#00ff88' : isLoss ? '#ff3b5c' : 'var(--text)' }}>
                    {resultStr}
                  </div>
                </div>

                {trade.notes && <div style={styles.notes}>{trade.notes}</div>}

                {trade.screenshots && trade.screenshots.length > 0 && (
                  <div style={styles.screenshots}>
                    {trade.screenshots.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        style={styles.thumb}
                        onClick={() => setLightboxSrc(src)}
                        alt={`Screenshot ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                <div style={styles.actions}>
                  <button style={styles.editBtn} onClick={() => onEdit(trade)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => onDelete(trade.id)}>Delete</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  item: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    display: 'flex',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  accent: {
    width: '4px',
    flexShrink: 0,
  },
  itemBody: { padding: '14px 16px', flex: 1 },
  itemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '6px',
  },
  symbol: {
    fontFamily: 'var(--font-mono)',
    fontWeight: '700',
    fontSize: '15px',
    letterSpacing: '0.3px',
  },
  meta: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '2px',
    fontFamily: 'var(--font-mono)',
  },
  result: {
    fontFamily: 'var(--font-mono)',
    fontWeight: '700',
    fontSize: '18px',
    whiteSpace: 'nowrap',
  },
  notes: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '10px',
    lineHeight: '1.5',
    borderLeft: '2px solid var(--border)',
    paddingLeft: '10px',
  },
  screenshots: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  thumb: {
    width: '80px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid var(--border)',
    transition: 'transform 0.15s',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '5px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text)',
    fontSize: '12px',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: '5px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,59,92,0.3)',
    background: 'rgba(255,59,92,0.08)',
    color: '#ff3b5c',
    fontSize: '12px',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
  },
  lightbox: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.9)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  lightboxImg: {
    maxWidth: '100%',
    maxHeight: '90vh',
    borderRadius: '12px',
    objectFit: 'contain',
  },
  lightboxClose: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
  }
}
