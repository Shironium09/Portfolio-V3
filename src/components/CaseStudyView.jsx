import React from 'react'
import PageFooter from './PageFooter'
import cebuPlantDepotImg from '../assets/projects/cebu-plant-depot.png'
import credenzaImg from '../assets/projects/credenza.png'
import awasImg from '../assets/projects/awas.png'
import leftoverImg from '../assets/projects/leftover.png'
import alexandriaImg from '../assets/projects/alexandria.png'
import angbotImg from '../assets/projects/angbot.jpg'
import colloqiumImg from '../assets/projects/colloqium.png'

const projectImages = {
  'cebu-plant-depot': cebuPlantDepotImg,
  'credenza': credenzaImg,
  'awas': awasImg,
  'leftover': leftoverImg,
  'alexandria': alexandriaImg,
  'angbot': angbotImg,
  'colloquium': colloqiumImg,
  'colloqium': colloqiumImg,
}

export default function CaseStudyView({
  project,
  prevProject,
  nextProject,
  isDark = true,
  onPrevProject,
  onNextProject,
}) {
  const imageSrc = projectImages[project.id] || project.image

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1520px] 3xl:max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 pt-8 sm:pt-10 lg:pt-14 2xl:pt-18 pb-16 2xl:pb-24 select-text min-h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Top Center: Project Title */}
      <div className="text-center pb-8 sm:pb-12 lg:pb-14 2xl:pb-18 select-none">
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black uppercase tracking-tight leading-none ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {project.name}
        </h1>
      </div>

      {/* Middle: 2-Column Split (Image + Tech Stack on Left, Problem + Solution on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 2xl:gap-20 items-start flex-1">
        {/* Left Column: Image Mockup & Tech Stack */}
        <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5 2xl:gap-6">
          {/* Image Frame */}
          <div
            className={`w-full overflow-hidden rounded-2xl border transition-colors duration-200 shadow-2xl ${
              isDark
                ? 'border-white/10 bg-white/[0.02] shadow-black/80'
                : 'border-neutral-200 bg-neutral-100 shadow-neutral-300/40'
            }`}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={project.name}
                className="w-full h-auto max-h-[380px] sm:max-h-[440px] lg:max-h-[500px] xl:max-h-[580px] 2xl:max-h-[660px] object-cover object-top select-none"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-neutral-500 font-mono text-sm">
                [Image preview]
              </div>
            )}
          </div>

          {/* Tech stack • tech stack directly underneath */}
          {project.tags && project.tags.length > 0 && (
            <div
              className={`flex flex-wrap items-center text-xs sm:text-sm 2xl:text-base font-medium tracking-wide transition-colors duration-200 ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              {project.tags.map((tag, tIdx) => (
                <React.Fragment key={tag}>
                  {tIdx > 0 && (
                    <span
                      className={`mx-2 select-none opacity-40 ${
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

        {/* Right Column: Problem and Solution */}
        <div className="lg:col-span-6 flex flex-col gap-8 sm:gap-10 2xl:gap-14">
          {/* Problem */}
          <div className="flex flex-col gap-2.5 sm:gap-3 2xl:gap-4">
            <h2
              className={`text-xl sm:text-2xl 2xl:text-3xl font-black uppercase tracking-tight ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Problem
            </h2>
            <p
              className={`text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl leading-relaxed font-normal ${
                isDark ? 'text-neutral-300' : 'text-neutral-600'
              }`}
            >
              {project['case-study']?.problem}
            </p>
          </div>

          {/* Solution */}
          <div className="flex flex-col gap-2.5 sm:gap-3 2xl:gap-4">
            <h2
              className={`text-xl sm:text-2xl 2xl:text-3xl font-black uppercase tracking-tight ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Solution
            </h2>
            <p
              className={`text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl leading-relaxed font-normal ${
                isDark ? 'text-neutral-300' : 'text-neutral-600'
              }`}
            >
              {project['case-study']?.solution}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Divider Line */}
      <div
        className={`w-full border-b my-8 sm:my-10 lg:my-12 2xl:my-16 transition-colors duration-200 ${
          isDark ? 'border-white/[0.08]' : 'border-neutral-200'
        }`}
      />

      {/* Bottom Area: Prev Proj & Next Proj Navigation */}
      <div className="flex items-center justify-between gap-4 w-full">
        {prevProject ? (
          <button
            type="button"
            onClick={onPrevProject}
            className={`group flex items-center gap-2 text-base sm:text-lg lg:text-xl 2xl:text-2xl font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 ${
              isDark
                ? 'text-white/90 hover:text-white'
                : 'text-neutral-900 hover:text-black'
            }`}
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1.5 font-mono">
              &lt;—
            </span>
            <span>Prev Proj</span>
            <span className="text-xs sm:text-sm 2xl:text-base font-normal text-neutral-500 ml-1 hidden sm:inline">
              ({prevProject.name})
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextProject ? (
          <button
            type="button"
            onClick={onNextProject}
            className={`group flex items-center gap-2 text-base sm:text-lg lg:text-xl 2xl:text-2xl font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 ml-auto ${
              isDark
                ? 'text-white/90 hover:text-white'
                : 'text-neutral-900 hover:text-black'
            }`}
          >
            <span>Next Proj</span>
            <span className="text-xs sm:text-sm 2xl:text-base font-normal text-neutral-500 ml-1 hidden sm:inline">
              ({nextProject.name})
            </span>
            <span className="transition-transform duration-200 group-hover:translate-x-1.5 font-mono">
              —&gt;
            </span>
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Centered GitHub, Email & CEB-TIME Footer */}
      <PageFooter
        isDark={isDark}
        githubUrl={project.link || 'https://github.com/Shironium09'}
        githubLabel="Shironium09"
        className="pt-10 sm:pt-14 2xl:pt-18"
      />
    </div>
  )
}

