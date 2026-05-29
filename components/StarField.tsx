'use client'

import { useEffect, useRef } from 'react'

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const count = 80
    container.innerHTML = ''

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${2 + Math.random() * 4}s;
        --delay: ${Math.random() * 4}s;
        width: ${Math.random() > 0.8 ? 3 : 2}px;
        height: ${Math.random() > 0.8 ? 3 : 2}px;
        opacity: ${0.2 + Math.random() * 0.6};
      `
      container.appendChild(star)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
