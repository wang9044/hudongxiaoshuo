'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Novel, Scene } from '@/lib/supabase'
import StarField from '@/components/StarField'
import DarkModeToggle from '@/components/DarkModeToggle'

interface ReaderClientProps {
  novel: Novel
  scenes: Scene[]
}

export default function ReaderClient({ novel, scenes }: ReaderClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [animClass, setAnimClass] = useState('animate-page-next')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  const currentScene = scenes[currentIndex]
  const totalScenes = scenes.length
  const progress = totalScenes > 0 ? ((currentIndex + 1) / totalScenes) * 100 : 0

  // Stop TTS when scene changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [currentIndex])

  // Save reading progress
  useEffect(() => {
    if (novel.id) {
      localStorage.setItem(`progress_${novel.id}`, String(currentIndex))
    }
  }, [currentIndex, novel.id])

  // Restore reading progress
  useEffect(() => {
    const saved = localStorage.getItem(`progress_${novel.id}`)
    if (saved !== null) {
      const idx = parseInt(saved, 10)
      if (!isNaN(idx) && idx > 0 && idx < scenes.length) {
        setCurrentIndex(idx)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToScene = useCallback((nextIndex: number, direction: 'next' | 'prev') => {
    if (isAnimating) return
    setIsAnimating(true)
    setAnimClass(direction === 'next' ? 'animate-page-next' : 'animate-page-prev')

    setTimeout(() => {
      setCurrentIndex(nextIndex)
      setIsAnimating(false)
    }, 50)
  }, [isAnimating])

  const handleNext = useCallback(() => {
    if (isAnimating) return
    if (currentIndex < totalScenes - 1) {
      goToScene(currentIndex + 1, 'next')
    } else {
      setIsAnimating(true)
      setTimeout(() => {
        setIsFinished(true)
        setIsAnimating(false)
      }, 50)
    }
  }, [currentIndex, totalScenes, goToScene, isAnimating])

  const handlePrev = useCallback(() => {
    if (isAnimating || currentIndex === 0) return
    goToScene(currentIndex - 1, 'prev')
  }, [currentIndex, goToScene, isAnimating])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        handlePrev()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleNext, handlePrev])

  const toggleTTS = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const text = currentScene?.text?.replace(/\n/g, '。') ?? ''
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    utterance.pitch = 1
    speechRef.current = utterance

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [currentScene, isSpeaking])

  if (isFinished) {
    return <EndScreen novel={novel} onRestart={() => {
      setCurrentIndex(0)
      setIsFinished(false)
      localStorage.removeItem(`progress_${novel.id}`)
    }} />
  }

  if (!currentScene) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>
        <p>暂无场景数据</p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <StarField />

      {/* Top Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15,14,23,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 clamp(1rem, 4vw, 2rem)',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <Link href={`/novel/${novel.id}`} style={{
          textDecoration: 'none',
          color: 'var(--text-secondary)',
          fontFamily: 'sans-serif',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          ← {novel.title}
        </Link>

        {/* Progress indicator */}
        <div style={{
          flex: 1,
          maxWidth: 280,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.05em',
          }}>
            {currentIndex + 1} / {totalScenes}
          </div>
          <div style={{
            width: '100%',
            height: 3,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--gold))',
              borderRadius: 2,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* TTS Button */}
          <button
            onClick={toggleTTS}
            aria-label={isSpeaking ? '停止朗读' : '语音朗读'}
            title={isSpeaking ? '停止朗读' : '语音朗读'}
            style={{
              background: isSpeaking ? 'rgba(255,137,6,0.2)' : 'transparent',
              border: `1px solid ${isSpeaking ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '50%',
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              transition: 'all 0.2s',
              color: isSpeaking ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            {isSpeaking ? '⏹' : '🔊'}
          </button>
          <DarkModeToggle />
        </div>
      </nav>

      {/* Scene dots progress */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '1.5rem clamp(1rem, 5vw, 3rem) 0',
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        {scenes.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (i < currentIndex) goToScene(i, 'prev')
              else if (i > currentIndex) goToScene(i, 'next')
            }}
            aria-label={`跳转到第 ${i + 1} 场景`}
            style={{
              width: i === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: i === currentIndex
                ? 'var(--accent)'
                : i < currentIndex
                ? 'rgba(255,137,6,0.4)'
                : 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Scene Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 5vw, 3rem)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div
          key={currentIndex}
          ref={contentRef}
          className={animClass}
          style={{
            width: '100%',
            maxWidth: '680px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 'clamp(1.5rem, 5vw, 3rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          }} />

          {/* Chapter label */}
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: '0.75rem',
            color: 'var(--accent)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            opacity: 0.8,
          }}>
            第 {currentIndex + 1} 章
          </div>

          {/* Scene title */}
          <h2 style={{
            fontFamily: 'serif',
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            lineHeight: 1.3,
          }}>
            {currentScene.title}
          </h2>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: '1.5rem',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--accent)', fontSize: '0.8rem', opacity: 0.6 }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Scene text */}
          <div className="prose-reader">
            {currentScene.text.split('\n\n').map((para, i) => (
              para.trim() && (
                <p key={i} style={{ marginBottom: '1.25em' }}>
                  {para.trim()}
                </p>
              )
            ))}
          </div>

          {/* Bottom corner ornament */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 20,
            fontSize: '1.5rem',
            opacity: 0.15,
          }}>
            🌙
          </div>
        </div>
      </main>

      {/* Navigation Controls */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        background: 'rgba(15,14,23,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        padding: '1rem clamp(1rem, 5vw, 3rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '0.6rem 1.5rem',
            color: currentIndex === 0 ? 'rgba(255,255,255,0.2)' : 'var(--text-primary)',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'sans-serif',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          onMouseEnter={e => {
            if (currentIndex > 0) {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }
          }}
          onMouseLeave={e => {
            if (currentIndex > 0) {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }
          }}
        >
          ← 上一页
        </button>

        {/* Center info */}
        <div style={{
          textAlign: 'center',
          fontFamily: 'sans-serif',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {currentScene.title}
          </div>
          <div style={{ opacity: 0.6, fontSize: '0.7rem' }}>
            方向键 / 空格 可翻页
          </div>
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          className="btn-primary"
          style={{
            borderRadius: 12,
            padding: '0.6rem 1.5rem',
            fontSize: '0.875rem',
          }}
        >
          {currentIndex === totalScenes - 1 ? '完结 →' : '下一页 →'}
        </button>
      </div>
    </div>
  )
}

function EndScreen({ novel, onRestart }: { novel: Novel; onRestart: () => void }) {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <StarField />

      <div
        className="animate-fade-in-up"
        style={{
          opacity: 0,
          zIndex: 1,
          position: 'relative',
          textAlign: 'center',
          maxWidth: '600px',
        }}
      >
        {/* Glow circle */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,137,6,0.3) 0%, transparent 70%)',
          border: '2px solid rgba(255,137,6,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          fontSize: '3rem',
          animation: 'pulseGlow 2s ease-in-out infinite',
        }}>
          🌙
        </div>

        <div style={{
          fontFamily: 'sans-serif',
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '1rem',
          opacity: 0.8,
        }}>
          故事终章
        </div>

        <h1 style={{
          fontFamily: 'serif',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          lineHeight: 1.2,
        }}>
          《{novel.title}》
        </h1>

        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.9,
          marginBottom: '2.5rem',
          letterSpacing: '0.03em',
        }}>
          你合上了笔记本。<br />
          图书馆已经消融，但故事留了下来。<br />
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
            ——感谢你的阅读
          </span>
        </p>

        {/* Separator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: '2.5rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>✦ ✦ ✦</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onRestart} className="btn-secondary">
            ↺ 重新阅读
          </button>
          <Link href="/" className="btn-primary">
            探索更多故事 →
          </Link>
        </div>
      </div>
    </div>
  )
}
