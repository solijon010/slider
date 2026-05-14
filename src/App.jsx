import { useState, useEffect, useCallback } from 'react'
import { getAllMedia, saveMedia, deleteMedia } from './db'
import UploadScreen from './components/UploadScreen'
import Carousel from './components/Carousel'

export default function App() {
  const [media, setMedia] = useState([])
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Brauzer saqlagan medialarni yuklash
  useEffect(() => {
    getAllMedia()
      .then(items => {
        if (items.length > 0) {
          const loaded = items.map(item => ({
            ...item,
            url: URL.createObjectURL(item.blob),
          }))
          setMedia(loaded)
          setStarted(true)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  // Barcha media o'chirilsa — upload sahifaga qayt
  useEffect(() => {
    if (started && media.length === 0) setStarted(false)
  }, [media, started])

  const handleFiles = useCallback(async (files) => {
    const newItems = []
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) continue
      const id = Date.now() + Math.random()
      const dbItem = { id, name: f.name, type: f.type, blob: f }
      await saveMedia(dbItem)
      newItems.push({ ...dbItem, url: URL.createObjectURL(f) })
    }
    setMedia(prev => [...prev, ...newItems])
  }, [])

  const removeMedia = useCallback(async (id) => {
    await deleteMedia(id)
    setMedia(prev => {
      const item = prev.find(i => i.id === id)
      if (item) URL.revokeObjectURL(item.url)
      return prev.filter(i => i.id !== id)
    })
  }, [])

  if (loading) {
    return (
      <div style={{
        width: '100vw', height: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0f0f13', color: '#a1a1aa',
      }}>
        Yuklanmoqda...
      </div>
    )
  }

  if (started && media.length > 0) {
    return (
      <Carousel
        media={media}
        onBack={() => setStarted(false)}
        onDelete={removeMedia}
        onFiles={handleFiles}
      />
    )
  }

  return (
    <UploadScreen
      media={media}
      onFiles={handleFiles}
      onRemove={removeMedia}
      onStart={() => setStarted(true)}
    />
  )
}
