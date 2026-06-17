import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const isSkin = (r, g, b) => {
  return (
    r > 95 &&
    g > 40 &&
    b > 20 &&
    r > g &&
    r > b &&
    Math.abs(r - g) > 15 &&
    r - g > 15
  )
}

const detectSkinPixels = (imageData, width, height) => {
  const { data } = imageData
  let sumX = 0
  let count = 0
  const step = 8

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      if (isSkin(r, g, b)) {
        sumX += x
        count += 1
      }
    }
  }

  if (count > 80) {
    return { detected: true, x: sumX / count }
  }

  return { detected: false, x: 0 }
}

export default function App() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const animRef = useRef(null)
  const [currentLook, setCurrentLook] = useState('center')
  const [faceDetected, setFaceDetected] = useState(false)

  const detectFace = useCallback(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    const analyze = () => {
      const video = videoRef.current

      if (!video || video.readyState < 2) {
        animRef.current = requestAnimationFrame(analyze)
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = detectSkinPixels(imageData, canvas.width, canvas.height)

      if (result.detected) {
        setFaceDetected(true)
        const centerX = result.x / canvas.width

        if (centerX < 0.4) {
          setCurrentLook('left')
        } else if (centerX > 0.6) {
          setCurrentLook('right')
        } else {
          setCurrentLook('center')
        }
      } else {
        setFaceDetected(false)
        setCurrentLook('center')
      }

      animRef.current = requestAnimationFrame(analyze)
    }

    animRef.current = requestAnimationFrame(analyze)
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream

      if (!videoRef.current) {
        return
      }

      videoRef.current.srcObject = stream
      await videoRef.current.play()
      detectFace()
    } catch (error) {
      console.log('摄像头未授权', error)
    }
  }, [detectFace])

  useEffect(() => {
    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [startCamera])

  const getVideoSrc = () => {
    if (currentLook === 'left') return '/左到右.mp4'
    if (currentLook === 'right') return '/右到左.mp4'
    return '/左到右.mp4'
  }

  return (
    <div className="page">
      <video ref={videoRef} style={{ display: 'none' }} muted playsInline />

      <nav className="navbar">
        <div className="navbar-logo">✳</div>
        <div className="navbar-item">情绪感知</div>
        <div className="navbar-item">互动体验</div>
        <div className="navbar-item">今日天气</div>
        <div className="navbar-item">关于 MONA</div>
      </nav>

      <video
        key={getVideoSrc()}
        className="hero-image"
        src={getVideoSrc()}
        autoPlay
        muted
        playsInline
      />

      <div className="hero-text">
        <div className="brand-name">mona</div>
        <div className="hero-title">她看见你了。</div>
      </div>

      <div className="scroll-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            d="M12 5v14M5 12l7 7 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="status-chip">
        {faceDetected ? <span>她看见你了</span> : '今天已有 12 位同事被她看见'}
      </div>
    </div>
  )
}
