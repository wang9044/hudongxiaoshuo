
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase, Novel } from '@/lib/supabase'
import StarField from '@/components/StarField'
import DarkModeToggle from '@/components/DarkModeToggle'
import NovelCover from '@/components/NovelCover'

async function getNovel(id: string): Promise<Novel | null> {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching novel:', error)
    return null
  }
  return data
}

async function getSceneCount(novelId: string): Promise<number> {
  const { count } = await supabase
    .from('scenes')
    .select('*', { count: 'exact', head: true })
    .eq('novel_id', novelId)
  return count ?? 0
}

export default async function NovelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [novel, sceneCount] = await Promise.all([
    getNovel(id),
    getSceneCount(id),
  ])

  if (!novel) {
    notFound()
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <StarField />

      {/* Nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15,14,23,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 clamp(1rem, 5vw, 3rem)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <Link href="/" className="nav-link-hover" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          fontFamily: 'sans-serif',
          fontSize: '0.875rem',
        }}>
          ← 返回书阁
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
            🌙 午夜书阁
          </span>
        </div>
        <DarkModeToggle />
      </nav>

      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #1a1035 0%, #0f0e17 40%, #1a1829 100%)',
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,137,6,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Cover */}
          <div
            className="animate-fade-in animate-float"
            style={{ animationDelay: '0.1s' }}
          >
            {novel.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={novel.cover_url}
                alt={novel.title}
                style={{
                  width: 180,
                  height: 252,
                  objectFit: 'cover',
                  borderRadius: 10,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,137,6,0.2)',
                }}
              />
            ) : (
              <NovelCover title={novel.title} size="lg" />
            )}
          </div>

          {/* Meta */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.2s', opacity: 0, textAlign: 'center' }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 14px',
              borderRadius: 100,
              border: '1px solid rgba(255,137,6,0.3)',
              background: 'rgba(255,137,6,0.08)',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: 'var(--accent)',
              fontFamily: 'sans-serif',
              marginBottom: '1rem',
            }}>
              互动小说
            </div>

            <h1 style={{
              fontFamily: 'serif',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              marginBottom: '0.75rem',
            }}>
              {novel.title}
            </h1>

            <p style={{
              fontFamily: 'sans-serif',
              color: 'var(--accent)',
              fontSize: '1rem',
              opacity: 0.9,
              marginBottom: '1rem',
            }}>
              作者：{novel.author}
            </p>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}>
              {[
                { icon: '📄', label: `${sceneCount} 个场景` },
                { icon: '⏱️', label: '约 10 分钟' },
                { icon: '✨', label: '沉浸体验' },
              ].map(stat => (
                <div key={stat.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                }}>
                  <span>{stat.icon}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description + CTA */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 5vw, 3rem)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Description card */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: '0.3s',
            opacity: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{
            fontFamily: 'serif',
            fontSize: '1.3rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: 'var(--accent)' }}>§</span>
            故事简介
          </h2>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1rem, 2.2vw, 1.1rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.9,
            letterSpacing: '0.02em',
          }}>
            {novel.description}
          </p>
        </div>

        {/* Decorative separator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: '2rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>✦</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* CTA */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: '0.45s',
            opacity: 0,
            textAlign: 'center',
          }}
        >
          <Link
            href={`/read/${novel.id}`}
            className="btn-primary animate-pulse-glow"
            style={{
              fontSize: '1.1rem',
              padding: '1rem 3rem',
              borderRadius: 12,
            }}
          >
            开始阅读 →
          </Link>
          <p style={{
            marginTop: '1rem',
            fontFamily: 'sans-serif',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            opacity: 0.7,
          }}>
            支持语音朗读 · 翻页动画 · 进度记忆
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/" className="nav-link-hover" style={{
            fontFamily: 'sans-serif',
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}>
            ← 返回书阁，探索更多故事
          </Link>
        </div>
      </div>
    </div>
  )
}
