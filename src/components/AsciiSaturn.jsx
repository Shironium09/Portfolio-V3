import React, { useEffect, useRef } from 'react'

// Grid and planet geometry from reference code
const W = 72
const H = 26
const R = 9.5
const RIN = R * 1.35
const ROUT = R * 2.0
const LANES = 8
const RAMP = " .:;!|i1vUGB8@" // light to dense
const TILT = 0.5
const PITCH = 0.44 // axis lean, view angle (radians)
const SPIN = 0.4
const RING_SPIN = SPIN // planet and ring rotation speed (rad/s)
const SHEAR = 0 // 0 = whole ring turns together; 1 = inner lanes orbit faster

// 3D vector rotation helpers
const rz = (v, a) => [
  v[0] * Math.cos(a) - v[1] * Math.sin(a),
  v[0] * Math.sin(a) + v[1] * Math.cos(a),
  v[2],
]
const rx = (v, a) => [
  v[0],
  v[1] * Math.cos(a) - v[2] * Math.sin(a),
  v[1] * Math.sin(a) + v[2] * Math.cos(a),
]
const ry = (v, a) => [
  v[0] * Math.cos(a) + v[2] * Math.sin(a),
  v[1],
  -v[0] * Math.sin(a) + v[2] * Math.cos(a),
]
const unit = (v) => {
  const m = Math.hypot(...v)
  return v.map((c) => c / m)
}

const L = unit([-0.55, 0.45, 0.7]) // light from upper left, toward viewer
const N = rz(rx([0, 1, 0], PITCH), TILT) // ring plane normal (spin axis)

// Value noise + fractal sum for atmospheric cloud textures
const hash = (x, y, z) => {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return h - Math.floor(h)
}
const lerp = (a, b, t) => a + (b - a) * t

function vnoise(x, y, z) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const s = (t) => t * t * (3 - 2 * t)
  const xf = s(x - xi)
  const yf = s(y - yi)
  const zf = s(z - zi)
  const c = (dz) =>
    lerp(
      lerp(hash(xi, yi, zi + dz), hash(xi + 1, yi, zi + dz), xf),
      lerp(hash(xi, yi + 1, zi + dz), hash(xi + 1, yi + 1, zi + dz), xf),
      yf
    )
  return lerp(c(0), c(1), zf)
}

function fbm(x, y, z) {
  let s = 0
  let a = 0.5
  for (let i = 0; i < 4; i++) {
    s += a * vnoise(x, y, z)
    x *= 2
    y *= 2
    z *= 2
    a /= 2
  }
  return s
}

// Surface brightness at point on unit sphere in planet's own rotating frame
function surface(p) {
  const n = fbm(p[0] * 3 + 5, p[1] * 0.8, p[2] * 3)
  const band = 0.5 + 0.5 * Math.sin(p[1] * 10 + n * 5)
  return Math.min(1, 0.15 + 0.5 * band + 0.4 * n)
}

// Full frame raytracer with true circular aspect ratio calibration
function generateAsciiPlanet(theta, ringTheta, ring = true) {
  let s = ''
  // aspectX calibrated so sphere width equals sphere height in pixels
  const aspectX = 0.51

  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const x = (i + 0.5 - W / 2) * aspectX
      const y = H / 2 - j - 0.5
      const d2 = x * x + y * y
      const zs = d2 < R * R ? Math.sqrt(R * R - d2) : -Infinity

      let zr = -Infinity
      let rr = 0
      if (ring) {
        zr = -(N[0] * x + N[1] * y) / N[2]
        rr = Math.sqrt(d2 + zr * zr)
        if (rr < RIN || rr > ROUT) zr = -Infinity
      }

      let v = 0
      if (zr > zs) {
        // Ring is the nearest surface
        const t = -(x * L[0] + y * L[1] + zr * L[2])
        const shadowed = t > 0 && rr * rr - t * t < R * R
        const u = (rr - RIN) / (ROUT - RIN)
        if (u > 0.58 && u < 0.66) {
          v = 0.1 // Cassini division gap
        } else {
          const lane = Math.floor(u * LANES)
          const k = Math.pow(
            RIN / (RIN + ((lane + 0.5) / LANES) * (ROUT - RIN)),
            1.5 * SHEAR
          )
          const q = rx(rz([x, y, zr], -TILT), -PITCH)
          const a = Math.atan2(q[2], q[0]) + ringTheta * k
          const n = vnoise(Math.cos(a) * 2 + lane * 5.3, Math.sin(a) * 2, lane * 2.1)
          v = (0.4 + 0.1 * Math.sin(u * 47)) * (0.45 + 1.1 * n)
        }
        if (shadowed) v *= 0.25
      } else if (zs > -Infinity) {
        // Planet surface
        const n = [x / R, y / R, zs / R]
        const tex = surface(ry(rx(rz(n, -TILT), -PITCH), -theta))
        v = 0.1 + Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) * (0.3 + 0.7 * tex)
      }

      s += RAMP[Math.min(RAMP.length - 1, Math.max(0, Math.round(v * (RAMP.length - 1))))]
    }
    s += '\n'
  }
  return s
}

export default function AsciiSaturn({ isDark = true, animationsEnabled = true }) {
  const preRef = useRef(null)
  const animRef = useRef(animationsEnabled)
  const stateRef = useRef({
    theta: 0.6,
    ringTheta: 0,
    lastTime: 0,
  })

  useEffect(() => {
    animRef.current = animationsEnabled
  }, [animationsEnabled])

  useEffect(() => {
    let animationFrameId
    const pre = preRef.current
    if (!pre) return

    // Render initial frame immediately
    pre.textContent = generateAsciiPlanet(
      stateRef.current.theta,
      stateRef.current.ringTheta
    )

    const tick = (now) => {
      const dt = now - stateRef.current.lastTime

      if (!animRef.current) {
        stateRef.current.lastTime = now
      } else if (dt > 33) {
        // Run at steady ~30 FPS
        const sec = Math.min(dt, 100) / 1000
        stateRef.current.theta += sec * SPIN
        stateRef.current.ringTheta += sec * RING_SPIN
        stateRef.current.lastTime = now

        pre.textContent = generateAsciiPlanet(
          stateRef.current.theta,
          stateRef.current.ringTheta
        )
      }

      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-y-0 right-0 w-[70%] lg:w-[68%] flex items-center justify-end pr-0 select-none pointer-events-none overflow-hidden">
      {/* Background ambient radial glow (dark mode only to keep light mode pristine) */}
      {isDark && (
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[#3f8fe0]/[0.08]" />
      )}

      {/* Perfectly proportioned circular ASCII Saturn with pure alpha mask on left */}
      <pre
        ref={preRef}
        className={`relative z-10 select-none transition-colors duration-300 whitespace-pre translate-x-16 sm:translate-x-28 md:translate-x-48 lg:translate-x-56 xl:translate-x-52 2xl:translate-x-40 -translate-y-2 sm:-translate-y-5 lg:-translate-y-9 [mask-image:linear-gradient(to_right,transparent,black_36px)] ${isDark
            ? 'text-[#3f8fe0] [text-shadow:0_0_12px_rgba(63,143,224,0.3)]'
            : 'text-[#12335f] [text-shadow:0_0_8px_rgba(18,51,95,0.15)]'
          }`}
        style={{
          font: 'clamp(6.5px, 1.15vw, 18px) / 1.14 ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          letterSpacing: '0px',
        }}
      />
    </div>
  )
}
