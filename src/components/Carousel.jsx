import { useState, useEffect, useCallback, useRef } from 'react'
import styles from './Carousel.module.css'

const AUTO_DELAY = 10000

function Slide({ item, active }) {
  const isVideo = item.type?.startsWith('video/')
  return (
    <div className={`${styles.slide} ${active ? styles.active : ''}`}>
      {isVideo ? (
        <video src={item.url} autoPlay muted loop playsInline className={styles.media} />
      ) : (
        <img src={item.url} alt={item.name} className={`${styles.media} ${active ? styles.kenBurns : ''}`} />
      )}
    </div>
  )
}

export default function Carousel({ media, onBack, onDelete, onFiles }) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const timerRef = useRef(null)
  const progressRef = useRef(null)
  const startRef = useRef(null)
  const touchX = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (current >= media.length) setCurrent(Math.max(0, media.length - 1))
  }, [media.length, current])

  const goTo = useCallback((index) => {
    setCurrent(((index % media.length) + media.length) % media.length)
    setProgress(0)
    setConfirmDelete(false)
  }, [media.length])

  useEffect(() => {
    clearInterval(timerRef.current)
    clearInterval(progressRef.current)
    setProgress(0)
    startRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % media.length)
      setProgress(0)
      startRef.current = Date.now()
    }, AUTO_DELAY)

    progressRef.current = setInterval(() => {
      setProgress(Math.min(((Date.now() - startRef.current) / AUTO_DELAY) * 100, 100))
    }, 30)

    return () => {
      clearInterval(timerRef.current)
      clearInterval(progressRef.current)
    }
  }, [current, media.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
      if (e.key === 'Escape')     { setConfirmDelete(false); onBack() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo, onBack])

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    const id = media[current].id
    setConfirmDelete(false)
    onDelete(id)
  }

  const handleAddFiles = (e) => {
    onFiles(e.target.files)
    e.target.value = ''
  }

  return (
    <div className={styles.screen} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      <div className={styles.slides}>
        {media.map((item, i) => (
          <Slide key={item.id} item={item} active={i === current} />
        ))}
      </div>

      {media.length > 1 && (
        <>
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
          <div className={styles.dots}>
            {media.map((item, i) => (
              <button
                key={item.id}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}

      {/* Yuqori chap: Orqaga + Qo'shish */}
      <div className={styles.topLeft}>
        <button className={styles.pill} onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Orqaga
        </button>
        <label className={styles.pill}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Qo'shish
          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleAddFiles} />
        </label>
      </div>

      {/* Yuqori o'ng: Hisoblagich + O'chirish */}
      <div className={styles.topRight}>
        <div className={styles.counter}>{current + 1} / {media.length}</div>
        <button
          className={`${styles.deleteBtn} ${confirmDelete ? styles.deleteBtnConfirm : ''}`}
          onClick={handleDelete}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          {confirmDelete ? 'Tasdiqlang' : "O'chirish"}
        </button>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
