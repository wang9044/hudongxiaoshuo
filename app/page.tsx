import Link from 'next/link'
import { supabase, Novel } from '@/lib/supabase'
import StarField from '@/components/StarField'
import DarkModeToggle from '@/components/DarkModeToggle'
import NovelCover from '@/components/NovelCover'
import { BookOpenText } from 'lucide-react'

async function getNovels(): Promise<Novel[]> {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching novels:', error)
    return []
  }
  return data ?? []
}

export default async function HomePage() {
  const novels = await getNovels()

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}>
      <StarField />

      {/* Nav */}
      <nav
        style={{
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
        {/* Left: Logo + Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}>
            <BookOpenText style={{ fontSize: 24, color: '#fa8706' }} />
            <span
              style={{
                fontFamily: 'serif',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.05em',
              }}>
              午夜书阁
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link
              href="/"
              className="nav-link-hover"
              style={{
                textDecoration: 'none',
                fontFamily: 'sans-serif',
                fontSize: '0.875rem',
              }}>
              首页
            </Link>
            <Link
              href="/ranking"
              className="nav-link-hover"
              style={{
                textDecoration: 'none',
                fontFamily: 'sans-serif',
                fontSize: '0.875rem',
              }}>
              排行榜
            </Link>
            <Link
              href="/category"
              className="nav-link-hover"
              style={{
                textDecoration: 'none',
                fontFamily: 'sans-serif',
                fontSize: '0.875rem',
              }}>
              分类
            </Link>
            <Link
              href="/creator"
              className="btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '5px 14px',
                borderRadius: 8,
              }}>
              创作者中心
            </Link>
            <Link
              href="/download"
              className="nav-link-hover"
              style={{
                textDecoration: 'none',
                fontFamily: 'sans-serif',
                fontSize: '0.875rem',
              }}>
              下载APP
            </Link>
          </div>
        </div>

        {/* Right: Search + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 14,
                opacity: 0.5,
                pointerEvents: 'none',
              }}></span>
            <input
              type="text"
              placeholder="搜索小说..."
              className="nav-search"
            />
          </div>
          <Link
            href="/login"
            className="nav-link-hover"
            style={{
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}>
            登录
          </Link>
          <Link
            href="/register"
            className="btn-secondary"
            style={{
              fontSize: '0.8rem',
              padding: '5px 14px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
            }}>
            注册
          </Link>
          <DarkModeToggle />
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'clamp(4rem, 12vw, 8rem) clamp(1rem, 5vw, 3rem)',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 100,
              border: '1px solid rgba(255,137,6,0.3)',
              background: 'rgba(255,137,6,0.08)',
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              fontFamily: 'sans-serif',
              marginBottom: '1.5rem',
            }}>
            <span>✦</span>
            <span>沉浸式互动小说平台</span>
            <span>✦</span>
          </div>
        </div>

        <h1
          className="animate-fade-in-up"
          style={{
            animationDelay: '0.2s',
            opacity: 0,
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            fontFamily: 'serif',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}>
          <span className="gradient-text">午夜书阁</span>
          <br />
          <span
            style={{
              color: 'var(--text-primary)',
              fontSize: '0.6em',
              fontWeight: 400,
            }}>
            Midnight Library
          </span>
        </h1>

        <p
          className="animate-fade-in-up"
          style={{
            animationDelay: '0.35s',
            opacity: 0,
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.8,
          }}>
          在故事与现实的边界，
          <br />
          找到只属于你的那本书。
        </p>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '0.5s', opacity: 0 }}>
          <a
            href="#novels"
            className="btn-primary"
            style={{ fontSize: '0.95rem' }}>
            探索故事 →
          </a>
        </div>

        {/* Floating decorative book */}
        <div
          className="animate-float"
          style={{
            marginTop: '3rem',
            fontSize: '5rem',
            filter: 'drop-shadow(0 0 30px rgba(255,137,6,0.4))',
          }}
          aria-hidden="true">
          📖
        </div>
      </section>

      {/* Novel Grid */}
      <section
        id="novels"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 5vw, 3rem)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontFamily: 'serif',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}>
            精选故事
          </h2>
          <div
            style={{
              width: 60,
              height: 3,
              background: 'linear-gradient(90deg, var(--accent), var(--gold))',
              borderRadius: 2,
              margin: '0 auto',
            }}
          />
        </div>

        {novels.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--text-secondary)',
              fontFamily: 'sans-serif',
            }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <p>正在连接书库...</p>
            <p
              style={{
                fontSize: '0.875rem',
                marginTop: '0.5rem',
                opacity: 0.7,
              }}>
              请确认 Supabase 配置已完成
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}>
            {novels.map((novel, index) => (
              <NovelCard key={novel.id} novel={novel} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          marginTop: '2rem',
        }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
              fontFamily: 'serif',
              marginBottom: '3rem',
              color: 'var(--text-secondary)',
            }}>
            为什么选择午夜书阁？
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}>
            {[
              {
                icon: '📖',
                title: '沉浸式阅读',
                desc: '精心排版，让文字带你入境',
              },
              { icon: '🎙️', title: '语音朗读', desc: '让故事流入你的耳朵' },
              { icon: '🌙', title: '护眼深色', desc: '午夜阅读，眼睛不疲惫' },
              { icon: '✨', title: '互动叙事', desc: '你的选择，改变故事走向' },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  borderRadius: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  transition: 'border-color 0.3s',
                }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                  {f.icon}
                </div>
                <div
                  style={{
                    fontFamily: 'sans-serif',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                  }}>
                  {f.title}
                </div>
                <div
                  style={{
                    fontFamily: 'sans-serif',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-secondary)',
          fontFamily: 'sans-serif',
          fontSize: '0.875rem',
          borderTop: '1px solid var(--border)',
        }}>
        <span>🌙 午夜书阁 · Midnight Library</span>
        <span style={{ margin: '0 0.75rem', opacity: 0.3 }}>·</span>
        <span>在故事与现实的边界</span>
      </footer>
    </div>
  )
}

function NovelCard({ novel, index }: { novel: Novel; index: number }) {
  return (
    <Link
      href={`/novel/${novel.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}>
      <article
        className="novel-card animate-fade-in-up"
        style={{
          animationDelay: `${0.1 + index * 0.1}s`,
          opacity: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {/* Cover area */}
        <div
          style={{
            background:
              'linear-gradient(160deg, #1a1035 0%, #0f0e17 50%, #2d1b4e 100%)',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            position: 'relative',
            overflow: 'hidden',
          }}>
          {/* Ambient glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 80%, rgba(255,137,6,0.15) 0%, transparent 70%)',
            }}
          />
          {novel.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={novel.cover_url}
              alt={novel.title}
              style={{
                width: 120,
                height: 168,
                objectFit: 'cover',
                borderRadius: 6,
                position: 'relative',
                zIndex: 1,
              }}
            />
          ) : (
            <div style={{ position: 'relative', zIndex: 1 }}>
              <NovelCover title={novel.title} size="md" />
            </div>
          )}
        </div>

        {/* Info */}
        <div
          style={{
            padding: '1.25rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8,
            }}>
            <h3
              style={{
                fontFamily: 'serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
              }}>
              {novel.title}
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent)',
                background: 'rgba(255,137,6,0.12)',
                padding: '2px 8px',
                borderRadius: 100,
                whiteSpace: 'nowrap',
                fontFamily: 'sans-serif',
                flexShrink: 0,
              }}>
              互动
            </span>
          </div>

          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: '0.8rem',
              color: 'var(--accent)',
              opacity: 0.8,
            }}>
            {novel.author}
          </p>

          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
            {novel.description}
          </p>

          <div
            style={{
              marginTop: 'auto',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <span
              style={{
                fontFamily: 'sans-serif',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}>
              点击阅读 →
            </span>
            <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>📖</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
