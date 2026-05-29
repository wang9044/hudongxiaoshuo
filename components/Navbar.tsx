'use client'

import { useState } from 'react'
import Link from 'next/link'
import DarkModeToggle from './DarkModeToggle'
import { BookOpenText } from 'lucide-react'

export default function Navbar({ current }: { current?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: '首页', key: 'home' },
    { href: '/ranking', label: '排行榜', key: 'ranking' },
    { href: '/category', label: '分类', key: 'category' },
    { href: '/download', label: '下载APP', key: 'download' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(15,14,23,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 clamp(1rem, 5vw, 3rem)',
    }}>
      <div style={{
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        {/* Left: Logo + Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <BookOpenText style={{ fontSize: 24, color: '#fa8706' }} />
            <span style={{
              fontFamily: 'serif', fontSize: 20, fontWeight: 700,
              color: 'var(--text-primary)', letterSpacing: '0.05em',
            }}>
              午夜书阁
            </span>
          </Link>
          {/* Desktop links */}
          <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {navLinks.map(link => (
              <Link
                key={link.key}
                href={link.href}
                style={{
                  textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.875rem',
                  color: current === link.key ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/creator" className="btn-primary" style={{ fontSize: '0.8rem', padding: '5px 14px', borderRadius: 8 }}>
              创作者中心
            </Link>
          </div>
        </div>

        {/* Right: Search + Auth (desktop) */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              fontSize: 14, opacity: 0.5, pointerEvents: 'none',
            }}>🔍</span>
            <input type="text" placeholder="搜索小说..." className="nav-search" />
          </div>
          <Link href="/login" className="nav-link-hover" style={{ textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            登录
          </Link>
          <Link href="/register" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '5px 14px', borderRadius: 8, whiteSpace: 'nowrap' }}>
            注册
          </Link>
          <DarkModeToggle />
        </div>

        {/* Mobile: DarkMode + Hamburger */}
        <div className="nav-mobile-controls" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
          <DarkModeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
            style={{
              background: 'transparent', border: '1px solid var(--border)', borderRadius: 8,
              width: 40, height: 40, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: 'var(--text-primary)',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          display: 'flex', flexDirection: 'column', gap: 4,
          paddingBottom: 16,
        }}>
          {navLinks.map(link => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.95rem',
                color: current === link.key ? 'var(--accent)' : 'var(--text-secondary)',
                padding: '10px 8px', borderRadius: 8,
                transition: 'background 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/creator"
            onClick={() => setMenuOpen(false)}
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '10px 16px', borderRadius: 8, textAlign: 'center', marginTop: 4 }}
          >
            创作者中心
          </Link>
          <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />
          <div style={{ display: 'flex', gap: 8, padding: '0 8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, opacity: 0.5, pointerEvents: 'none',
              }}>🔍</span>
              <input type="text" placeholder="搜索小说..." className="nav-search" style={{ width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '4px 8px 0' }}>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="nav-link-hover"
              style={{
                flex: 1, textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.9rem',
                textAlign: 'center', padding: '8px 0', borderRadius: 8,
                border: '1px solid var(--border)',
              }}
            >
              登录
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="btn-primary"
              style={{ flex: 1, fontSize: '0.9rem', padding: '8px 0', borderRadius: 8, textAlign: 'center' }}
            >
              注册
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
