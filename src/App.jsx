import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import SidebarStrip from './components/SidebarStrip'
import BentoGrid from './components/BentoGrid'
import Preloader from './components/Preloader'
import { playPopSound, getSoundMuted } from './utils/soundEffects'

// Evaluated once on initial script execution to identify first session visit
const isFirstSessionVisit = (() => {
  if (typeof window === 'undefined') return false
  try {
    return !sessionStorage.getItem('portfolio_preloaded')
  } catch {
    return true
  }
})()

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [isMuted, setIsMuted] = useState(() => getSoundMuted())

  // Show preloader only on the first session visit
  const [isLoading, setIsLoading] = useState(isFirstSessionVisit)

  // Entrance sequencing is active only on first visit when animations are enabled
  const isEntranceActive = animationsEnabled && isFirstSessionVisit

  const [showSidebar, setShowSidebar] = useState(() => !isFirstSessionVisit)
  const [poppedCards, setPoppedCards] = useState(() =>
    !isFirstSessionVisit
      ? { saturn: true, contact: true, projects: true, experiences: true }
      : { saturn: false, contact: false, projects: false, experiences: false }
  )

  // Internal animations (Saturn rotation, marquee scrolling) remain off until all grids have finished loading
  const [areGridAnimationsReady, setAreGridAnimationsReady] = useState(
    () => !isEntranceActive
  )

  const entranceTimersRef = useRef([])

  // Clear pending entrance timeouts on unmount
  useEffect(() => {
    const timers = entranceTimersRef.current
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      document.body.style.backgroundColor = '#07080b'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.body.style.backgroundColor = '#eaedf2'
    }
  }, [isDark])

  const handleFinishLoading = () => {
    try {
      sessionStorage.setItem('portfolio_preloaded', 'true')
    } catch {
      // Ignore sessionStorage exceptions
    }
    setIsLoading(false)
  }

  // Triggered when preloader swipe-up exit transition completes
  const handlePreloaderExitComplete = () => {
    if (!isEntranceActive) return

    const queue = (fn, delay) => {
      const id = setTimeout(fn, delay)
      entranceTimersRef.current.push(id)
      return id
    }

    const popCardWithSound = (cardKey) => {
      setPoppedCards((prev) => ({ ...prev, [cardKey]: true }))
      // Play subtle bubble pop sound right as the card reaches its actual size (~120ms into the spring)
      queue(() => {
        playPopSound()
      }, 120)
    }

    // 1. Wait 1 second after swipe up completes
    queue(() => {
      // 2. Side panel emerges from the side
      setShowSidebar(true)

      // 3. A second later, the grids appear one by one with a deliberate delay
      queue(() => {
        const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768

        if (isMobileScreen) {
          // Mobile order: Name (saturn) -> Projects -> Experiences -> Contact
          popCardWithSound('saturn')
          queue(() => {
            popCardWithSound('projects')
            queue(() => {
              popCardWithSound('experiences')
              queue(() => {
                popCardWithSound('contact')
                queue(() => {
                  setAreGridAnimationsReady(true)
                }, 600)
              }, 750)
            }, 750)
          }, 750)
        } else {
          // Desktop order: Name (saturn) -> Contact -> Projects -> Experiences
          popCardWithSound('saturn')
          queue(() => {
            popCardWithSound('contact')
            queue(() => {
              popCardWithSound('projects')
              queue(() => {
                popCardWithSound('experiences')
                queue(() => {
                  setAreGridAnimationsReady(true)
                }, 600)
              }, 750)
            }, 750)
          }, 750)
        }
      }, 1000)
    }, 1000)
  }

  // If animations are turned off, force immediate display
  const effectiveShowSidebar = !animationsEnabled || showSidebar
  const effectivePoppedCards = !animationsEnabled
    ? { saturn: true, contact: true, projects: true, experiences: true }
    : poppedCards

  // Micro-animations within grids run only when overall animations are enabled AND entrance has settled
  const effectiveGridAnimations = animationsEnabled && areGridAnimationsReady

  return (
    <>
      <AnimatePresence mode="wait" onExitComplete={handlePreloaderExitComplete}>
        {isLoading && (
          <Preloader key="preloader" onFinishLoading={handleFinishLoading} />
        )}
      </AnimatePresence>

      <div
        className={`w-screen h-screen h-[100dvh] overflow-hidden flex flex-col md:flex-row select-none ${
          isDark ? 'bg-[#07080b] text-neutral-100' : 'bg-[#eaedf2] text-neutral-900'
        }`}
      >
        {/* Top Bar on Mobile / Left Sidebar on Desktop */}
        <SidebarStrip
          isDark={isDark}
          setIsDark={setIsDark}
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          showSidebar={effectiveShowSidebar}
          isEntranceActive={isEntranceActive}
        />

        {/* Main Bento Grid Area */}
        <main className="flex-1 min-h-0 w-full p-3.5 sm:p-4 lg:p-6 xl:p-8 2xl:p-10 overflow-y-auto md:overflow-hidden flex flex-col justify-start md:justify-center items-center custom-scrollbar">
          <div className="w-full h-auto md:h-full max-w-[2400px] pb-6 md:pb-0">
            <BentoGrid
              isDark={isDark}
              animationsEnabled={effectiveGridAnimations}
              poppedCards={effectivePoppedCards}
              isEntranceActive={isEntranceActive}
            />
          </div>
        </main>
      </div>
    </>
  )
}
