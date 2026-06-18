import { useEffect, useRef, useState } from 'react'
import './App.css'
import ScanPage from './ScanPage'
import ResultPage from './ResultPage'

const DANMAKU = [
  { text: '终于把需求评审过了 😊', emotion: 'happy' },
  { text: '摸鱼摸到了好视频，很满足', emotion: 'happy' },
  { text: '同事带了好吃的，开心', emotion: 'happy' },
  { text: '下班提前一小时，爽', emotion: 'happy' },
  { text: '早上咖啡特别香', emotion: 'happy' },
  { text: '连续开了5个会，脑子不转了', emotion: 'tired' },
  { text: '昨晚只睡了4小时', emotion: 'tired' },
  { text: '项目快到deadline了，顶不住', emotion: 'tired' },
  { text: '今天的bug怎么都找不到', emotion: 'tired' },
  { text: '上班摸鱼都没力气', emotion: 'tired' },
  { text: '老板突然说要看周报', emotion: 'anxious' },
  { text: '感觉自己什么都没做完', emotion: 'anxious' },
  { text: '下周要上线，代码还没写', emotion: 'anxious' },
  { text: '不知道方向对不对，很慌', emotion: 'anxious' },
  { text: '今天说错话了，一直在想', emotion: 'anxious' },
]

export default function App() {
  const cameraRef = useRef(null)
  const canvasRef = useRef(null)
  const [danmakuList, setDanmakuList] = useState([])
  const counterRef = useRef(0)

  useEffect(() => {
    startCamera()
    const interval = setInterval(addDanmaku, 2800)
    initRipples()
    return () => clearInterval(interval)
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream
        cameraRef.current.play()
      }
    } catch (e) {
      console.log('摄像头未授权')
    }
  }

  const addDanmaku = () => {
    const item = DANMAKU[Math.floor(Math.random() * DANMAKU.length)]
    const id = counterRef.current++
    const top = 8 + Math.random() * 78
    setDanmakuList((prev) => [...prev.slice(-12), { ...item, id, top }])
    setTimeout(() => {
      setDanmakuList((prev) => prev.filter((d) => d.id !== id))
    }, 9000)
  }

  const initRipples = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 0.8 + Math.random() * 2.2,
      speedY: 0.15 + Math.random() * 0.55,
      driftX: (Math.random() - 0.5) * 0.3,
      alpha: 0.2 + Math.random() * 0.6,
      color:
        Math.random() > 0.75
          ? '255,190,120'
          : Math.random() > 0.5
            ? '255,145,90'
            : '255,255,255',
    }))

    const resetParticle = (particle) => {
      particle.x = Math.random() * canvas.width
      particle.y = canvas.height + Math.random() * 40
      particle.size = 0.8 + Math.random() * 2.2
      particle.speedY = 0.15 + Math.random() * 0.55
      particle.driftX = (Math.random() - 0.5) * 0.3
      particle.alpha = 0.2 + Math.random() * 0.6
      particle.color =
        Math.random() > 0.75
          ? '255,190,120'
          : Math.random() > 0.5
            ? '255,145,90'
            : '255,255,255'
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles.forEach((particle) => {
        particle.x = Math.min(particle.x, canvas.width)
        particle.y = Math.min(particle.y, canvas.height)
      })
    }

    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i]
        particle.y -= particle.speedY
        particle.x += particle.driftX

        if (particle.y + particle.size < 0) {
          resetParticle(particle)
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color},${particle.alpha})`
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()
  }

  return (
    <div className="page">
      <video ref={cameraRef} className="camera-bg" muted playsInline autoPlay />

      <div className="dark-overlay" />

      <canvas ref={canvasRef} className="ripple-canvas" />

      <div className="danmaku-layer">
        {danmakuList.map((d) => (
          <div
            key={d.id}
            className={`danmaku-item danmaku-${d.emotion}`}
            style={{ top: `${d.top}%` }}
          >
            {d.text}
          </div>
        ))}
      </div>

      <div className="bg-text">MONA</div>

      <div className="mona-center">
        <video className="mona-video" src="/左到右.mp4" autoPlay loop muted playsInline />
        <div className="mona-title">她看见你了</div>
        <div className="mona-subtitle">走近一点，让她感受你今天的心情</div>
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
        <ScanPage />
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 30 }}>
        <ResultPage />
      </div>
    </div>
  )
}
