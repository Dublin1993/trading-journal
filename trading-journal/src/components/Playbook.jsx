import React, { useState } from 'react'

const SECTIONS = [
  {
    id: 'overview',
    title: '📋 Overview',
    content: (
      <div>
        <p style={ps.p}>I exclusively trade two instruments: <strong style={{ color: '#00ff88' }}>NQ (Nasdaq-100 E-mini)</strong> and <strong style={{ color: '#00ff88' }}>ES (S&P 500 E-mini)</strong>. They have the deepest liquidity, tightest spreads, and the most predictable institutional behavior. I'd rather master two instruments completely than spread myself thin.</p>

        <div style={ps.imageWrap}>
          <img src="https://lh3.googleusercontent.com/d/1aT1cjA7dbzh_WRTmHcIlbTJKcsIxxBOH" alt="Trading Model Overview" style={ps.img} />
        </div>
      </div>
    )
  },
  {
    id: 'step1',
    title: '🌙 Step 1: Asia Range',
    accent: '#00ff88',
    content: (
      <div>
        <div style={{ ...ps.stepTag, background: 'rgba(0,255,136,0.1)', borderColor: '#00ff88', color: '#00ff88' }}>7:00 PM – 2:00 AM ET</div>
        <p style={ps.p}>Watch for price to establish a clear Asia range. I'm hunting for <strong>liquidity pools</strong> that remain untapped when New York opens at 9:30 AM ET.</p>
        <div style={{ ...ps.callout, borderColor: '#00ff88' }}>
          <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>What I'm Looking For:</h4>
          <p style={ps.p}><strong>Smooth Edges:</strong> Clean, well-defined highs or lows. Multiple candles stacking at the same price level without violation = resting stop losses and pending orders just beyond.</p>
          <p style={ps.p}><strong>Relative Equal Highs/Lows (EQH/EQL):</strong> Two or more swing highs/lows aligned at approximately the same price = liquidity magnet. Retail places stops here, institutions know it.</p>
          <div style={ps.tip}>
            💡 <strong>Key:</strong> If Asia liquidity is still intact at 9:30 AM NY open, that becomes my draw on liquidity for the session.
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'step2',
    title: '⚡ Step 2: Judas Swing',
    accent: '#e94560',
    content: (
      <div>
        <div style={{ ...ps.stepTag, background: 'rgba(233,69,96,0.1)', borderColor: '#e94560', color: '#e94560' }}>9:30 AM – 10:30 AM ET</div>
        <p style={ps.p}>Once I've identified the draw, I wait for the NY open. I'm watching for the <strong>Judas Swing</strong> — a false move that traps retail traders before the real move begins.</p>
        <div style={{ ...ps.callout, borderColor: '#e94560' }}>
          <h4 style={{ color: '#e94560', marginBottom: '10px' }}>The Manipulation Pattern:</h4>
          <p style={ps.p}><strong>1. Initial False Move:</strong> At or shortly after 9:30 AM, price makes a quick move opposite to where Asia liquidity sits.</p>
          <p style={ps.p}><strong>2. Taking an M15 Swing High/Low:</strong> The false move runs stops of overnight traders. This is institutional manipulation.</p>
          <p style={ps.p}><strong>3. Swift Reversal:</strong> After taking the M15 swing point, price quickly reverses toward the Asia DOL. This reversal is where institutions actually enter.</p>
        </div>
      </div>
    )
  },
  {
    id: 'step3',
    title: '🦄 Step 3: The Unicorn',
    accent: '#4facfe',
    content: (
      <div>
        <div style={{ ...ps.stepTag, background: 'rgba(79,172,254,0.1)', borderColor: '#4facfe', color: '#4facfe' }}>1-Minute Chart</div>
        <p style={ps.p}>I don't enter on M15. I drop to the <strong>1-minute chart</strong> and find a <strong>Unicorn</strong> — a specific pattern combining a Breaker Block and a Fair Value Gap.</p>
        <div style={{ ...ps.callout, borderColor: '#4facfe' }}>
          <h4 style={{ color: '#4facfe', marginBottom: '10px' }}>The Unicorn = Breaker Block + FVG</h4>
          <p style={ps.p}><strong>Breaker Block:</strong> The last candle moving opposite to the anticipated direction before price reverses. If expecting a move up, it's the last bearish M1 candle.</p>
          <p style={ps.p}><strong>Fair Value Gap (FVG):</strong> A gap/imbalance between three M1 candles where there's no overlap between the high of candle 1 and the low of candle 3.</p>
          <div style={ps.tip}>
            ⚡ <strong>Entry:</strong> The moment the M1 candle closes confirming the Breaker Block + FVG, I enter IMMEDIATELY with a market order. No waiting.
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'management',
    title: '⚙️ Trade Management',
    content: (
      <div>
        <div style={ps.twoCol}>
          <div style={{ ...ps.mgmtCard, borderColor: '#ff3b5c' }}>
            <h4 style={{ color: '#ff3b5c', marginBottom: '10px' }}>🛑 Stop Loss</h4>
            <p style={ps.p}>ALWAYS at the end of the Breaker Block. NOT at the M15 swing point. If price violates that structure, my read was wrong and I exit immediately.</p>
          </div>
          <div style={{ ...ps.mgmtCard, borderColor: '#00ff88' }}>
            <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>🎯 Targets</h4>
            <p style={ps.p}>+2R OR the Asia Draw on Liquidity — whichever is GREATER. Take 60-70% off at first target, trail the rest.</p>
          </div>
        </div>
        <div style={{ ...ps.mgmtCard, marginTop: '14px' }}>
          <h4 style={{ color: '#00ff88', marginBottom: '8px' }}>💰 Risk Per Trade</h4>
          <p style={ps.p}>Account Balance ÷ 10 = Risk per trade. If account is $10,000 → risk $1,000. Simple, consistent, manageable.</p>
        </div>
        <div style={{ ...ps.mgmtCard, marginTop: '14px' }}>
          <h4 style={{ color: '#00ff88', marginBottom: '8px' }}>⏱️ Duration</h4>
          <p style={ps.p}>Most trades conclude within the first hour of NY session, often much faster. Done by 1:00 PM ET.</p>
        </div>
      </div>
    )
  },
  {
    id: 'checklist',
    title: '✅ Trade Checklist',
    content: (
      <div>
        <p style={{ ...ps.p, marginBottom: '16px' }}>Every single criterion must be met before entering:</p>
        {[
          { step: '1', color: '#00ff88', items: ['Asia Range has smooth edges OR relative equal highs/lows', 'Asia liquidity LEFT INTACT at NY open (9:30 AM ET)'] },
          { step: '2', color: '#e94560', items: ['Judas Swing occurs at/after NY open', 'Swing high or low on M15 is taken', 'Price reverses toward Asia liquidity draw'] },
          { step: '3', color: '#4facfe', items: ['Breaker Block forms on M1 after liquidity sweep', 'Fair Value Gap (FVG) present with Breaker Block', 'Unicorn is clean and obvious'] },
          { step: '↵', color: '#ffb700', items: ['Enter immediately on close of M1 Breaker Block candle', 'SL at end of Breaker Block', 'Target: +2R or Asia DOL (whichever is greater)'] },
        ].map(row => (
          <div key={row.step} style={{ ...ps.checkRow, borderColor: row.color }}>
            <div style={{ ...ps.checkStep, color: row.color, borderColor: row.color }}>Step {row.step}</div>
            <div>
              {row.items.map((item, i) => (
                <div key={i} style={ps.checkItem}>
                  <span style={{ color: row.color }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'concepts',
    title: '📚 Key ICT Concepts',
    content: (
      <div style={ps.conceptGrid}>
        {[
          ['Liquidity', 'Clusters of stop losses and pending orders beyond obvious price levels. Institutions need liquidity to enter/exit large positions.'],
          ['Draw on Liquidity (DOL)', 'The magnetic pull attracting price toward a liquidity pool. Untapped Asia liquidity becomes the DOL for the NY session.'],
          ['Smooth Edges', 'Price levels where multiple candles form clean horizontal highs/lows. Liquidity rests just beyond the edge.'],
          ['EQH / EQL', 'Relative Equal Highs/Lows — two or more swing points aligned at the same price. Retail places stops here.'],
          ['Judas Swing', 'False move that runs stops and traps breakout traders before the real directional move. Named because it betrays those who follow.'],
          ['Breaker Block', 'The last candle moving opposite to anticipated direction before reversal. One half of the Unicorn pattern.'],
          ['Fair Value Gap (FVG)', 'Price imbalance between three candles with no overlap between candle 1 high and candle 3 low. Second half of Unicorn.'],
          ['Unicorn', 'Breaker Block + FVG forming on M1 after liquidity is taken. This is the entry signal.'],
          ['Displacement', 'A candle covering significantly more range than surrounding ones — indicates institutional urgency and momentum.'],
          ['Manipulation', 'Institutional act of running stops before entering true positions. Looks like a breakout, quickly reverses.'],
        ].map(([term, def]) => (
          <div key={term} style={ps.concept}>
            <h4 style={{ color: '#00ff88', marginBottom: '6px', fontSize: '14px' }}>{term}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{def}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'mistakes',
    title: '⚠️ Mistakes to Avoid',
    content: (
      <div style={{ ...ps.callout, borderColor: '#ff3b5c', background: 'rgba(255,59,92,0.05)' }}>
        {[
          ['Trading Without All Three Steps', "Never force a trade. If the Asia liquidity isn't clear, if there's no Judas Swing, or if the M1 Unicorn doesn't form cleanly — don't trade."],
          ['Entering Too Early', 'Wait for the M1 candle to close and confirm. Never predict the Breaker Block.'],
          ['Misplacing the Stop Loss', 'Stop MUST go at the end of the Breaker Block. Not the M15 swing point.'],
          ['Ignoring Session Times', 'This model works during NY session transition. Not during low-volume hours.'],
          ['Overtrading', "Some days the setup doesn't form. Zero trades is better than a forced marginal setup."],
          ['Moving Stops', "If price hits my stop at the Breaker Block end, my read was wrong. Don't move stops for 'more room.'"],
          ['Getting Emotional', 'Losses happen. Missed trades happen. Revenge trading destroys accounts. Follow the model.'],
        ].map(([title, desc]) => (
          <div key={title} style={{ marginBottom: '14px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>❌ <strong style={{ color: '#ff3b5c' }}>{title}:</strong> {desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'routine',
    title: '📅 Daily Routine',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          ['8:00–9:00 PM ET', 'Evening Review', 'Monitor Asia session start. Watch where price establishes range and mark potential liquidity pools forming.'],
          ['8:00–9:30 AM ET', 'Pre-Market Analysis', 'Review Asia range. Smooth edges? EQH/EQL? Which side has untapped liquidity? Formulate directional bias.'],
          ['9:30–10:30 AM ET', 'New York Open', 'Full focus. Watch for Judas Swing on M15. If it forms and takes a swing point, drop to M1 and wait for Unicorn.'],
          ['10:00 AM–1:00 PM ET', 'Trade Management', 'Manage position toward Asia liquidity targets. Most trades conclude in this window.'],
          ['1:00 PM ET', 'Close Out', 'Typically flat by early afternoon. Done for the day.'],
          ['Evening', 'Post-Trade Review', 'Journal every trade. Winners and losers. What did I see? Did setup follow model? Continuous improvement.'],
        ].map(([time, title, desc]) => (
          <div key={title} style={ps.routineItem}>
            <div style={ps.routineTime}>{time}</div>
            <div>
              <div style={{ fontWeight: '700', color: '#00ff88', marginBottom: '4px', fontSize: '14px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    )
  },
]

export default function Playbook() {
  const [active, setActive] = useState('overview')
  const section = SECTIONS.find(s => s.id === active)

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Trading Playbook</h2>
      <p style={styles.subtitle}>ICT-Based New York Open Strategy · NQ & ES</p>

      {/* Nav */}
      <div style={styles.nav}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            style={{ ...styles.navBtn, ...(active === s.id ? styles.navBtnActive : {}) }}
            onClick={() => setActive(s.id)}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div key={active} style={styles.content}>
        {section.content}
      </div>
    </div>
  )
}

const ps = {
  p: { fontSize: '14px', lineHeight: 1.7, color: 'var(--text)', marginBottom: '12px' },
  callout: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '14px',
    background: 'var(--surface2)',
  },
  tip: {
    background: 'rgba(0,255,136,0.08)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: 1.6,
    marginTop: '12px',
  },
  stepTag: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '999px',
    border: '1px solid',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '700',
    marginBottom: '14px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  mgmtCard: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
  },
  checkRow: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '10px',
    background: 'var(--surface2)',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  checkStep: {
    fontFamily: 'var(--font-mono)',
    fontWeight: '700',
    fontSize: '12px',
    border: '1px solid',
    padding: '3px 8px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    marginTop: '2px',
  },
  checkItem: {
    fontSize: '13px',
    lineHeight: 1.6,
    display: 'flex',
    gap: '8px',
  },
  conceptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
  },
  concept: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  routineItem: {
    display: 'flex',
    gap: '16px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  routineTime: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    paddingTop: '2px',
    minWidth: '120px',
  },
  imageWrap: {
    textAlign: 'center',
    margin: '24px 0',
  },
  img: {
    maxWidth: '100%',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
}

const styles = {
  wrapper: { animation: 'fadeIn 0.3s ease' },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    marginBottom: '20px',
  },
  nav: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  navBtn: {
    padding: '7px 14px',
    borderRadius: '999px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.15s',
    cursor: 'pointer',
  },
  navBtnActive: {
    background: 'var(--green)',
    color: '#040812',
    borderColor: 'var(--green)',
  },
  content: {
    animation: 'fadeIn 0.25s ease',
  },
}
