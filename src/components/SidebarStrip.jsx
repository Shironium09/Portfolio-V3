import React, { useState } from 'react'
import { flushSync } from 'react-dom'
import { motion } from 'motion/react'
import { Menu, Play, Pause, Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { playTransitionSound, getSoundMuted, setSoundMuted } from '../utils/soundEffects'

export default function SidebarStrip({
  isDark = true,
  setIsDark,
  animationsEnabled = true,
  setAnimationsEnabled,
  isMuted,
  setIsMuted,
  showSidebar = true,
  isEntranceActive = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [screenDash, setScreenDash] = useState(null) // 'to-off' | 'to-on' | null
  const [internalMuted, setInternalMuted] = useState(() => getSoundMuted())

  const soundMuted = isMuted !== undefined ? isMuted : internalMuted

  const handleToggleMute = () => {
    // Explicit requirement: no sfx on the mute toggle
    const nextMuted = !soundMuted
    setSoundMuted(nextMuted)
    if (setIsMuted) {
      setIsMuted(nextMuted)
    } else {
      setInternalMuted(nextMuted)
    }
  }

  const handleToggleAnimations = () => {
    playTransitionSound()
    const nextState = !animationsEnabled
    setAnimationsEnabled(nextState)

    // Trigger subtle horizontal screen sweep:
    // from ON to OFF: left to right
    // from OFF to ON: right to left
    setScreenDash(nextState ? 'to-on' : 'to-off')
    setTimeout(() => {
      setScreenDash(null)
    }, 500)
  }

  const handleToggleTheme = (e) => {
    playTransitionSound()
    const nextDark = !isDark

    if (!animationsEnabled || !document.startViewTransition) {
      if (nextDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
        document.body.style.backgroundColor = '#07080b'
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
        document.body.style.backgroundColor = '#eaedf2'
      }
      setIsDark(nextDark)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        if (nextDark) {
          document.documentElement.classList.add('dark')
          document.documentElement.classList.remove('light')
          document.body.style.backgroundColor = '#07080b'
        } else {
          document.documentElement.classList.remove('dark')
          document.documentElement.classList.add('light')
          document.body.style.backgroundColor = '#eaedf2'
        }
        setIsDark(nextDark)
      })
    })

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 380,
            easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
      .catch(() => {})
  }

  return (
    <>
      {/* Screen-Wide Subtle Horizontal Sweep Animation for Toggle */}
      {screenDash && (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
          <div
            className="fixed top-0 bottom-0 left-0 w-20 sm:w-28 pointer-events-none will-change-transform flex items-stretch opacity-70"
            style={{
              animation:
                screenDash === 'to-off'
                  ? 'sweepLeftToRight 480ms cubic-bezier(0.25, 1, 0.5, 1) forwards'
                  : 'sweepRightToLeft 480ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
            }}
          >
            {screenDash === 'to-off' ? (
              // Moving LEFT to RIGHT: Very soft trailing gradient on left, delicate leading line on right
              <div className="w-full h-full flex flex-row items-stretch">
                <div
                  className={`flex-1 h-full ${
                    isDark
                      ? 'bg-gradient-to-r from-transparent via-white/[0.03] to-white/[0.12]'
                      : 'bg-gradient-to-r from-transparent via-neutral-900/[0.03] to-neutral-900/[0.10]'
                  }`}
                />
                <div
                  className={`w-[1.5px] sm:w-[2px] h-full ${
                    isDark
                      ? 'bg-white/45 shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                      : 'bg-neutral-900/35 shadow-[0_0_6px_rgba(0,0,0,0.15)]'
                  }`}
                />
              </div>
            ) : (
              // Moving RIGHT to LEFT: Delicate leading line on left, very soft trailing gradient on right
              <div className="w-full h-full flex flex-row items-stretch">
                <div
                  className={`w-[1.5px] sm:w-[2px] h-full ${
                    isDark
                      ? 'bg-white/45 shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                      : 'bg-neutral-900/35 shadow-[0_0_6px_rgba(0,0,0,0.15)]'
                  }`}
                />
                <div
                  className={`flex-1 h-full ${
                    isDark
                      ? 'bg-gradient-to-l from-transparent via-white/[0.03] to-white/[0.12]'
                      : 'bg-gradient-to-l from-transparent via-neutral-900/[0.03] to-neutral-900/[0.10]'
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <motion.aside
        initial={isEntranceActive ? { x: -140, opacity: 0 } : false}
        animate={
          isEntranceActive
            ? showSidebar
              ? { x: 0, opacity: 1 }
              : { x: -140, opacity: 0 }
            : { x: 0, opacity: 1 }
        }
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 24,
          mass: 0.9,
        }}
        className={`relative h-full w-20 md:w-24 lg:w-28 xl:w-32 shrink-0 flex flex-col justify-between py-6 xl:py-8 px-3 border-r select-none ${
          isDark
            ? 'bg-[#07080b] border-white/[0.04] text-white'
            : 'bg-[#eaedf2] border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Top Section: Circular Settings Button & Downward Extension */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Circular Settings Button (Minimal 3-line Menu) */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            title="Menu"
            aria-label="Toggle menu"
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isOpen
                ? isDark
                  ? 'border-white/30 bg-white/[0.12] text-white shadow-lg shadow-white/5'
                  : 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                : isDark
                ? 'border-white/[0.06] bg-transparent text-neutral-400 hover:text-white hover:border-white/[0.15]'
                : 'border-neutral-300 bg-white text-neutral-700 hover:text-black hover:border-neutral-400 shadow-sm'
            }`}
          >
            <Menu
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? 'rotate-90' : ''
              }`}
            />
          </button>

          {/* Inline Downward Extension (3 button choices: Black/White simplicity) */}
          <div
            className={`flex flex-col items-center gap-2.5 pt-3 overflow-hidden transition-all duration-300 ease-out ${
              isOpen
                ? 'max-h-60 opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            {/* Button 1: Animations Toggle (Minimal Play/Pause) */}
            <button
              onClick={handleToggleAnimations}
              data-no-click-sound="true"
              title={animationsEnabled ? 'Animations: ON' : 'Animations: OFF'}
              aria-label="Toggle animations"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                animationsEnabled
                  ? isDark
                    ? 'bg-white text-black border-white shadow-md shadow-white/20'
                    : 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                  : isDark
                  ? 'bg-transparent border-white/[0.08] text-neutral-500 hover:text-neutral-300 hover:border-white/[0.2]'
                  : 'bg-white border-neutral-300 text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 shadow-sm'
              }`}
            >
              {animationsEnabled ? (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              ) : (
                <Pause className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Button 2: Light/Dark Mode Toggle (Monochrome Black & White with Circular Wave Transition) */}
            <button
              onClick={handleToggleTheme}
              data-no-click-sound="true"
              title={!isDark ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle theme"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                !isDark
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                  : 'bg-transparent border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/[0.2]'
              }`}
            >
              {!isDark ? (
                <Moon className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Button 3: Sound Effects Toggle (Minimalist Volume2 / VolumeX) */}
            <button
              onClick={handleToggleMute}
              data-no-click-sound="true"
              title={!soundMuted ? 'Sound Effects: ON' : 'Sound Effects: MUTED'}
              aria-label="Toggle sound effects"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                !soundMuted
                  ? isDark
                    ? 'bg-white text-black border-white shadow-md shadow-white/20'
                    : 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                  : isDark
                  ? 'bg-transparent border-white/[0.08] text-neutral-500 hover:text-neutral-300 hover:border-white/[0.2]'
                  : 'bg-white border-neutral-300 text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 shadow-sm'
              }`}
            >
              {!soundMuted ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Section: Vertical Typography "DUSTIN / DEVELOPMENT / CREATIVITY" */}
        <div className="relative z-10 flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 [writing-mode:vertical-rl] rotate-180">
            <span
              className={`font-mono text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px] font-bold tracking-[0.28em] uppercase ${
                isDark ? 'text-neutral-500 hover:text-neutral-400' : 'text-neutral-600 hover:text-neutral-900'
              } transition-colors`}
            >
              DUSTIN / DEVELOPMENT / CREATIVITY
            </span>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
