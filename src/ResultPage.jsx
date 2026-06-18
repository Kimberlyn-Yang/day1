import { useEffect, useState } from 'react'
import './ResultPage.css'

const MOCK_RESULT = {
  emotions: [
    { name: '疲惫', value: 60, color: '#6aaeff', shadow: 'rgba(100,160,255,0.5)' },
    { name: '焦虑', value: 25, color: '#ff8cb4', shadow: 'rgba(255,140,180,0.5)' },
    { name: '开心', value: 15, color: '#ffd84a', shadow: 'rgba(255,220,80,0.5)' },
  ],
  headline: '你今天有点疲惫',
  gptText: '没关系，每一个努力撑着的人都值得被好好照顾。今天辛苦了。',
  mood: 'negative',
}

export default function ResultPage() {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!started) return
    const full = MOCK_RESULT.gptText
    let i = 0
    setDisplayed('')
    const timer = setInterval(() => {
      i++
      setDisplayed(full.slice(0, i))
      if (i >= full.length) clearInterval(timer)
    }, 60)
    return () => clearInterval(timer)
  }, [started])

  const sorted = [...MOCK_RESULT.emotions].sort((a, b) => b.value - a.value)
  const maxVal = sorted[0].value
  const sizes = sorted.map((e) => ({
    ...e,
    size: 120 + (e.value / maxVal) * 160,
  }))

  return (
    <div className="result-page">
      <div className="result-glow" />

      <div className="result-main">
        <div className="result-left">
          <div className="result-label">今日情绪</div>
          <div className="result-title">{MOCK_RESULT.headline}</div>

          <video
            className="result-mona"
            src={MOCK_RESULT.mood === 'positive' ? '/撒花.mp4' : '/拥抱.mp4'}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <div className="result-bubbles">
          {sizes.map((e, i) => (
            <div
              key={e.name}
              className={`bubble bubble-${i}`}
              style={{
                width: e.size,
                height: e.size,
                background: e.color,
                boxShadow: `0 0 ${e.size * 0.6}px ${e.shadow}`,
              }}
            >
              <div className="bubble-value">{e.value}%</div>
              <div className="bubble-name">{e.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="result-gpt">
        {displayed}
        <span className="cursor">|</span>
      </div>

      <div className="result-subtitle">——MONA 读取于今日</div>
    </div>
  )
}
