import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import RubberSegment from './RubberSegment'
import ProjectsPanel from './ProjectsPanel'
import ExperiencesPanel from './ExperiencesPanel'
import ContactPanel from './ContactPanel'
import CaseStudyView from './CaseStudyView'
import projectsData from '../data/projects.json'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export default function ExpandedCardModal({
  expandedCard, // 'experiences' | 'projects' | 'contact'
  originRect, // { top, left, width, height }
  isDark = true,
  animationsEnabled = true,
  initialCaseStudy = null,
  onClose,
}) {
  // isContainerExpanded controls the outer container size (originRect -> fullscreen)
  const [isContainerExpanded, setIsContainerExpanded] = useState(false)
  // showContent controls whether inner texts/elements exist (empty div while resizing)
  const [showContent, setShowContent] = useState(false)
  // backdropVisible controls backdrop blur/fade
  const [backdropVisible, setBackdropVisible] = useState(false)

  // Active tab state for segmented controls
  const [activeTab, setActiveTab] = useState(() => {
    if (expandedCard === 'experiences') return 'Organizations'
    if (expandedCard === 'projects') return 'Chosen'
    return ''
  })

  useEffect(() => {
    if (expandedCard === 'experiences') {
      setActiveTab('Organizations')
    } else if (expandedCard === 'projects') {
      setActiveTab('Chosen')
    } else {
      setActiveTab('')
    }
  }, [expandedCard])

  const title =
    expandedCard === 'experiences'
      ? 'EXPERIENCES'
      : expandedCard === 'projects'
      ? 'PROJECTS'
      : expandedCard === 'contact'
      ? 'WORK WITH ME'
      : ''

  const segmentOptions =
    expandedCard === 'experiences'
      ? ['Organizations', 'Certificates', 'Education']
      : expandedCard === 'projects'
      ? ['Chosen', 'Personal']
      : []

  const isClosingRef = useRef(false)
  const modalContainerRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const contentContainerRef = useRef(null)
  const lenisRef = useRef(null)

  // Case study navigation state
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(initialCaseStudy)
  const [caseStudyDirection, setCaseStudyDirection] = useState(1)

  // List of chosen projects with case studies in display order (reversed)
  const caseStudyProjects = useMemo(() => {
    const list = Array.isArray(projectsData)
      ? projectsData
      : projectsData?.projects || []
    return list.filter((p) => p.chosen && p['case-study']).reverse()
  }, [])

  const currentCaseStudyIndex = useMemo(() => {
    if (!selectedCaseStudy) return -1
    return caseStudyProjects.findIndex((p) => p.id === selectedCaseStudy.id)
  }, [selectedCaseStudy, caseStudyProjects])

  const nextCaseStudyProject = useMemo(() => {
    if (currentCaseStudyIndex === -1 || caseStudyProjects.length === 0) return null
    const nextIdx = (currentCaseStudyIndex + 1) % caseStudyProjects.length
    return caseStudyProjects[nextIdx]
  }, [currentCaseStudyIndex, caseStudyProjects])

  const prevCaseStudyProject = useMemo(() => {
    if (currentCaseStudyIndex === -1 || caseStudyProjects.length === 0) return null
    const prevIdx =
      (currentCaseStudyIndex - 1 + caseStudyProjects.length) %
      caseStudyProjects.length
    return caseStudyProjects[prevIdx]
  }, [currentCaseStudyIndex, caseStudyProjects])

  const handleNextProject = () => {
    if (nextCaseStudyProject) {
      setCaseStudyDirection(1)
      setSelectedCaseStudy(nextCaseStudyProject)
    }
  }

  const handlePrevProject = () => {
    if (prevCaseStudyProject) {
      setCaseStudyDirection(-1)
      setSelectedCaseStudy(prevCaseStudyProject)
    }
  }

  const handleBack = () => {
    if (selectedCaseStudy) {
      setCaseStudyDirection(-1)
      setSelectedCaseStudy(null)
    } else {
      handleClose()
    }
  }

  // Initialize Lenis for smooth momentum scrolling
  useEffect(() => {
    if (!showContent || !animationsEnabled) return
    const wrapper = scrollContainerRef.current
    if (!wrapper) return
    const content = contentContainerRef.current || wrapper.firstElementChild
    if (!content) return

    const lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: modalContainerRef.current || wrapper,
      autoRaf: true,
      smoothWheel: true,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    // Dedicated ResizeObserver to guarantee Lenis always updates its scroll limit
    // when child views (projects list, case studies) mount, unmount, or dynamically change height
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize()
    })
    resizeObserver.observe(content)

    requestAnimationFrame(() => {
      lenis.resize()
    })

    return () => {
      resizeObserver.disconnect()
      lenis.destroy()
      lenisRef.current = null
    }
  }, [showContent, animationsEnabled])

  // Reset scroll to top immediately when opening or returning from a Case Study view
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
      // Staggered resize calls to cover Framer Motion exit (220ms) + enter transition
      const t1 = setTimeout(() => lenisRef.current?.resize(), 100)
      const t2 = setTimeout(() => lenisRef.current?.resize(), 300)
      const t3 = setTimeout(() => lenisRef.current?.resize(), 600)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [selectedCaseStudy])

  // Smoothly scroll up to the top when toggling categories (e.g. Chosen <-> Personal)
  const isFirstTabMount = useRef(true)
  useEffect(() => {
    if (isFirstTabMount.current) {
      isFirstTabMount.current = false
      return
    }

    if (!animationsEnabled) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
      } else if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
      return
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 0.85,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          lenisRef.current?.resize()
        },
      })
      const t1 = setTimeout(() => lenisRef.current?.resize(), 300)
      const t2 = setTimeout(() => lenisRef.current?.resize(), 900)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [activeTab, animationsEnabled])

  // 1. OPENING SEQUENCE:
  // Starts as an empty container at originRect, expands smoothly to full screen,
  // and only displays the content once the expansion animation has finished.
  useEffect(() => {
    if (!animationsEnabled) {
      setIsContainerExpanded(true)
      setShowContent(true)
      setBackdropVisible(true)
      return
    }

    setBackdropVisible(true)
    const frame = requestAnimationFrame(() => {
      setIsContainerExpanded(true)
    })

    // Wait until the container has finished expanding (360ms) before showing inner content
    const timer = setTimeout(() => {
      if (!isClosingRef.current) {
        setShowContent(true)
      }
    }, 360)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [animationsEnabled])

  // 2. CLOSING SEQUENCE:
  // Turns back into an empty container first by hiding the content,
  // then shrinks the empty container back to the originRect.
  const handleClose = () => {
    if (isClosingRef.current) return
    isClosingRef.current = true

    if (!animationsEnabled) {
      onClose()
      return
    }

    // Step 1: Immediately hide content so the container becomes an empty div
    setShowContent(false)

    // Step 2: After content is removed (100ms), smoothly shrink the empty container back to origin
    setTimeout(() => {
      setIsContainerExpanded(false)
      setBackdropVisible(false)

      // Step 3: Once shrinking animation finishes, unmount
      setTimeout(() => {
        onClose()
      }, 360)
    }, 100)
  }

  const pageSwipeVariants = {
    enter: (dir) => ({
      x: animationsEnabled ? (dir > 0 ? 80 : -80) : 0,
      opacity: animationsEnabled ? 0 : 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: animationsEnabled ? (dir > 0 ? -80 : 80) : 0,
      opacity: animationsEnabled ? 0 : 1,
    }),
  }

  // Keyboard shortcut listener for Esc: redirects back to projects page if in case study, else closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedCaseStudy) {
          setCaseStudyDirection(-1)
          setSelectedCaseStudy(null)
        } else {
          handleClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCaseStudy])

  // Calculate dynamic geometry for seamless FLIP transition
  const currentStyle = isContainerExpanded
    ? {
        top: '12px',
        left: '12px',
        width: 'calc(100vw - 24px)',
        height: 'calc(100vh - 24px)',
        borderRadius: '24px',
        opacity: 1,
      }
    : originRect
    ? {
        top: `${originRect.top}px`,
        left: `${originRect.left}px`,
        width: `${originRect.width}px`,
        height: `${originRect.height}px`,
        borderRadius: '24px',
        opacity: 0.95,
      }
    : {
        top: '50%',
        left: '50%',
        width: '90vw',
        height: '90vh',
        borderRadius: '24px',
        opacity: 0,
      }

  return (
    <>
      {/* Blurred Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          backdropVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${isDark ? 'bg-black/60 backdrop-blur-md' : 'bg-neutral-900/30 backdrop-blur-sm'}`}
      />

      {/* Expanding / Decreasing Card Container */}
      <div
        ref={modalContainerRef}
        style={{
          ...currentStyle,
          transition: animationsEnabled
            ? 'top 360ms cubic-bezier(0.16, 1, 0.3, 1), left 360ms cubic-bezier(0.16, 1, 0.3, 1), width 360ms cubic-bezier(0.16, 1, 0.3, 1), height 360ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease, border-radius 360ms ease'
            : 'none',
        }}
        className={`fixed z-50 overflow-hidden flex flex-col border shadow-2xl ${
          isDark
            ? 'bg-[#0c0d12]/95 border-white/[0.08] text-white shadow-black/80'
            : 'bg-white border-neutral-300 text-neutral-900 shadow-2xl shadow-neutral-400/30'
        }`}
      >
        {/* Content only renders after expansion completes, and unmounts before decreasing */}
        {showContent ? (
          <div className="relative w-full h-full flex flex-col transition-opacity duration-200 opacity-100 overflow-hidden">
            {/* Upper Left: Back Button - Pinned at top-left */}
            <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-40 pointer-events-auto">
              <button
                onClick={handleBack}
                title={selectedCaseStudy ? 'Back to Projects (Esc)' : 'Back (Esc)'}
                aria-label={selectedCaseStudy ? 'Back to Projects' : 'Back'}
                className={`flex items-center justify-center p-1 bg-transparent transition-all duration-200 cursor-pointer hover:scale-120 active:scale-95 origin-center ${
                  isDark
                    ? 'text-neutral-300 hover:text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                <ArrowLeft
                  strokeWidth={2.75}
                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12"
                />
              </button>
            </div>

            {/* Subtle top edge fade for when content scrolls off the very top */}
            <div
              className={`pointer-events-none absolute top-0 left-0 right-0 h-14 sm:h-16 z-20 transition-colors duration-300 ${
                isDark
                  ? 'bg-gradient-to-b from-[#0c0d12] via-[#0c0d12]/80 to-transparent'
                  : 'bg-gradient-to-b from-white via-white/80 to-transparent'
              }`}
            />

            {/* Content Canvas */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar flex flex-col"
            >
              <div ref={contentContainerRef} className="w-full flex-1 flex flex-col min-h-full">
                <AnimatePresence mode="wait" custom={caseStudyDirection} initial={false}>
                {!selectedCaseStudy ? (
                  <motion.div
                    key="projects-list-view"
                    custom={caseStudyDirection}
                    variants={pageSwipeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 320, damping: 32 },
                      opacity: { duration: 0.22, ease: 'easeInOut' },
                    }}
                    className={`w-full flex flex-col items-center ${
                      expandedCard === 'contact' ? 'flex-1 min-h-full justify-between' : ''
                    }`}
                  >
                    {/* 1. Big Title: Non-sticky, scrolls away naturally with the page */}
                    {title && (
                      <div className="pt-8 sm:pt-10 lg:pt-12 2xl:pt-16 pb-3 sm:pb-4 2xl:pb-6 select-none text-center px-4 w-full">
                        <h1
                          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[6.5rem] 3xl:text-[7.5rem] font-black uppercase tracking-tight leading-none ${
                            isDark ? 'text-white' : 'text-neutral-900'
                          }`}
                        >
                          {title}
                        </h1>
                      </div>
                    )}

                    {/* 2. Toggle Thing: Sticky at the very top when scrolled down */}
                    {segmentOptions.length > 0 && (
                      <div className="sticky top-2 sm:top-3 lg:top-4 z-30 py-2 flex justify-center w-full pointer-events-auto">
                        <RubberSegment
                          key={expandedCard}
                          items={segmentOptions}
                          value={activeTab}
                          onChange={(val) => setActiveTab(val)}
                          trackColor={isDark ? '#18181b' : '#f4f4f5'}
                          thumbColor={isDark ? '#ffffff' : '#18181b'}
                          textColor={isDark ? '#a1a1aa' : '#71717a'}
                          activeTextColor={isDark ? '#09090b' : '#ffffff'}
                          className={
                            isDark
                              ? 'border border-white/10 shadow-xl shadow-black/50'
                              : 'border border-neutral-200 shadow-md shadow-neutral-200/50'
                          }
                          size="md"
                          radius={12}
                        />
                      </div>
                    )}

                    {/* 3. Panel Content */}
                    {expandedCard === 'projects' && (
                      <ProjectsPanel
                        isDark={isDark}
                        activeTab={activeTab}
                        animationsEnabled={animationsEnabled}
                        onSelectCaseStudy={(proj) => {
                          setCaseStudyDirection(1)
                          setSelectedCaseStudy(proj)
                        }}
                      />
                    )}

                    {expandedCard === 'experiences' && (
                      <ExperiencesPanel
                        isDark={isDark}
                        activeTab={activeTab}
                        animationsEnabled={animationsEnabled}
                      />
                    )}

                    {expandedCard === 'contact' && (
                      <ContactPanel
                        isDark={isDark}
                        animationsEnabled={animationsEnabled}
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={selectedCaseStudy.id || 'case-study-view'}
                    custom={caseStudyDirection}
                    variants={pageSwipeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 320, damping: 32 },
                      opacity: { duration: 0.22, ease: 'easeInOut' },
                    }}
                    className="w-full flex-1 flex flex-col items-center min-h-full"
                  >
                    <CaseStudyView
                      project={selectedCaseStudy}
                      prevProject={prevCaseStudyProject}
                      nextProject={nextCaseStudyProject}
                      isDark={isDark}
                      onPrevProject={handlePrevProject}
                      onNextProject={handleNextProject}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
