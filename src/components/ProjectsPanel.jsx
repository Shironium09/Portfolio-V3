import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import PageFooter from './PageFooter'
import projectsData from '../data/projects.json'

const TAB_ORDER = ['Chosen', 'Personal']

export default function ProjectsPanel({
  isDark = true,
  activeTab = 'Chosen',
  animationsEnabled = true,
  onSelectCaseStudy,
}) {
  const [prevTab, setPrevTab] = useState(activeTab)
  const [direction, setDirection] = useState(1)

  // Track swipe direction synchronously during tab changes
  if (activeTab !== prevTab) {
    const prevIndex = TAB_ORDER.indexOf(prevTab)
    const newIndex = TAB_ORDER.indexOf(activeTab)
    setDirection(newIndex >= prevIndex ? 1 : -1)
    setPrevTab(activeTab)
  }

  const displayedProjects = useMemo(() => {
    const list = Array.isArray(projectsData)
      ? projectsData
      : projectsData?.projects || []
    const filtered =
      activeTab === 'Personal'
        ? list.filter((p) => p.chosen !== true)
        : list.filter((p) => p.chosen === true)
    return [...filtered].reverse()
  }, [activeTab])

  const swipeVariants = {
    enter: (dir) => ({
      x: animationsEnabled ? (dir > 0 ? 70 : -70) : 0,
      opacity: animationsEnabled ? 0 : 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: animationsEnabled ? (dir > 0 ? -70 : 70) : 0,
      opacity: animationsEnabled ? 0 : 1,
    }),
  }

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1520px] 3xl:max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 pt-6 sm:pt-8 lg:pt-10 2xl:pt-14 pb-24 2xl:pb-32 overflow-hidden">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={activeTab}
          custom={direction}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 340, damping: 34 },
            opacity: { duration: 0.2, ease: 'easeInOut' },
          }}
          className="w-full"
        >
          {displayedProjects.map((project, index) => {
            const itemNumber = index + 1

            return (
              <div
                key={project.id || `${project.name}-${index}`}
                className={`w-full border-b py-8 sm:py-10 lg:py-12 2xl:py-16 first:pt-4 transition-colors duration-200 ${
                  isDark ? 'border-white/[0.08]' : 'border-neutral-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 lg:gap-10 xl:gap-14 2xl:gap-20">
                  {/* Left Column: Index [1], TITLE, Tech stack • tech stack */}
                  <div className="flex items-start gap-3 sm:gap-4 md:gap-5 flex-[1.3] lg:flex-[1.4] min-w-0">
                    {/* Index tag e.g. [1] - sleek, subtle, smaller technical tag */}
                    <span
                      className={`font-mono text-xs sm:text-sm md:text-sm 2xl:text-base font-semibold shrink-0 select-none pt-1 sm:pt-1.5 md:pt-2 transition-colors duration-200 ${
                        isDark ? 'text-neutral-400/70' : 'text-neutral-500/80'
                      }`}
                    >
                      [{itemNumber}]
                    </span>

                    {/* Container for TITLE and Tech Stack */}
                    <div className="min-w-0 flex flex-col">
                      <h2
                        className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[4.25rem] 3xl:text-[5rem] font-black uppercase tracking-tight leading-[1.05] break-normal select-none transition-colors duration-200 ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {project.name}
                      </h2>

                      {project.tags && project.tags.length > 0 && (
                        <div
                          className={`mt-2.5 sm:mt-3.5 2xl:mt-4 flex flex-wrap items-center text-[11px] sm:text-xs 2xl:text-sm font-medium tracking-wide transition-colors duration-200 ${
                            isDark ? 'text-neutral-400/80' : 'text-neutral-500'
                          }`}
                        >
                          {project.tags.map((tag, tIdx) => (
                            <React.Fragment key={tag}>
                              {tIdx > 0 && (
                                <span
                                  className={`mx-1.5 sm:mx-2 select-none opacity-40 ${
                                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                                  }`}
                                >
                                  •
                                </span>
                              )}
                              <span>{tag}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Description, Case Study & Github Pills */}
                  <div className="flex flex-col items-start gap-4 sm:gap-5 2xl:gap-6 flex-1 min-w-0 max-w-lg xl:max-w-xl 2xl:max-w-2xl lg:pl-4 xl:pl-8">
                    <p
                      className={`text-sm sm:text-base 2xl:text-lg leading-relaxed font-normal transition-colors duration-200 ${
                        isDark ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {/* Case Study Pill - only shown for chosen projects with a case study */}
                      {activeTab !== 'Personal' && project['case-study'] && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onSelectCaseStudy?.(project)
                          }}
                          className={`px-5 sm:px-6 2xl:px-7 py-2 sm:py-2.5 2xl:py-3 rounded-full border text-xs sm:text-sm 2xl:text-base font-medium tracking-wide transition-all duration-200 cursor-pointer active:scale-95 select-none ${
                            isDark
                              ? 'border-white/20 bg-white/[0.03] text-neutral-200 hover:text-white hover:border-white/60 hover:bg-white/[0.08]'
                              : 'border-neutral-300 bg-neutral-100/60 text-neutral-800 hover:text-black hover:border-neutral-900 hover:bg-neutral-200/60'
                          }`}
                        >
                          Case Study
                        </button>
                      )}

                      {/* Github Pill */}
                      <a
                        href={project.link || '#'}
                        target={project.link ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!project.link) e.preventDefault()
                          e.stopPropagation()
                        }}
                        className={`px-5 sm:px-6 2xl:px-7 py-2 sm:py-2.5 2xl:py-3 rounded-full border text-xs sm:text-sm 2xl:text-base font-medium tracking-wide transition-all duration-200 cursor-pointer active:scale-95 inline-flex items-center justify-center select-none ${
                          isDark
                            ? 'border-white/20 bg-white/[0.03] text-neutral-200 hover:text-white hover:border-white/60 hover:bg-white/[0.08]'
                            : 'border-neutral-300 bg-neutral-100/60 text-neutral-800 hover:text-black hover:border-neutral-900 hover:bg-neutral-200/60'
                        }`}
                      >
                        Github
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Centered Footer: GitHub, Email & CEB-TIME */}
          <PageFooter isDark={isDark} className="pt-12 sm:pt-16 2xl:pt-24" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

