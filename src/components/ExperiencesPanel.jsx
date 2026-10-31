import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown, Maximize2, X } from 'lucide-react'
import PageFooter from './PageFooter'
import experienceData from '../data/experience.json'

import ailricImg from '../assets/certificates/ailric.png'
import ccnaItnImg from '../assets/certificates/ccna-itn.png'
import ccnaSrweImg from '../assets/certificates/ccna-srwe.png'
import devfestImg from '../assets/certificates/devfest.png'
import philnitsImg from '../assets/certificates/philnits.png'
import raccetconImg from '../assets/certificates/raccetcon-2026.png'

const CERTIFICATE_IMAGES = {
  'philnits-fe': philnitsImg,
  'ccna-itn': ccnaItnImg,
  'ccna-srwe': ccnaSrweImg,
  'raccetcon-2026': raccetconImg,
  devfest: devfestImg,
  ailric: ailricImg,
}

const TAB_ORDER = ['Organizations', 'Certificates', 'Education']

export default function ExperiencesPanel({
  isDark = true,
  activeTab = 'Organizations',
  animationsEnabled = true,
}) {
  const [prevTab, setPrevTab] = useState(activeTab)
  const [direction, setDirection] = useState(1)
  const [expandedCert, setExpandedCert] = useState(null)
  const [expandedOrgId, setExpandedOrgId] = useState(null)

  useEffect(() => {
    if (!expandedCert) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setExpandedCert(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expandedCert])

  const handleCertificateClick = (cert) => {
    if (cert.link || cert.id === 'philnits-fe') {
      window.open(cert.link, '_blank', 'noopener,noreferrer')
    } else {
      setExpandedCert(cert)
    }
  }

  // Track swipe direction synchronously during tab changes
  if (activeTab !== prevTab) {
    const prevIndex = TAB_ORDER.indexOf(prevTab)
    const newIndex = TAB_ORDER.indexOf(activeTab)
    setDirection(newIndex >= prevIndex ? 1 : -1)
    setPrevTab(activeTab)
    setExpandedOrgId(null)
  }

  const educationList = useMemo(() => {
    const list = experienceData?.experience?.education || []
    return [...list].reverse()
  }, [])
  const organizationsList = experienceData?.experience?.organizations || []
  const certificatesList = experienceData?.experience?.certificates || []

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

  const timelineContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.28,
        delayChildren: 0.15,
      },
    },
  }

  const timelineItemVariants = {
    hidden: {
      opacity: 0,
      y: 28,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const galleryContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  }

  const galleryItemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1520px] 3xl:max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 pt-8 sm:pt-10 2xl:pt-14 pb-28 2xl:pb-36 overflow-hidden">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {activeTab === 'Education' && (
          <motion.div
            key="Education"
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
            {/* Minimalist Timeline (No Borders, No Circle Dots) */}
            <motion.div
              variants={timelineContainerVariants}
              initial={animationsEnabled ? 'hidden' : 'visible'}
              animate="visible"
              className="relative w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto pl-6 sm:pl-8 md:pl-10 2xl:pl-14 pt-4"
            >
              {/* Continuous Timeline Spine */}
              <div
                className={`absolute left-0 top-3 bottom-8 w-[1.5px] pointer-events-none transition-colors duration-300 ${
                  isDark
                    ? 'bg-gradient-to-b from-white/40 via-white/15 to-transparent'
                    : 'bg-gradient-to-b from-neutral-400/40 via-neutral-300/30 to-transparent'
                }`}
              />

              {educationList.map((item, idx) => {
                const isCurrent = item.period?.toLowerCase().includes('present')

                return (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    variants={timelineItemVariants}
                    className="relative group pb-12 sm:pb-16 last:pb-6"
                  >
                    {/* Timeline Content - Pure Typography, No Borders */}
                    <div className="flex flex-col">
                      {/* Period */}
                      <span
                        className={`font-mono text-xs 2xl:text-sm font-semibold tracking-wider uppercase select-none transition-colors duration-200 ${
                          isCurrent
                            ? isDark
                              ? 'text-white'
                              : 'text-neutral-900 font-bold'
                            : isDark
                            ? 'text-neutral-400'
                            : 'text-neutral-500'
                        }`}
                      >
                        {item.period}
                      </span>

                      {/* Institution / School - Sleek & Balanced */}
                      <h2
                        className={`text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-extrabold uppercase tracking-tight leading-tight mt-1 mb-1.5 transition-colors duration-200 ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {item.institution}
                      </h2>

                      {/* Degree / Program & Location - Subtitle */}
                      <div
                        className={`flex items-center flex-wrap gap-2 text-xs sm:text-sm 2xl:text-base font-medium transition-colors duration-200 ${
                          isDark ? 'text-neutral-300' : 'text-neutral-700'
                        }`}
                      >
                        <span>{item.degree}</span>
                        {item.location && (
                          <>
                            <span className="opacity-40">•</span>
                            <span
                              className={
                                isDark ? 'text-neutral-400' : 'text-neutral-500'
                              }
                            >
                              {item.location}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Honors / Awards (no star icon) */}
                      {item.honors && item.honors.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3.5 2xl:mt-4">
                          {item.honors.map((honor, hIdx) => (
                            <span
                              key={hIdx}
                              className={`inline-flex items-center px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-full text-xs 2xl:text-sm font-mono font-medium tracking-wide transition-colors duration-200 ${
                                isDark
                                  ? 'bg-white/[0.08] text-neutral-200'
                                  : 'bg-neutral-200/80 text-neutral-800'
                              }`}
                            >
                              <span>{honor}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Organizations & Involvements */}
                      {item.organizations && item.organizations.length > 0 && (
                        <div className="mt-4 flex flex-col gap-1.5">
                          <span
                            className={`text-[11px] 2xl:text-xs font-mono uppercase tracking-widest transition-colors duration-200 ${
                              isDark ? 'text-neutral-500' : 'text-neutral-400'
                            }`}
                          >
                            Involvements
                          </span>
                          <p
                            className={`text-xs sm:text-sm leading-relaxed font-normal transition-colors duration-200 ${
                              isDark ? 'text-neutral-400' : 'text-neutral-600'
                            }`}
                          >
                            {item.organizations.join(' • ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'Organizations' && (
          <motion.div
            key="Organizations"
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 340, damping: 34 },
              opacity: { duration: 0.2, ease: 'easeInOut' },
            }}
            className="w-full flex flex-col"
          >
            {organizationsList.map((org, index) => {
              const itemNumber = index + 1
              const isExpanded = expandedOrgId === org.id

              return (
                <div
                  key={org.id || `${org.organization}-${index}`}
                  onClick={() =>
                    setExpandedOrgId((prev) => (prev === org.id ? null : org.id))
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setExpandedOrgId((prev) =>
                        prev === org.id ? null : org.id
                      )
                    }
                  }}
                  className="group relative w-full py-8 sm:py-10 lg:py-12 2xl:py-16 first:pt-4 cursor-pointer focus:outline-none select-none transition-colors duration-200"
                  role="button"
                  aria-expanded={isExpanded}
                  aria-label={`${org.role} at ${org.organization}`}
                >
                  {/* Top Row: Role (Left) & organization • time (Right) */}
                  <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-3 lg:gap-8 2xl:gap-14 w-full">
                    {/* Left: Index + Role */}
                    <div className="flex items-baseline gap-3 sm:gap-4 md:gap-5 min-w-0">
                      <span
                        className={`font-mono text-xs sm:text-sm 2xl:text-base font-semibold shrink-0 select-none pt-0.5 transition-colors duration-200 ${
                          isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}
                      >
                        [{itemNumber < 10 ? `0${itemNumber}` : itemNumber}]
                      </span>
                      <h2
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-black uppercase tracking-tight leading-tight transition-colors duration-200 ${
                          isExpanded
                            ? isDark
                              ? 'text-white'
                              : 'text-neutral-950'
                            : isDark
                            ? 'text-neutral-200 group-hover:text-white'
                            : 'text-neutral-800 group-hover:text-neutral-950'
                        }`}
                      >
                        {org.role}
                      </h2>
                    </div>

                    {/* Right: organization • time + Animated Chevron */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 2xl:gap-6 shrink-0 pl-7 sm:pl-9 md:pl-10 lg:pl-0">
                      <div
                        className={`flex items-center flex-wrap gap-2 text-xs sm:text-sm md:text-base 2xl:text-xl font-medium transition-colors duration-200 ${
                          isExpanded
                            ? isDark
                              ? 'text-neutral-200'
                              : 'text-neutral-800'
                            : isDark
                            ? 'text-neutral-400 group-hover:text-neutral-300'
                            : 'text-neutral-500 group-hover:text-neutral-700'
                        }`}
                      >
                        <span>{org.organization}</span>
                        {org.period && (
                          <>
                            <span className="opacity-40 select-none">•</span>
                            <span className="font-mono text-xs sm:text-sm 2xl:text-base tracking-wide uppercase select-none">
                              {org.period}
                            </span>
                          </>
                        )}
                      </div>

                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`shrink-0 transition-colors duration-200 select-none ${
                          isExpanded
                            ? isDark
                              ? 'text-white'
                              : 'text-neutral-950'
                            : isDark
                            ? 'text-neutral-500 group-hover:text-neutral-300'
                            : 'text-neutral-400 group-hover:text-neutral-600'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6" />
                      </motion.span>
                    </div>
                  </div>

                  {/* Smooth Accordion Expansion: Description Revealed Below */}
                  <AnimatePresence initial={false}>
                    {isExpanded && org.description && (
                      <motion.div
                        key="role-description"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                          transition: {
                            height: {
                              duration: 0.45,
                              ease: [0.16, 1, 0.3, 1],
                            },
                            opacity: {
                              duration: 0.3,
                              delay: 0.08,
                              ease: 'easeOut',
                            },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: {
                              duration: 0.32,
                              ease: [0.16, 1, 0.3, 1],
                            },
                            opacity: {
                              duration: 0.16,
                              ease: 'easeIn',
                            },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 sm:pt-6 2xl:pt-8 pl-7 sm:pl-9 md:pl-10 2xl:pl-14 max-w-4xl lg:max-w-5xl 2xl:max-w-6xl">
                          <p
                            className={`text-sm sm:text-base 2xl:text-xl leading-relaxed font-normal transition-colors duration-200 ${
                              isDark ? 'text-neutral-300' : 'text-neutral-600'
                            }`}
                          >
                            {org.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Horizontal Divider Line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[1px] transition-colors duration-300 ${
                      isExpanded
                        ? isDark
                          ? 'bg-white/20'
                          : 'bg-neutral-400'
                        : isDark
                        ? 'bg-white/[0.08]'
                        : 'bg-neutral-200'
                    }`}
                  />
                </div>
              )
            })}
          </motion.div>
        )}

        {activeTab === 'Certificates' && (
          <motion.div
            key="Certificates"
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
            {/* Sleek Borderless Certificate Gallery */}
            <motion.div
              variants={galleryContainerVariants}
              initial={animationsEnabled ? 'hidden' : 'visible'}
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 2xl:gap-12 pt-4"
            >
              {certificatesList.map((cert, index) => {
                const itemNumber = index + 1
                const imgSrc = CERTIFICATE_IMAGES[cert.id]
                const isExternal = Boolean(cert.link || cert.id === 'philnits-fe')

                return (
                  <motion.div
                    key={cert.id || `${cert.title}-${index}`}
                    variants={galleryItemVariants}
                    className="flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => handleCertificateClick(cert)}
                      className="group flex flex-col w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl transition-all duration-300"
                      aria-label={
                        isExternal
                          ? `Open ${cert.title} verification in new tab`
                          : `View expanded certificate ${cert.title}`
                      }
                    >
                      {/* Certificate Thumbnail Frame (No Borders) */}
                      <div
                        className={`relative w-full aspect-[16/11] rounded-2xl overflow-hidden transition-all duration-500 ${
                          isDark
                            ? 'bg-neutral-900/60 shadow-lg shadow-black/40'
                            : 'bg-neutral-200/70 shadow-md shadow-neutral-300/40'
                        }`}
                      >
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={cert.title}
                            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-neutral-500">
                            No preview
                          </div>
                        )}

                        {/* Subtle Vignette on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Floating Action Pill */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 pointer-events-none">
                          {isExternal ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide bg-white/95 text-neutral-900 shadow-md">
                              <span>View Result</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide bg-white/95 text-neutral-900 shadow-md">
                              <span>Expand</span>
                              <Maximize2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Certificate Info (Borderless) */}
                      <div className="mt-3.5 2xl:mt-5 flex items-start gap-2.5 2xl:gap-3.5">
                        <span
                          className={`font-mono text-xs 2xl:text-sm font-semibold shrink-0 select-none pt-0.5 transition-colors duration-200 ${
                            isDark ? 'text-neutral-500' : 'text-neutral-400'
                          }`}
                        >
                          [{itemNumber < 10 ? `0${itemNumber}` : itemNumber}]
                        </span>
                        <div className="flex flex-col min-w-0">
                          <h3
                            className={`text-sm sm:text-base 2xl:text-lg font-bold uppercase tracking-tight leading-snug transition-colors duration-200 ${
                              isDark
                                ? 'text-white group-hover:text-neutral-200'
                                : 'text-neutral-900 group-hover:text-neutral-700'
                            }`}
                          >
                            {cert.title}
                          </h3>
                          {isExternal && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[11px] 2xl:text-xs font-mono text-neutral-400 group-hover:text-neutral-300 transition-colors">
                              <span>Official Passer Document</span>
                              <ArrowUpRight className="w-3 h-3 2xl:w-4 2xl:h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox / Expanded Modal ("expand them a bit (not full screen)") */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {expandedCert && (
              <motion.div
                key="certificate-lightbox-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setExpandedCert(null)}
                className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md"
              >
                <motion.div
                  key="certificate-lightbox-dialog"
                  initial={{ opacity: 0, scale: 0.92, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 12 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative w-full max-w-3xl lg:max-w-4xl max-h-[88vh] flex flex-col rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden ${
                    isDark
                      ? 'bg-neutral-950/95 text-white shadow-black/90'
                      : 'bg-white/95 text-neutral-900 shadow-neutral-900/30'
                  }`}
                  role="dialog"
                  aria-modal="true"
                  aria-label={expandedCert.title}
                >
                  {/* Top Bar Header */}
                  <div className="flex items-center justify-between gap-4 pb-3">
                    <div className="min-w-0 pr-2">
                      <span
                        className={`font-mono text-xs uppercase tracking-wider ${
                          isDark ? 'text-neutral-400' : 'text-neutral-500'
                        }`}
                      >
                        Certificate Preview
                      </span>
                      <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tight leading-snug truncate">
                        {expandedCert.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedCert(null)}
                      className={`p-2 rounded-full transition-all duration-200 shrink-0 select-none ${
                        isDark
                          ? 'text-neutral-400 hover:text-white hover:bg-white/10 active:bg-white/20'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5 active:bg-black/10'
                      }`}
                      aria-label="Close certificate preview"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Centered Image Display */}
                  <div className="relative flex-1 min-h-0 flex items-center justify-center my-2 rounded-xl overflow-hidden bg-black/40">
                    <img
                      src={CERTIFICATE_IMAGES[expandedCert.id]}
                      alt={expandedCert.title}
                      className="max-h-[64vh] sm:max-h-[68vh] w-auto max-w-full object-contain rounded-lg shadow-xl select-none"
                    />
                  </div>
                  
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Centered Footer: GitHub, Email & CEB-TIME */}
      <PageFooter isDark={isDark} className="pt-10 sm:pt-14 2xl:pt-24" />
    </div>
  )
}
