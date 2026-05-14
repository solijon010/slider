import { useState, useEffect, useCallback, useRef } from 'react'
import styles from './Carousel.module.css'

const AUTO_DELAY = 10000

export default function Carousel({ images, onBack }) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const progressRef = useRef(null)
  const startRef = useRef(null)

  const goTo = useCallback((index) => {
    setCurrent(((index % images.length) + images.length) % images.length)
    setProgress(0)
  }, [images.length])

  // auto-play + progress bar
  useEffect(() => {
    clearInterval(timerRef.current)
    clearInterval(progressRef.current)
    setProgress(0)
    startRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % images.length)
      setProgress(0)
      startRef.current = Date.now()
    }, AUTO_DELAY)

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setProgress(Math.min((elapsed / AUTO_DELAY) * 100, 100))
    }, 30)

    return () => {
      clearInterval(timerRef.current)
      clearInterval(progressRef.current)
    }
  }, [current, images.length])

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
      if (e.key === 'Escape')     onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo, onBack])

  // touch/swipe
  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  return (
    <div
      className={styles.screen}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div className={styles.slides}>
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`${styles.slide} ${i === current ? styles.active : ''}`}
          >
            <img src={img.url} alt={img.name} />
          </div>
        ))}
      </div>

      {/* Nav */}
      <button className={`${styles.nav} ${styles.prev}`} onClick={() => goTo(current - 1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button className={`${styles.nav} ${styles.next}`} onClick={() => goTo(current + 1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots */}
      <div className={styles.dots}>
        {images.map((img, i) => (
          <button
            key={img.id}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Counter */}
      <div className={styles.counter}>{current + 1} / {images.length}</div>

      {/* Back */}
      <button className={styles.back} onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Orqaga
      </button>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
