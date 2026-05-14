import { useRef } from 'react'
import styles from './UploadScreen.module.css'

function MediaThumb({ item, onRemove }) {
  const isVideo = item.type?.startsWith('video/')
  return (
    <div className={styles.thumb}>
      {isVideo ? (
        <div className={styles.videoThumb}>
          <video src={item.url} preload="metadata" muted playsInline />
          <div className={styles.playIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      ) : (
        <img src={item.url} alt={item.name} />
      )}
      <button className={styles.remove} onClick={() => onRemove(item.id)}>×</button>
    </div>
  )
}

export default function UploadScreen({ media, onFiles, onRemove, onStart }) {
  const inputRef = useRef(null)

  const handleChange = (e) => {
    onFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    onFiles(e.dataTransfer.files)
  }

  return (
    <div className={styles.screen}>
      <div
        className={styles.card}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className={styles.icon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <h1>Media Yuklash</h1>
        <p>Rasm yoki video tanlang / bu yerga tashlang</p>

        <label className={styles.uploadBtn}>
          + Fayl Tanlash
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={handleChange}
          />
        </label>

        {media.length > 0 && (
          <div className={styles.previews}>
            {media.map(item => (
              <MediaThumb key={item.id} item={item} onRemove={onRemove} />
            ))}
          </div>
        )}

        <button
          className={styles.startBtn}
          disabled={media.length === 0}
          onClick={onStart}
        >
          Karuselni Boshlash
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
