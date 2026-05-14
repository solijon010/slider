import { useRef } from 'react'
import styles from './UploadScreen.module.css'

export default function UploadScreen({ images, onFiles, onRemove, onStart }) {
  const inputRef = useRef(null)

  const handleChange = (e) => onFiles(e.target.files)

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

        <h1>Rasm Yuklash</h1>
        <p>Rasmlarni tanlang yoki bu yerga tashlang</p>

        <label className={styles.uploadBtn}>
          + Rasm Tanlash
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleChange}
          />
        </label>

        {images.length > 0 && (
          <div className={styles.previews}>
            {images.map(img => (
              <div key={img.id} className={styles.thumb}>
                <img src={img.url} alt={img.name} />
                <button className={styles.remove} onClick={() => onRemove(img.id)}>×</button>
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.startBtn}
          disabled={images.length === 0}
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
