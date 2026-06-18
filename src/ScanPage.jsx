import { useEffect, useRef, useState } from 'react'
import './ScanPage.css'

const FULL_TEXT = '你的情绪正在被看见，让我们一起感受······'

export default function ScanPage() {
  const [displayed, setDisplayed] = useState('')
  const [ripples, setRipples] = useState([])
  const rippleCounter = useRef(0)

  // 打字机效果：整句话逐字出现，打完后停留
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setDisplayed(FULL_TEXT.slice(0, i))
      if (i >= FULL_TEXT.length) {
        clearInterval(timer)
      }
    }, 120)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const id = rippleCounter.current++
      setRipples((prev) => [...prev, id])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r !== id))
      }, 3000)
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="scan-page">
      <div className="ripple-wrap">
        {ripples.map((id) => (
          <div key={id} className="ripple-ring" />
        ))}

        <video className="scan-mona" src="/左到右.mp4" autoPlay loop muted playsInline />
      </div>

      <div className="scan-text">
        {displayed}
        <span className="cursor">|</span>
      </div>
    </div>
  )
}
