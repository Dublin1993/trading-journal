import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const MODELS = ['Unicorn', 'Breaker Block', 'FVG', 'Judas Swing', 'Asia Range', 'Other']
const SYMBOLS = ['NQ', 'ES', 'GC', 'CL', 'EUR/USD', 'GBP/USD', 'Other']

export default function AddTrade({ user, onSave, editingTrade, onCancelEdit }) {
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [symbol, setSymbol] = useState('NQ')
  const [model, setModel] = useState('Unicorn')
  const [side, setSide] = useState('long')
  const [result, setResult] = useState('')
  const [notes, setNotes] = useState('')
  const [screenshots, setScreenshots] = useState([]) // existing base64
  const [newFiles, setNewFiles] = useState([]) // new File objects
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef()

  useEffect(() => {
    if (editingTrade) {
      setDate(editingTrade.date)
      setSymbol(editingTrade.symbol)
      setModel(editingTrade.model)
      setSide(editingTrade.side)
      setResult(editingTrade.result)
      setNotes(editingTrade.notes || '')
      setScreenshots(editingTrade.screenshots || [])
      setNewFiles([])
    } else {
      resetForm()
    }
  }, [editingTrade])

  function resetForm() {
    setDate(today)
    setSymbol('NQ')
    setModel('Unicorn')
    setSide('long')
    setResult('')
    setNotes('')
    setScreenshots([])
    setNewFiles([])
    setError('')
  }

  async function compressAndConvert(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxDim = 1200
          let w = img.width, h = img.height
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round(h * maxDim / w); w = maxDim }
            else { w = Math.round(w * maxDim / h); h = maxDim }
          }
          canvas.width = w
          canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', 0.75))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  function handleFiles(files) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    setNewFiles(prev => [...prev, ...imageFiles])
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  function removeExistingScreenshot(i) {
    setScreenshots(prev => prev.filter((_, idx) => idx !== i))
  }

  function removeNewFile(i) {
    setNewFiles(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Convert new files to base64
      const newBase64 = await Promise.all(newFiles.map(compressAndConvert))
      const allScreenshots = [...screenshots, ...newBase64]

      const tradeData = {
        user_id: user.id,
        date,
        symbol,
        model,
        side,
        result: parseFloat(result),
        notes,
        screenshots: allScreenshots,
      }

      let error
      if (editingTrade) {
        const { error: e } = await supabase
          .from('trades')
          .update(tradeData)
          .eq('id', editingTrade.id)
        error = e
      } else {
        const { error: e } = await supabase
          .from('trades')
          .insert(tradeData)
        error = e
      }

      if (error) throw error

      resetForm()
      onSave()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>{editingTrade ? 'Edit Trade' : 'Log New Trade'}</h2>
        {editingTrade && (
          <button style={styles.cancelBtn} onClick={onCancelEdit}>Cancel</button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>
          <Field label="Date">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={styles.input} />
          </Field>

          <Field label="Symbol">
            <select value={symbol} onChange={e => setSymbol(e.target.value)} style={styles.input}>
              {SYMBOLS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Model / Setup">
            <select value={model} onChange={e => setModel(e.target.value)} style={styles.input}>
              {MODELS.map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>

          <Field label="Direction">
            <div style={styles.sideToggle}>
              {['long', 'short'].map(s => (
                <button
                  key={s}
                  type="button"
                  style={{ ...styles.sideBtn, ...(side === s ? (s === 'long' ? styles.sideLong : styles.sideShort) : {}) }}
                  onClick={() => setSide(s)}
                >
                  {s === 'long' ? '▲ Long' : '▼ Short'}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Result (R)">
            <input
              type="number"
              step="0.01"
              value={result}
              onChange={e => setResult(e.target.value)}
              placeholder="e.g. 2.5 or -1"
              required
              style={styles.input}
            />
          </Field>

          <Field label="Notes" fullWidth>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What did you observe? How was your execution?"
              rows={3}
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </Field>
        </div>

        {/* Screenshot Upload */}
        <div
          style={{ ...styles.dropzone, ...(dragOver ? styles.dropzoneActive : {}) }}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
          <span style={{ fontSize: '28px' }}>📷</span>
          <p style={styles.dropzoneText}>Drop screenshots here or click to upload</p>
          <p style={styles.dropzoneHint}>JPG, PNG, WEBP — will be compressed automatically</p>
        </div>

        {/* Preview thumbnails */}
        {(screenshots.length > 0 || newFiles.length > 0) && (
          <div style={styles.previewGrid}>
            {screenshots.map((src, i) => (
              <div key={`existing-${i}`} style={styles.previewItem}>
                <img src={src} style={styles.previewImg} alt="" />
                <button type="button" style={styles.removeBtn} onClick={() => removeExistingScreenshot(i)}>✕</button>
                <span style={styles.savedBadge}>Saved</span>
              </div>
            ))}
            {newFiles.map((file, i) => (
              <div key={`new-${i}`} style={styles.previewItem}>
                <img src={URL.createObjectURL(file)} style={styles.previewImg} alt="" />
                <button type="button" style={styles.removeBtn} onClick={() => removeNewFile(i)}>✕</button>
                <span style={styles.newBadge}>New</span>
              </div>
            ))}
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? '⏳ Saving...' : editingTrade ? '✓ Update Trade' : '+ Log Trade'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children, fullWidth }) {
  return (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
      <label style={fieldStyles.label}>{label}</label>
      {children}
    </div>
  )
}

const fieldStyles = {
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    fontFamily: 'var(--font-mono)',
  }
}

const styles = {
  wrapper: {
    animation: 'fadeIn 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: '700',
  },
  cancelBtn: {
    padding: '7px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '14px',
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
  },
  sideToggle: {
    display: 'flex',
    gap: '6px',
  },
  sideBtn: {
    flex: 1,
    padding: '11px 8px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    fontWeight: '700',
    fontSize: '13px',
    transition: 'all 0.15s',
  },
  sideLong: {
    background: 'rgba(0,255,136,0.15)',
    borderColor: '#00ff88',
    color: '#00ff88',
  },
  sideShort: {
    background: 'rgba(255,59,92,0.15)',
    borderColor: '#ff3b5c',
    color: '#ff3b5c',
  },
  dropzone: {
    border: '2px dashed var(--border)',
    borderRadius: '14px',
    padding: '28px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  dropzoneActive: {
    borderColor: '#00ff88',
    background: 'rgba(0,255,136,0.05)',
  },
  dropzoneText: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    margin: 0,
  },
  dropzoneHint: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    opacity: 0.6,
    margin: 0,
    fontFamily: 'var(--font-mono)',
  },
  previewGrid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  previewItem: {
    position: 'relative',
    width: '90px',
    height: '64px',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid var(--border)',
  },
  removeBtn: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: 'none',
    background: '#ff3b5c',
    color: 'white',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  savedBadge: {
    position: 'absolute',
    bottom: '4px',
    left: '4px',
    fontSize: '9px',
    background: 'rgba(0,255,136,0.8)',
    color: '#040812',
    padding: '1px 5px',
    borderRadius: '4px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  newBadge: {
    position: 'absolute',
    bottom: '4px',
    left: '4px',
    fontSize: '9px',
    background: 'rgba(79,172,254,0.8)',
    color: '#040812',
    padding: '1px 5px',
    borderRadius: '4px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  error: {
    background: 'rgba(255,59,92,0.1)',
    border: '1px solid #ff3b5c',
    color: '#ff3b5c',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '14px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'var(--green)',
    color: '#040812',
    fontWeight: '800',
    fontSize: '15px',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s',
  }
}
