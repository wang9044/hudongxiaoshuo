'use client'

import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved === 'true') {
      setIsDark(true)
      document.documentElement.classList.add('dark-mode')
    }
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark-mode')
      localStorage.setItem('darkMode', 'false')
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? '切换为普通模式' : '切换为深色模式'}
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        transition: 'border-color 0.3s, background 0.3s',
        color: 'var(--text-primary)',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--accent)'
        el.style.background = 'var(--accent-glow)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
        el.style.background = 'transparent'
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
