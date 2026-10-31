import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import {
  UserRound,
  CodeXml,
  Phone,
} from 'lucide-react'
import AsciiSaturn from './AsciiSaturn'
import ExpandedCardModal from './ExpandedCardModal'
import projectsData from '../data/projects.json'
import experienceData from '../data/experience.json'
import contactData from '../data/contact.json'
import scheduleData from '../data/schedule.json'


// 1. CARD: Experiences (Top-Left)
function RoleMarqueeItem({ item, isDark }) {
  const title = typeof item === 'string' ? item : item.role
  const subtitle = typeof item === 'string' ? null : item.organization

  return (
    <div className="inline-flex items-center shrink-0 select-none group py-2">
      <div className="flex flex-col pr-8 sm:pr-10 xl:pr-12 2xl:pr-16">
        <span
          className={`block text-2xl sm:text-3xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-black uppercase tracking-tight whitespace-nowrap transition-colors duration-150 ${
            isDark
              ? 'text-white/90 group-hover:text-white'
              : 'text-neutral-900/90 group-hover:text-black'
          }`}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className={`block text-[11px] sm:text-xs xl:text-sm 2xl:text-base font-medium tracking-wide mt-1 2xl:mt-1.5 whitespace-nowrap transition-colors duration-150 ${
              isDark ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-600 font-semibold group-hover:text-neutral-900'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
      <span
        className={`text-xl sm:text-2xl xl:text-3xl 2xl:text-5xl font-light pr-8 sm:pr-10 xl:pr-12 2xl:pr-16 select-none ${
          isDark ? 'text-white/20' : 'text-neutral-400'
        }`}
      >
        |
      </span>
    </div>
  )
}

function CardSaveFiles({ isDark, animationsEnabled, onExpand, cardRef }) {
  const rolesList =
    experienceData?.experience?.marquee ||
    experienceData?.experience?.organizations ||
    []
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const singleSetRef = useRef(null)
  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)
  const hasMovedRef = useRef(false)
  const dragStartXRef = useRef(0)
  const targetOffsetRef = useRef(0)
  const currentOffsetRef = useRef(0)

  // Fluid speed: ~22 px/s
  const autoSpeed = 22

  // Velvety smooth wheel & trackpad handler (supports horizontal trackpad or vertical mouse wheel)
  const handleWheel = (e) => {
    e.stopPropagation()
    const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    const delta = e.deltaMode === 1 ? rawDelta * 22 : rawDelta
    targetOffsetRef.current += delta * 0.75
  }

  // Pointer drag for mouse and touch
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    isDraggingRef.current = true
    hasMovedRef.current = false
    dragStartXRef.current = e.clientX
    isHoveredRef.current = true
  }

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return
    const delta = dragStartXRef.current - e.clientX
    if (Math.abs(delta) > 3) {
      hasMovedRef.current = true
    }
    dragStartXRef.current = e.clientX
    targetOffsetRef.current += delta * 1.15
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
    setTimeout(() => {
      isHoveredRef.current = false
    }, 600)
  }

  useEffect(() => {
    let animationFrameId
    let lastTime = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      if (contentRef.current && singleSetRef.current) {
        const singleWidth = singleSetRef.current.offsetWidth

        if (singleWidth > 8) {
          // 1. Advance auto-scroll when idle (only when animations are enabled)
          if (animationsEnabled && !isHoveredRef.current && !isDraggingRef.current) {
            targetOffsetRef.current += autoSpeed * dt
          }

          // 2. Viscous exponential damping
          const lerpFactor = 1 - Math.exp(-7.5 * dt)
          currentOffsetRef.current += (targetOffsetRef.current - currentOffsetRef.current) * lerpFactor

          // 3. Seamless boundary wrapping
          while (targetOffsetRef.current >= singleWidth) {
            targetOffsetRef.current -= singleWidth
            currentOffsetRef.current -= singleWidth
          }
          while (targetOffsetRef.current < 0) {
            targetOffsetRef.current += singleWidth
            currentOffsetRef.current += singleWidth
          }

          // 4. GPU-accelerated subpixel horizontal translation
          contentRef.current.style.transform = `translate3d(${-currentOffsetRef.current}px, 0, 0)`
        }
      }

      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [animationsEnabled])

  return (
    <div
      ref={cardRef}
      onClick={() => {
        if (!hasMovedRef.current) {
          onExpand?.('experiences', cardRef)
        }
      }}
      className={`relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl border p-6 lg:p-8 xl:p-10 2xl:p-12 shadow-2xl transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-[#0c0d12] border-white/[0.04] hover:border-white/[0.14] hover:shadow-sky-500/5 shadow-black/80'
          : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] shadow-neutral-300/40'
      }`}
    >
      {/* Top Header: Experiences and where I have been */}
      <div className="relative z-10 pb-4 shrink-0 select-none">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className={`shrink-0 ${isDark ? 'text-neutral-400' : 'text-neutral-800'}`}>
            <UserRound className="w-5.5 h-5.5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 stroke-[2.5]" />
          </div>
          <h3
            className={`text-xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-semibold tracking-tight ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          >
            Experiences
          </h3>
        </div>
        <p
          className={`text-xs sm:text-sm lg:text-sm xl:text-base 2xl:text-lg leading-relaxed mt-1 xl:mt-2 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600 font-medium'
          }`}
        >
          where I have been
        </p>
      </div>

      {/* Bottom Area: Horizontal Marquee of Roles */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden flex items-center [mask-image:linear-gradient(to_right,transparent,black_32px,black_calc(100%-32px),transparent)]">
        {/* Scrollable horizontal container with physics momentum */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => {
            if (!isDraggingRef.current) isHoveredRef.current = true
          }}
          onMouseLeave={() => {
            if (!isDraggingRef.current) isHoveredRef.current = false
          }}
          className="h-full w-full overflow-hidden flex items-center select-none cursor-grab active:cursor-grabbing touch-none"
        >
          <div
            ref={contentRef}
            className="flex items-center will-change-transform"
          >
            {/* Set 1: Primary set measured for exact cycle width */}
            <div ref={singleSetRef} className="flex items-center">
              {rolesList.map((item, idx) => (
                <RoleMarqueeItem
                  key={`r1-${typeof item === 'string' ? item : item.id}-${idx}`}
                  item={item}
                  isDark={isDark}
                />
              ))}
            </div>

            {/* Set 2 */}
            <div className="flex items-center" aria-hidden="true">
              {rolesList.map((item, idx) => (
                <RoleMarqueeItem
                  key={`r2-${typeof item === 'string' ? item : item.id}-${idx}`}
                  item={item}
                  isDark={isDark}
                />
              ))}
            </div>

            {/* Set 3 */}
            <div className="flex items-center" aria-hidden="true">
              {rolesList.map((item, idx) => (
                <RoleMarqueeItem
                  key={`r3-${typeof item === 'string' ? item : item.id}-${idx}`}
                  item={item}
                  isDark={isDark}
                />
              ))}
            </div>

            {/* Set 4 */}
            <div className="flex items-center" aria-hidden="true">
              {rolesList.map((item, idx) => (
                <RoleMarqueeItem
                  key={`r4-${typeof item === 'string' ? item : item.id}-${idx}`}
                  item={item}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. CARD: Projects (Top-Right)
function ProjectCardItem({ project, isDark, onSelectProject }) {
  return (
    <div className="flex justify-end select-none py-1 2xl:py-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onSelectProject?.(project)
        }}
        className="group inline-flex items-center justify-end cursor-pointer text-right p-0 m-0 border-0 bg-transparent focus:outline-none w-fit"
        aria-label={`View ${project.name} case study`}
      >
        <span
          className={`inline-block text-right text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[6rem] font-black uppercase tracking-tight leading-[0.92] 2xl:leading-[0.88] transition-all duration-150 ${
            isDark
              ? 'text-white/85 group-hover:text-white group-hover:-translate-x-1.5'
              : 'text-neutral-900/85 group-hover:text-black group-hover:-translate-x-1.5'
          }`}
        >
          {project.name}
        </span>
      </button>
    </div>
  )
}

function CardProjects({ isDark, animationsEnabled, onExpand, cardRef }) {
  const allProjects = Array.isArray(projectsData) ? projectsData : (projectsData.projects || [])
  const projectsList = allProjects.filter((project) => project.chosen === true)
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const singleSetRef = useRef(null)
  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)
  const hasMovedRef = useRef(false)
  const dragStartYRef = useRef(0)
  const targetOffsetRef = useRef(0)
  const currentOffsetRef = useRef(0)

  // Fluid speed: ~22 px/s
  const autoSpeed = 22

  const handleSelectProject = (project) => {
    // If the user was dragging/scrolling with mouse, prevent opening case study
    if (hasMovedRef.current) return
    onExpand?.('projects', cardRef, project)
  }

  // Velvety smooth wheel & trackpad handler
  const handleWheel = (e) => {
    e.stopPropagation()
    // Normalize lines vs pixels (Windows mouse wheel vs trackpad)
    const delta = e.deltaMode === 1 ? e.deltaY * 22 : e.deltaY
    targetOffsetRef.current += delta * 0.75
  }

  // Pointer drag for mouse and touch
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    isDraggingRef.current = true
    hasMovedRef.current = false
    dragStartYRef.current = e.clientY
    isHoveredRef.current = true
  }

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return
    const delta = dragStartYRef.current - e.clientY
    if (Math.abs(delta) > 3) {
      hasMovedRef.current = true
    }
    dragStartYRef.current = e.clientY
    targetOffsetRef.current += delta * 1.15
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
    setTimeout(() => {
      isHoveredRef.current = false
    }, 600)
  }

  useEffect(() => {
    let animationFrameId
    let lastTime = performance.now()

    const tick = (now) => {
      // Clamped dt to prevent frame lag spikes
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      if (contentRef.current && singleSetRef.current) {
        const computedGap = parseFloat(window.getComputedStyle(contentRef.current).rowGap) || 24
        const singleHeight = singleSetRef.current.offsetHeight + computedGap

        if (singleHeight > 8) {
          // 1. Advance auto-scroll when idle (only when animations are enabled)
          if (animationsEnabled && !isHoveredRef.current && !isDraggingRef.current) {
            targetOffsetRef.current += autoSpeed * dt
          }

          // 2. Viscous exponential damping (Lenis/physics momentum for trackpad & mouse)
          const lerpFactor = 1 - Math.exp(-7.5 * dt)
          currentOffsetRef.current += (targetOffsetRef.current - currentOffsetRef.current) * lerpFactor

          // 3. Seamless boundary wrapping: preserves momentum across loop reset
          while (targetOffsetRef.current >= singleHeight) {
            targetOffsetRef.current -= singleHeight
            currentOffsetRef.current -= singleHeight
          }
          while (targetOffsetRef.current < 0) {
            targetOffsetRef.current += singleHeight
            currentOffsetRef.current += singleHeight
          }

          // 4. GPU-accelerated subpixel translation
          contentRef.current.style.transform = `translate3d(0, ${-currentOffsetRef.current}px, 0)`
        }
      }

      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [animationsEnabled])

  return (
    <div
      ref={cardRef}
      onClick={() => {
        if (!hasMovedRef.current) {
          onExpand?.('projects', cardRef)
        }
      }}
      className={`relative flex h-full min-h-0 flex-col md:flex-row justify-between overflow-hidden rounded-3xl border p-6 lg:p-8 xl:p-10 2xl:p-12 shadow-2xl transition-all duration-300 cursor-pointer ${isDark
        ? 'bg-[#0c0d12] border-white/[0.04] hover:border-white/[0.14] hover:shadow-sky-500/5 shadow-black/80'
        : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] shadow-neutral-300/40'
        }`}
    >
      {/* Left Column: Icon & Title & Subtitle */}
      <div className="relative z-10 flex flex-col justify-end shrink-0 md:w-[28%] lg:w-[24%] xl:w-[23%] 2xl:w-[27%] pr-4 mb-4 md:mb-0 select-none">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className={`shrink-0 ${isDark ? 'text-neutral-400' : 'text-neutral-800'}`}>
            <CodeXml className="w-5.5 h-5.5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 stroke-[2.5]" />
          </div>
          <h3
            className={`text-xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'
              }`}
          >
            Projects
          </h3>
        </div>
        <p
          className={`text-xs sm:text-sm lg:text-sm xl:text-base 2xl:text-lg leading-relaxed mt-1 xl:mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600 font-medium'
            }`}
        >
          a little of what I do.
        </p>
      </div>

      {/* Right Column: Marquee Project List */}
      <div className="relative flex-1 min-h-0 h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)]">
        {/* Scrollable container with physics momentum */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => {
            if (!isDraggingRef.current) isHoveredRef.current = true
          }}
          onMouseLeave={() => {
            if (!isDraggingRef.current) isHoveredRef.current = false
          }}
          className="h-full w-full overflow-hidden pr-1 sm:pr-2 select-none cursor-grab active:cursor-grabbing touch-none"
        >
          <div
            ref={contentRef}
            className="flex flex-col gap-5 sm:gap-6 xl:gap-8 2xl:gap-11 py-4 will-change-transform"
          >
            {/* Set 1: Primary set measured for exact cycle height */}
            <div ref={singleSetRef} className="flex flex-col gap-5 sm:gap-6 xl:gap-8 2xl:gap-11">
              {projectsList.map((project, idx) => (
                <ProjectCardItem
                  key={`s1-${project.id}-${idx}`}
                  project={project}
                  isDark={isDark}
                  onSelectProject={handleSelectProject}
                />
              ))}
            </div>

            {/* Set 2: Duplicate set for seamless continuous looping */}
            <div className="flex flex-col gap-5 sm:gap-6 xl:gap-8 2xl:gap-11" aria-hidden="true">
              {projectsList.map((project, idx) => (
                <ProjectCardItem
                  key={`s2-${project.id}-${idx}`}
                  project={project}
                  isDark={isDark}
                  onSelectProject={handleSelectProject}
                />
              ))}
            </div>

            {/* Set 3: Extra buffer set for large/ultrawide viewports */}
            <div className="flex flex-col gap-5 sm:gap-6 xl:gap-8 2xl:gap-11" aria-hidden="true">
              {projectsList.map((project, idx) => (
                <ProjectCardItem
                  key={`s3-${project.id}-${idx}`}
                  project={project}
                  isDark={isDark}
                  onSelectProject={handleSelectProject}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to track current Cebu time (hour and minute) and determine class status from schedule.json
function useCebuSchedule() {
  const [statusInfo, setStatusInfo] = useState({
    timeString: '',
    isInClass: false,
    currentClass: null,
  })

  useEffect(() => {
    const update = () => {
      const now = new Date()

      // 1. Format Cebu time (only hour and minute, e.g. "08:35 PM")
      const timeDtf = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      const timeString = timeDtf.format(now)

      // 2. Manila day of week & minutes from midnight (Asia/Manila is UTC+8 continuously without daylight saving time)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000
      const manilaDate = new Date(utc + 8 * 3600000)
      const dayOfWeek = manilaDate.getDay() // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
      const currentMinutes = manilaDate.getHours() * 60 + manilaDate.getMinutes()

      // 3. Find today's classes
      const todaySchedule = scheduleData?.schedule?.find(
        (entry) => entry.dayOfWeek === dayOfWeek
      )

      let activeClass = null
      if (todaySchedule && Array.isArray(todaySchedule.classes)) {
        for (const cls of todaySchedule.classes) {
          const [sH, sM] = cls.start.split(':').map(Number)
          const [eH, eM] = cls.end.split(':').map(Number)
          const startMin = sH * 60 + sM
          const endMin = eH * 60 + eM

          if (currentMinutes >= startMin && currentMinutes < endMin) {
            activeClass = cls
            break
          }
        }
      }

      setStatusInfo({
        timeString,
        isInClass: Boolean(activeClass),
        currentClass: activeClass,
      })
    }

    update()
    const timer = setInterval(update, 10000)
    return () => clearInterval(timer)
  }, [])

  return statusInfo
}

// 3. CARD: Multilingual / ASCII Saturn (Bottom-Left)
function CardMultilingual({ isDark, animationsEnabled }) {
  const { timeString, isInClass, currentClass } = useCebuSchedule()

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl border p-6 lg:p-8 xl:p-10 2xl:p-12 shadow-2xl transition-all duration-300 ${isDark
        ? 'bg-[#0c0d12] border-white/[0.04] hover:border-white/[0.08] shadow-black/80'
        : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] shadow-neutral-300/40'
        }`}
    >
      <AsciiSaturn isDark={isDark} animationsEnabled={animationsEnabled} />
      <div className="relative z-10 my-auto pointer-events-none shrink-0 max-w-[55%] lg:max-w-[54%] xl:max-w-[52%] 2xl:max-w-[58%]">
        <h1
          className={`font-sans text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6.25rem] 2xl:text-[9.5rem] font-black uppercase tracking-tight text-transparent select-none leading-none whitespace-nowrap transition-all duration-300 inline-block origin-left scale-x-95 ${
            isDark ? 'dustin-stroke-dark' : 'dustin-stroke-light'
          }`}
        >
          DUSTIN
        </h1>
        <p
          className={`text-[10px] sm:text-[11px] md:text-xs lg:text-xs xl:text-sm 2xl:text-base leading-relaxed mt-2 sm:mt-2.5 xl:mt-3 2xl:mt-3.5 font-medium tracking-wide ${isDark ? 'text-neutral-400' : 'text-neutral-700 font-medium'
            }`}
        >
          University of San Carlos • Computer Science
        </p>

        {/* Live CEB-TIME & Status: "In class" or "Probably doing something" */}
        {timeString && (
          <div
            className={`flex items-center flex-wrap gap-2.5 mt-0.5 sm:mt-1 2xl:mt-1.5 text-[9px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-xs 2xl:text-sm font-normal tracking-wide ${
              isDark ? 'text-neutral-400' : 'text-neutral-700 font-medium'
            }`}
          >
            <span className="font-mono font-normal">CEB-{timeString}</span>
            <div
              className="inline-flex items-center gap-1.5"
              title={isInClass && currentClass ? `${currentClass.course} (${currentClass.room})` : undefined}
            >
              <span
                className={`w-1.5 h-1.5 2xl:w-2 2xl:h-2 rounded-full shrink-0 ${
                  isInClass
                    ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse'
                    : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                }`}
              />
              <span>
                {isInClass ? 'In class' : 'Probably doing something'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Social Icons for Contact Card
function GmailIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  )
}

function LinkedinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

// 4. CARD: Calendar / Contact (Bottom-Right)
function CardCalendar({ isDark, onExpand, cardRef }) {
  const contact = contactData?.contact || {}
  const linkedin = contact.socials?.find((s) => s.platform.toLowerCase() === 'linkedin')
  const github = contact.socials?.find((s) => s.platform.toLowerCase() === 'github')

  const items = [
    {
      id: 'email',
      Icon: GmailIcon,
      label: contact.email || 'dustinj.bal09@gmail.com',
      href: `mailto:${contact.email || 'dustinj.bal09@gmail.com'}`,
    },
    {
      id: 'linkedin',
      Icon: LinkedinIcon,
      label: linkedin?.username || 'Dustin Jesse Balansag',
      href: linkedin?.url || 'https://linkedin.com/in/dustin-jesse-balansag',
    },
    {
      id: 'github',
      Icon: GithubIcon,
      label: github?.username || 'Shironium09',
      href: github?.url || 'https://github.com/Shironium09',
    },
  ]

  return (
    <div
      ref={cardRef}
      onClick={() => onExpand?.('contact', cardRef)}
      className={`relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl border p-5 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 shadow-2xl transition-all duration-300 cursor-pointer ${isDark
        ? 'bg-[#0c0d12] border-white/[0.04] hover:border-white/[0.14] hover:shadow-sky-500/5 shadow-black/80'
        : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] shadow-neutral-300/40'
        }`}
    >
      {/* Top Preview: Contact links list in format '*icon* | info' */}
      <div className="relative flex-1 min-h-0 w-full flex flex-col justify-center gap-1 sm:gap-1.5 lg:gap-2 xl:gap-2.5 2xl:gap-3 py-1 select-none">
        {items.map(({ id, Icon, label, href }) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`group flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 xl:gap-4 2xl:gap-5 py-0.5 lg:py-1 xl:py-1 2xl:py-1.5 transition-all duration-200 cursor-pointer ${
              isDark
                ? 'text-neutral-300 hover:text-white'
                : 'text-neutral-700 hover:text-black font-medium'
            }`}
          >
            <div className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
              isDark ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-700 group-hover:text-black'
            }`}>
              <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 xl:w-5.5 xl:h-5.5 2xl:w-7 2xl:h-7" />
            </div>

            <span className={`text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-3xl font-light select-none ${isDark ? 'text-white/20' : 'text-neutral-400'}`}>
              |
            </span>

            <span className="text-xs sm:text-[13px] md:text-[13px] lg:text-sm xl:text-base 2xl:text-2xl font-medium tracking-tight truncate flex-1 min-w-0 transition-transform duration-200 group-hover:translate-x-1">
              {label}
            </span>
          </a>
        ))}
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 pt-4 shrink-0 flex flex-col items-end text-right select-none">
        <div className="flex items-center justify-end gap-2.5 sm:gap-3">
          <h3
            className={`text-xl lg:text-2xl xl:text-3xl 2xl:text-5xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'
              }`}
          >
            Contact
          </h3>
          <div className={`shrink-0 ${isDark ? 'text-neutral-400' : 'text-neutral-800'}`}>
            <Phone className="w-5.5 h-5.5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 stroke-[2.5]" />
          </div>
        </div>
        <p
          className={`text-xs sm:text-sm lg:text-sm xl:text-base 2xl:text-lg leading-relaxed mt-1 xl:mt-2 text-right ${isDark ? 'text-neutral-400' : 'text-neutral-600 font-medium'
            }`}
        >
          a little hello can go a long way
        </p>
      </div>
    </div>
  )
}

// Larger Bento Grid Container (Shifted right by flex container)
export default function BentoGrid({
  isDark = true,
  animationsEnabled = true,
  poppedCards = { saturn: true, contact: true, projects: true, experiences: true },
  isEntranceActive = false,
}) {
  const [expandedCard, setExpandedCard] = useState(null)
  const [originRect, setOriginRect] = useState(null)
  const [initialCaseStudy, setInitialCaseStudy] = useState(null)

  const saveFilesRef = useRef(null)
  const projectsRef = useRef(null)
  const calendarRef = useRef(null)

  const handleExpand = (id, ref, caseStudy = null) => {
    if (ref?.current) {
      const rect = ref.current.getBoundingClientRect()
      setOriginRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }
    setInitialCaseStudy(caseStudy)
    setExpandedCard(id)
  }

  const handleClose = () => {
    setExpandedCard(null)
    setOriginRect(null)
    setInitialCaseStudy(null)
  }

  const springPopTransition = {
    scale: {
      type: 'spring',
      stiffness: 360,
      damping: 22,
      mass: 0.7,
    },
    opacity: {
      duration: 0.15,
      ease: 'easeOut',
    },
  }

  return (
    <>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-5 xl:gap-6 2xl:gap-8">
        {/* Row 1, Col 1: Experiences */}
        <motion.div
          initial={isEntranceActive ? { scale: 0.05, opacity: 0 } : false}
          animate={
            isEntranceActive
              ? poppedCards?.experiences
                ? { scale: 1, opacity: 1 }
                : { scale: 0.05, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={springPopTransition}
          className={`md:col-span-1 h-full min-h-0 origin-center ${
            poppedCards?.experiences ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <CardSaveFiles
            isDark={isDark}
            animationsEnabled={animationsEnabled}
            onExpand={handleExpand}
            cardRef={saveFilesRef}
          />
        </motion.div>

        {/* Row 1, Col 2: Projects */}
        <motion.div
          initial={isEntranceActive ? { scale: 0.05, opacity: 0 } : false}
          animate={
            isEntranceActive
              ? poppedCards?.projects
                ? { scale: 1, opacity: 1 }
                : { scale: 0.05, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={springPopTransition}
          className={`md:col-span-2 h-full min-h-0 origin-center ${
            poppedCards?.projects ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <CardProjects
            isDark={isDark}
            animationsEnabled={animationsEnabled}
            onExpand={handleExpand}
            cardRef={projectsRef}
          />
        </motion.div>

        {/* Row 2, Col 1: Page with my name (Dustin / Saturn) */}
        <motion.div
          initial={isEntranceActive ? { scale: 0.05, opacity: 0 } : false}
          animate={
            isEntranceActive
              ? poppedCards?.saturn
                ? { scale: 1, opacity: 1 }
                : { scale: 0.05, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={springPopTransition}
          className={`md:col-span-2 h-full min-h-0 origin-center ${
            poppedCards?.saturn ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <CardMultilingual isDark={isDark} animationsEnabled={animationsEnabled} />
        </motion.div>

        {/* Row 2, Col 2: Contact */}
        <motion.div
          initial={isEntranceActive ? { scale: 0.05, opacity: 0 } : false}
          animate={
            isEntranceActive
              ? poppedCards?.contact
                ? { scale: 1, opacity: 1 }
                : { scale: 0.05, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={springPopTransition}
          className={`md:col-span-1 h-full min-h-0 origin-center ${
            poppedCards?.contact ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <CardCalendar
            isDark={isDark}
            onExpand={handleExpand}
            cardRef={calendarRef}
          />
        </motion.div>
      </div>

      {/* Seamless Expanding Fullscreen Modal */}
      {expandedCard && (
        <ExpandedCardModal
          expandedCard={expandedCard}
          originRect={originRect}
          isDark={isDark}
          animationsEnabled={animationsEnabled}
          initialCaseStudy={initialCaseStudy}
          onClose={handleClose}
        />
      )}
    </>
  )
}
