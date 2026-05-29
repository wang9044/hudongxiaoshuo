'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Novel } from '@/lib/supabase'
import StarField from '@/components/StarField'
import DarkModeToggle from '@/components/DarkModeToggle'
import NovelCover from '@/components/NovelCover'
import { BookOpenText } from 'lucide-react'

export default function RankingClient({ novels }: { novels: Novel[] }) {
  const [liked, setLiked] = useState<Set<number>>(new Set())

  useEffect(() => {
    const saved = localStorage.getItem('liked_novels')
    if (saved) {
      try {
        setLiked(new Set(JSON.parse(saved)))
      } catch {}
    }
  }, [])

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem('liked_novels', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <StarField />

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,14,23,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 clamp(1rem, 5vw, 3rem)', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <BookOpenText style={{ fontSize: 24, color: '#fa8706' }} />
            <span style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
              午夜书阁
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" className="nav-link-hover" style={{ textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>首页</Link>
            <Link href="/ranking" style={{ textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.875rem', color: 'var(--accent)' }}>排行榜</Link>
            <Link href="/category" className="nav-link-hover" style={{ textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>分类</Link>
            <Link href="/creator" className="btn-primary" style={{ fontSize: '0.8rem', padding: '5px 14px', borderRadius: 8 }}>创作者中心</Link>
            <Link href="/download" className="nav-link-hover" style={{ textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>下载APP</Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.5, pointerEvents: 'none' }}></span>
            <input type="text" placeholder="搜索小说..." className="nav-search" />
          </div>
          <Link href="/login" className="nav-link-hover" style={{ textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>登录</Link>
          <Link href="/register" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '5px 14px', borderRadius: 8, whiteSpace: 'nowrap' }}>注册</Link>
          <DarkModeToggle />
        </div>
      </nav>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '800px', margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 5vw, 3rem)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 14px', borderRadius: 100,
            border: '1px solid rgba(255,137,6,0.3)', background: 'rgba(255,137,6,0.08)',
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--accent)', fontFamily: 'sans-serif', marginBottom: '1rem',
          }}>
            🔥 Ranking
          </div>
          <h1 style={{
            fontFamily: 'serif', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem',
          }}>
            热度榜单
          </h1>
          <div style={{
            width: 60, height: 3, margin: '0 auto',
            background: 'linear-gradient(90deg, var(--accent), var(--gold))', borderRadius: 2,
          }} />
        </div>

        {/* Novel List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {novels.map((novel, index) => (
            <div
              key={novel.id}
              className="ranking-item"
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '14px 20px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              {/* Rank number */}
              <span style={{
                fontFamily: 'sans-serif', fontSize: index < 3 ? '1.3rem' : '1rem',
                fontWeight: index < 3 ? 900 : 600,
                color: index === 0 ? '#ff8906' : index === 1 ? '#e0c67d' : index === 2 ? '#a78bfa' : 'var(--text-secondary)',
                width: 28, textAlign: 'center', flexShrink: 0,
              }}>
                {index + 1}
              </span>

              {/* Cover */}
              <Link href={`/novel/${novel.id}`} style={{ flexShrink: 0 }}>
                {novel.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={novel.cover_url} alt={novel.title} style={{ width: 52, height: 72, objectFit: 'cover', borderRadius: 6 }} />
                ) : (
                  <NovelCover title={novel.title} size="sm" />
                )}
              </Link>

              {/* Info */}
              <Link href={`/novel/${novel.id}`} style={{ flex: 1, textDecoration: 'none', minWidth: 0 }}>
                <div style={{
                  fontFamily: 'serif', fontSize: '1rem', fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {novel.title}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  fontFamily: 'sans-serif', fontSize: '0.8rem', color: 'var(--text-secondary)',
                }}>
                  <span>{novel.author}</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span style={{ opacity: 0.7 }}>
                    {new Date(novel.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </Link>

              {/* Heart */}
              <button
                onClick={() => toggleLike(novel.id)}
                aria-label={liked.has(novel.id) ? '取消喜欢' : '喜欢'}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '1.3rem', padding: 8, flexShrink: 0,
                  transition: 'transform 0.2s',
                  filter: liked.has(novel.id) ? 'none' : 'grayscale(1) opacity(0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                {liked.has(novel.id) ? '❤️' : '🤍'}
              </button>
            </div>
          ))}
        </div>

        {novels.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <p>暂无小说数据</p>
          </div>
        )}
      </div>
    </div>
  )
}
