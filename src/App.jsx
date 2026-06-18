import { useEffect, useRef, useState } from 'react'
import './App.css'
import MoodBottle from './MoodBottle'
import ResultPage from './ResultPage'
import ScanPage from './ScanPage'

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

const WEATHER = {
  total: 12,
  main: '有点疲惫',
  happy: 35,
  tired: 45,
  anxious: 20,
}

function PageOne() {
  const cameraRef = useRef(null)
  const canvasRef = useRef(null)
  const spiralRef = useRef(null)
  const [danmakuList, setDanmakuList] = useState([])
  const counterRef = useRef(0)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream
          cameraRef.current.play()
        }
      } catch {
        console.log('摄像头未授权')
      }
    }

    const addDanmaku = () => {
      const item = DANMAKU[Math.floor(Math.random() * DANMAKU.length)]
      const id = counterRef.current++
      const top = 15 + Math.random() * 65
      setDanmakuList((prev) => [...prev.slice(-12), { ...item, id, top }])
      setTimeout(() => {
        setDanmakuList((prev) => prev.filter((d) => d.id !== id))
      }, 9000)
    }

    const initSpiral = () => {
      const canvas = spiralRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      let angle = 0

      const colors = [
        { color: 'rgba(255,220,80,', weight: WEATHER.happy },
        { color: 'rgba(100,160,255,', weight: WEATHER.tired },
        { color: 'rgba(255,140,180,', weight: WEATHER.anxious },
      ]

      const lines = []
      colors.forEach(({ color, weight }) => {
        const count = Math.floor(weight * 0.8)
        for (let i = 0; i < count; i += 1) {
          lines.push({
            color,
            startAngle: Math.random() * Math.PI * 2,
            speed: 0.001 + Math.random() * 0.002,
            radius: 60 + Math.random() * Math.min(cx, cy) * 0.85,
            opacity: 0.06 + Math.random() * 0.1,
            width: 0.4 + Math.random() * 0.8,
          })
        }
      })

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        angle += 0.003

        lines.forEach((line) => {
          const a = line.startAngle + angle * line.speed * 300
          const spirals = 3
          ctx.beginPath()
          for (let t = 0; t < Math.PI * 2 * spirals; t += 0.05) {
            const r = (line.radius / (Math.PI * 2 * spirals)) * t
            const x = cx + r * Math.cos(t + a)
            const y = cy + r * Math.sin(t + a)
            if (t === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.strokeStyle = `${line.color}${line.opacity})`
          ctx.lineWidth = line.width
          ctx.stroke()
        })

        requestAnimationFrame(draw)
      }

      draw()
    }

    const initStars = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const stars = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.5 + Math.random() * 1.5,
        speed: 0.1 + Math.random() * 0.3,
        opacity: 0.2 + Math.random() * 0.5,
      }))

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        stars.forEach((s) => {
          s.y -= s.speed
          if (s.y < 0) {
            s.y = canvas.height
            s.x = Math.random() * canvas.width
          }
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
          ctx.fill()
        })
        requestAnimationFrame(draw)
      }

      draw()
    }

    startCamera()
    const interval = setInterval(addDanmaku, 2800)
    initSpiral()
    initStars()

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page">
      <video ref={cameraRef} className="camera-bg" muted playsInline autoPlay />
      <div className="dark-overlay" />
      <canvas ref={spiralRef} className="spiral-canvas" />
      <canvas ref={canvasRef} className="star-canvas" />

      <div className="weather-bar">
        <div className="weather-left">
          <span className="weather-total">
            今天已有 <strong>{WEATHER.total}</strong> 位同事被她看见
          </span>
          <span className="weather-main">今日情绪：{WEATHER.main}</span>
        </div>
        <div className="weather-tags">
          <span className="wtag wtag-happy">😊 开心 {WEATHER.happy}%</span>
          <span className="wtag wtag-tired">😴 疲惫 {WEATHER.tired}%</span>
          <span className="wtag wtag-anxious">😰 焦虑 {WEATHER.anxious}%</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 60, right: 40, zIndex: 8 }}>
        <MoodBottle />
      </div>

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
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('page2')

  return (
    <div className="page-shell">
      {activePage === 'page1' && <PageOne />}
      {activePage === 'page2' && <ScanPage />}
      {activePage === 'page3' && <ResultPage />}

      <div className="page-switcher">
        <button
          type="button"
          className={`page-switcher-button ${activePage === 'page1' ? 'is-active' : ''}`}
          onClick={() => setActivePage('page1')}
        >
          页面1
        </button>
        <button
          type="button"
          className={`page-switcher-button ${activePage === 'page2' ? 'is-active' : ''}`}
          onClick={() => setActivePage('page2')}
        >
          页面2
        </button>
        <button
          type="button"
          className={`page-switcher-button ${activePage === 'page3' ? 'is-active' : ''}`}
          onClick={() => setActivePage('page3')}
        >
          页面3
        </button>
      </div>
    </div>
  )
}
