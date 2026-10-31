import { useEffect, useRef } from 'react'

function generateWorldPoints() {
  const points = []

  const regions = [
    { minLat: 36, maxLat: 65, minLon: -10, maxLon: 35, count: 200 }, // Europe
    { minLat: 15, maxLat: 40, minLon: 30, maxLon: 60, count: 120 }, // Mediterranean & Mid East
    { minLat: -35, maxLat: 35, minLon: -15, maxLon: 50, count: 240 }, // Africa
    { minLat: 15, maxLat: 68, minLon: -130, maxLon: -60, count: 260 }, // North America
    { minLat: -55, maxLat: 12, minLon: -80, maxLon: -35, count: 180 }, // South America
    { minLat: 10, maxLat: 70, minLon: 60, maxLon: 145, count: 420 }, // Asia
    { minLat: -10, maxLat: 20, minLon: 95, maxLon: 140, count: 130 }, // SE Asia
    { minLat: -45, maxLat: -12, minLon: 112, maxLon: 175, count: 140 }, // Australia
  ]

  regions.forEach((r) => {
    for (let i = 0; i < r.count; i++) {
      const lat = r.minLat + Math.random() * (r.maxLat - r.minLat)
      const lon = r.minLon + Math.random() * (r.maxLon - r.minLon)
      points.push({
        lat: (lat * Math.PI) / 180,
        lon: (lon * Math.PI) / 180,
      })
    }
  })

  // Atmospheric background dots
  for (let lat = -80; lat <= 80; lat += 12) {
    for (let lon = -180; lon < 180; lon += 18) {
      if (Math.random() > 0.45) {
        points.push({
          lat: (lat * Math.PI) / 180,
          lon: (lon * Math.PI) / 180,
          isGrid: true,
        })
      }
    }
  }

  return points
}

const HOTSPOTS = [
  { name: 'London', lat: (51.5 * Math.PI) / 180, lon: (-0.12 * Math.PI) / 180 },
  { name: 'Paris', lat: (48.8 * Math.PI) / 180, lon: (2.35 * Math.PI) / 180 },
  { name: 'Berlin', lat: (52.5 * Math.PI) / 180, lon: (13.4 * Math.PI) / 180 },
  { name: 'Rome', lat: (41.9 * Math.PI) / 180, lon: (12.5 * Math.PI) / 180 },
  { name: 'Cairo', lat: (30.0 * Math.PI) / 180, lon: (31.2 * Math.PI) / 180 },
  { name: 'Dubai', lat: (25.2 * Math.PI) / 180, lon: (55.3 * Math.PI) / 180 },
  { name: 'Tokyo', lat: (35.6 * Math.PI) / 180, lon: (139.6 * Math.PI) / 180 },
  { name: 'New York', lat: (40.7 * Math.PI) / 180, lon: (-74.0 * Math.PI) / 180 },
  { name: 'Singapore', lat: (1.35 * Math.PI) / 180, lon: (103.8 * Math.PI) / 180 },
]

export default function Globe({ animationsEnabled = true, isDark = true }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const isDraggingRef = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0.28, y: 0.65 })
  const velocityRef = useRef({ x: 0, y: 0.0022 })
  const animRef = useRef(animationsEnabled)

  useEffect(() => {
    animRef.current = animationsEnabled
  }, [animationsEnabled])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const points = generateWorldPoints()
    let animationFrameId
    let pulseTime = 0

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)
    updateSize()

    const render = () => {
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      if (width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height)

        const radius = Math.min(width, height) * 0.88
        const cx = width * 0.68
        const cy = height * 0.62

        if (animRef.current && !isDraggingRef.current) {
          rotationRef.current.y += velocityRef.current.y
          velocityRef.current.x *= 0.95
          velocityRef.current.y = 0.0022 + (velocityRef.current.y - 0.0022) * 0.95
        }

        if (animRef.current) {
          pulseTime += 0.04
        }

        const rotX = rotationRef.current.x
        const rotY = rotationRef.current.y

        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.clip()

        // 1. Shaded 3D sphere gradient
        const sphereGrad = ctx.createRadialGradient(
          cx + radius * 0.35,
          cy - radius * 0.35,
          radius * 0.1,
          cx,
          cy,
          radius
        )

        if (isDark) {
          sphereGrad.addColorStop(0, '#363840')
          sphereGrad.addColorStop(0.35, '#202227')
          sphereGrad.addColorStop(0.7, '#111216')
          sphereGrad.addColorStop(1, '#090a0d')
        } else {
          sphereGrad.addColorStop(0, '#4b5563')
          sphereGrad.addColorStop(0.4, '#1f2937')
          sphereGrad.addColorStop(0.8, '#111827')
          sphereGrad.addColorStop(1, '#030712')
        }

        ctx.fillStyle = sphereGrad
        ctx.fill()

        // 2. Curvature shadow
        const shadowGrad = ctx.createLinearGradient(
          cx - radius * 0.9,
          cy + radius * 0.6,
          cx + radius * 0.7,
          cy - radius * 0.7
        )
        shadowGrad.addColorStop(0, 'rgba(8, 9, 12, 0.95)')
        shadowGrad.addColorStop(0.5, 'rgba(8, 9, 12, 0.45)')
        shadowGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)')
        ctx.fillStyle = shadowGrad
        ctx.fill()

        // Light vector
        const lx = 0.55
        const ly = -0.55
        const lz = 0.62

        // 3. Render halftone dots
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          const cosLat = Math.cos(p.lat)
          const sinLat = Math.sin(p.lat)
          const lon = p.lon + rotY

          let x = cosLat * Math.sin(lon)
          let y = -sinLat
          let z = cosLat * Math.cos(lon)

          const cosX = Math.cos(rotX)
          const sinX = Math.sin(rotX)
          const y2 = y * cosX - z * sinX
          const z2 = y * sinX + z * cosX
          y = y2
          z = z2

          if (z > 0.02) {
            const screenX = cx + x * radius
            const screenY = cy + y * radius

            const dotLight = Math.max(0, x * lx + y * ly + z * lz)
            const baseAlpha = p.isGrid ? 0.15 : 0.75
            const alpha = Math.min(1, Math.max(0.12, baseAlpha * (dotLight * 1.35 + 0.15)) * z)
            const dotRadius = p.isGrid ? 0.75 : 1.1 + dotLight * 0.7
            const brightness = Math.floor(140 + dotLight * 115)

            ctx.beginPath()
            ctx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness + 10}, ${alpha.toFixed(2)})`
            ctx.fill()
          }
        }

        // 4. Render glowing orange hotspots
        HOTSPOTS.forEach((spot) => {
          const cosLat = Math.cos(spot.lat)
          const sinLat = Math.sin(spot.lat)
          const lon = spot.lon + rotY

          let x = cosLat * Math.sin(lon)
          let y = -sinLat
          let z = cosLat * Math.cos(lon)

          const cosX = Math.cos(rotX)
          const sinX = Math.sin(rotX)
          const y2 = y * cosX - z * sinX
          const z2 = y * sinX + z * cosX
          y = y2
          z = z2

          if (z > 0.05) {
            const screenX = cx + x * radius
            const screenY = cy + y * radius

            const wave = animRef.current ? (Math.sin(pulseTime * 2.5 + spot.lat * 5) + 1) / 2 : 0.4
            const ringRadius = 3.5 + wave * 7
            const ringAlpha = (1 - wave) * 0.75 * z

            // Pulse ring
            ctx.beginPath()
            ctx.arc(screenX, screenY, ringRadius, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(249, 115, 22, ${ringAlpha.toFixed(2)})`
            ctx.lineWidth = 1.2
            ctx.stroke()

            // Solid orange dot
            ctx.beginPath()
            ctx.arc(screenX, screenY, 2.4, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(251, 146, 60, ${z.toFixed(2)})`
            ctx.fill()

            // Core highlight
            ctx.beginPath()
            ctx.arc(screenX, screenY, 1.1, 0, Math.PI * 2)
            ctx.fillStyle = '#ffffff'
            ctx.fill()
          }
        })

        // 5. Specular rim highlight
        const rimGrad = ctx.createRadialGradient(
          cx,
          cy,
          radius * 0.94,
          cx,
          cy,
          radius
        )
        rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
        rimGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.06)')
        rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.28)')
        ctx.fillStyle = rimGrad
        ctx.fill()

        ctx.restore()

        // 6. Subtle outer glow on top right
        const outerGlow = ctx.createRadialGradient(
          cx + radius * 0.45,
          cy - radius * 0.45,
          radius * 0.8,
          cx,
          cy,
          radius * 1.3
        )
        outerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
        outerGlow.addColorStop(0.5, 'rgba(200, 220, 255, 0.02)')
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = outerGlow
        ctx.beginPath()
        ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const onPointerDown = (e) => {
      isDraggingRef.current = true
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y

      rotationRef.current.y += dx * 0.007
      rotationRef.current.x = Math.max(-0.6, Math.min(0.6, rotationRef.current.x - dy * 0.007))

      velocityRef.current.y = dx * 0.002
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerUp = () => {
      isDraggingRef.current = false
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [isDark])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Soft gradient masks to keep text legible */}
      <div
        className={`absolute inset-0 pointer-events-none w-1/2 ${
          isDark
            ? 'bg-gradient-to-r from-[#0c0d12] via-[#0c0d12]/50 to-transparent'
            : 'bg-gradient-to-r from-white via-white/70 to-transparent'
        }`}
      />
      <div
        className={`absolute inset-0 pointer-events-none h-1/2 bottom-0 top-auto ${
          isDark
            ? 'bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/40 to-transparent'
            : 'bg-gradient-to-t from-white via-white/60 to-transparent'
        }`}
      />
    </div>
  )
}
