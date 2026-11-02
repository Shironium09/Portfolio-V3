import React from 'react'
import skillsData from '../data/skills.json'

export default function SkillsPanel({ isDark = true }) {
  const categories = skillsData?.categories || []

  return (
    <div className="w-full pt-2 pb-12">
      {categories.map((cat, index) => {
        const itemNumber = index + 1

        return (
          <div
            key={cat.id || index}
            className={`w-full border-b py-8 sm:py-10 lg:py-12 2xl:py-16 first:pt-4 transition-colors duration-200 ${
              isDark ? 'border-white/[0.08]' : 'border-neutral-200'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 lg:gap-10 xl:gap-14 2xl:gap-20">
              {/* Left Column: Index [01], TITLE, Category description */}
              <div className="flex items-start gap-3 sm:gap-4 md:gap-5 flex-[1.2] lg:flex-[1.3] min-w-0">
                {/* Index tag e.g. [01] - sleek technical tag */}
                <span
                  className={`font-mono text-xs sm:text-sm md:text-sm 2xl:text-base font-semibold shrink-0 select-none pt-1 sm:pt-1.5 md:pt-2 transition-colors duration-200 ${
                    isDark ? 'text-neutral-400/70' : 'text-neutral-500/80'
                  }`}
                >
                  [{itemNumber < 10 ? `0${itemNumber}` : itemNumber}]
                </span>

                {/* Container for TITLE and Description */}
                <div className="min-w-0 flex flex-col">
                  <h2
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.08] break-normal select-none transition-colors duration-200 ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {cat.title}
                  </h2>

                  {cat.description && (
                    <p
                      className={`text-xs sm:text-sm 2xl:text-base mt-2 sm:mt-2.5 font-normal leading-relaxed ${
                        isDark ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Minimal Soft Skill Badges (No Dots, No Borders) */}
              <div className="flex-[0.9] lg:flex-[1.1] flex flex-col justify-start gap-3 pt-1 sm:pt-1.5 md:pt-2">
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 2xl:gap-3.5">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={`${cat.id}-${skill}-${sIdx}`}
                      className={`inline-flex items-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-mono text-xs sm:text-[13px] 2xl:text-sm font-medium tracking-wide select-none transition-all duration-150 cursor-default ${
                        isDark
                          ? 'bg-white/[0.06] text-neutral-200 hover:bg-white/[0.12] hover:text-white'
                          : 'bg-neutral-200/70 text-neutral-800 hover:bg-neutral-300/80 hover:text-black'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
