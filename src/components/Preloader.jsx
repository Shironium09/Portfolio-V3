import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import preloadAllAssets from '../utils/preloadAssets'
import { unlockAudio } from '../utils/soundEffects'

export default function Preloader({ onFinishLoading }) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [isReadyToEnter, setIsReadyToEnter] = useState(false)
  const [countdown, setCountdown] = useState(4)
  const targetProgressRef = useRef(15)
  const isFinishedRef = useRef(false)
  const countdownIntervalRef = useRef(null)

  const handleEnter = useCallback(() => {
    if (isFinishedRef.current) return
    isFinishedRef.current = true
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }
    unlockAudio()
    if (onFinishLoading) onFinishLoading()
  }, [onFinishLoading])

  // Allow keyboard navigation (Enter, Space, etc.) to enter and unlock audio
  useEffect(() => {
    const handleKeyDown = () => {
      handleEnter()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleEnter])

  useEffect(() => {
    let isMounted = true

    // Start preloading all assets
    preloadAllAssets((pct) => {
      if (!isMounted) return
      targetProgressRef.current = Math.max(targetProgressRef.current, pct)
    }).then(() => {
      if (!isMounted) return
      targetProgressRef.current = 100
    })

    // Steady, smooth counter ramp from 0 to 100
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsReadyToEnter(true)

          // 4-second countdown before auto-swiping up
          let remaining = 4
          setCountdown(4)
          countdownIntervalRef.current = setInterval(() => {
            remaining -= 1
            if (remaining <= 0) {
              clearInterval(countdownIntervalRef.current)
              handleEnter()
            } else {
              setCountdown(remaining)
            }
          }, 1000)

          return 100
        }

        const target = targetProgressRef.current
        const diff = target - prev
        const step =
          diff > 40
            ? Math.min(3, Math.ceil(diff * 0.08))
            : Math.min(2, Math.max(1, Math.ceil(diff * 0.1)))
        return Math.min(100, prev + step)
      })
    }, 25)

    return () => {
      isMounted = false
      clearInterval(interval)
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [handleEnter])

  return (
    <motion.div
      key="preloader-overlay"
      initial={{ y: 0 }}
      exit={{
        y: '-100%',
        transition: {
          duration: 0.85,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
      onClick={handleEnter}
      className="fixed inset-0 z-[99999] bg-[#07080b] flex flex-col items-center justify-center select-none pointer-events-auto cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-baseline font-sans tracking-tighter tabular-nums select-none leading-none">
          <span className="text-8xl sm:text-[11rem] md:text-[14rem] lg:text-[18rem] xl:text-[22rem] font-black text-white">
            {displayProgress}
          </span>
          <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[11rem] text-white font-medium ml-2 sm:ml-4">
            %
          </span>
        </div>

        {isReadyToEnter && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-xs sm:text-sm lg:text-sm xl:text-base 2xl:text-lg leading-relaxed mt-2 xl:mt-3 text-neutral-400 hover:text-white transition-colors cursor-pointer select-none"
          >
            Click to Enter | {countdown}s
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
