import { useState, useCallback } from 'react'
import UploadScreen from './components/UploadScreen'
import Carousel from './components/Carousel'

export default function App() {
  const [images, setImages] = useState([])
  const [started, setStarted] = useState(false)

  const handleFiles = useCallback((files) => {
    const newImgs = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({ url: URL.createObjectURL(f), name: f.name, id: crypto.randomUUID() }))
    setImages(prev => [...prev, ...newImgs])
  }, [])

  const removeImage = useCallback((id) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) URL.revokeObjectURL(img.url)
      return prev.filter(i => i.id !== id)
    })
  }, [])

  if (started && images.length > 0) {
    return <Carousel images={images} onBack={() => setStarted(false)} />
  }

  return (
    <UploadScreen
      images={images}
      onFiles={handleFiles}
      onRemove={removeImage}
      onStart={() => setStarted(true)}
    />
  )
}
