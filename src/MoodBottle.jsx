import { useEffect, useRef } from 'react'

const WEATHER = {
  total: 12,
  happy: 35,
  tired: 45,
  anxious: 20,
}

export default function MoodBottle() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = (canvas.width = 180)
    const H = (canvas.height = 220)

    const total = WEATHER.happy + WEATHER.tired + WEATHER.anxious
    const counts = {
      happy: Math.round((WEATHER.happy / total) * 12),
      tired: Math.round((WEATHER.tired / total) * 12),
      anxious: Math.round((WEATHER.anxious / total) * 12),
    }

    const balls = []
    const configs = [
      { color: 'rgba(255,220,80,', glow: '#ffd84a', count: counts.happy },
      { color: 'rgba(100,160,255,', glow: '#6aaeff', count: counts.tired },
      { color: 'rgba(255,140,180,', glow: '#ff8cb4', count: counts.anxious },
    ]

    configs.forEach(({ color, glow, count }) => {
      for (let i = 0; i < count; i += 1) {
        balls.push({
          x: 40 + Math.random() * 100,
          y: 80 + Math.random() * 110,
          r: 8 + Math.random() * 8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color,
          glow,
          phase: Math.random() * Math.PI * 2,
        })
      }
    })

    const bottleX = W / 2
    const bottleY = H / 2 - 10
    const bottleR = 72

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      const glowGrad = ctx.createRadialGradient(
        bottleX,
        bottleY,
        bottleR * 0.5,
        bottleX,
        bottleY,
        bottleR,
      )
      glowGrad.addColorStop(0, 'rgba(255,120,60,0)')
      glowGrad.addColorStop(1, 'rgba(255,120,60,0.08)')
      ctx.beginPath()
      ctx.arc(bottleX, bottleY, bottleR + 10, 0, Math.PI * 2)
      ctx.fillStyle = glowGrad
      ctx.fill()

      ctx.beginPath()
      ctx.arc(bottleX, bottleY, bottleR, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(bottleX - 22, bottleY - 22, 18, 0, Math.PI * 2)
      const hlGrad = ctx.createRadialGradient(
        bottleX - 22,
        bottleY - 22,
        0,
        bottleX - 22,
        bottleY - 22,
        18,
      )
      hlGrad.addColorStop(0, 'rgba(255,255,255,0.08)')
      hlGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = hlGrad
      ctx.fill()

      balls.forEach((b) => {
        b.phase += 0.012
        b.x += b.vx + Math.sin(b.phase) * 0.15
        b.y += b.vy + Math.cos(b.phase * 0.7) * 0.12

        const dx = b.x - bottleX
        const dy = b.y - bottleY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist + b.r > bottleR - 2) {
          const nx = dx / dist
          const ny = dy / dist
          b.x = bottleX + nx * (bottleR - b.r - 2)
          b.y = bottleY + ny * (bottleR - b.r - 2)
          b.vx -= nx * 0.1
          b.vy -= ny * 0.1
        }

        b.vx *= 0.99
        b.vy *= 0.99

        const bg = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r * 1.8)
        bg.addColorStop(0, `${b.color}0.15)`)
        bg.addColorStop(1, `${b.color}0)`)
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r * 1.8, 0, Math.PI * 2)
        ctx.fillStyle = bg
        ctx.fill()

        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.3,
          b.y - b.r * 0.3,
          b.r * 0.1,
          b.x,
          b.y,
          b.r,
        )
        grad.addColorStop(0, `${b.color}0.95)`)
        grad.addColorStop(1, `${b.color}0.5)`)
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      ctx.font = '500 13px -apple-system, PingFang SC'
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.textAlign = 'center'
      ctx.fillText(`${WEATHER.total} 位同事`, bottleX, H - 8)

      requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: 180,
        height: 220,
        display: 'block',
      }}
    />
  )
}
