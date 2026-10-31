import React from 'react'
import { motion } from 'motion/react'
import { Download } from 'lucide-react'
import contactData from '../data/contact.json'
import cvPdf from '../assets/cv/CV (Balansag).pdf'

function GithubIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function GmailIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  )
}

function LinkedinIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

function FacebookIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export default function ContactPanel({
  isDark = true,
  animationsEnabled = true,
}) {
  const contact = contactData?.contact || {}
  const socials = contact.socials || []

  const linkedin = socials.find((s) => s.platform.toLowerCase() === 'linkedin')
  const github = socials.find((s) => s.platform.toLowerCase() === 'github')
  const facebook = socials.find((s) => s.platform.toLowerCase() === 'facebook')

  const leftColumnItems = [
    {
      id: 'github',
      Icon: GithubIcon,
      label: github?.username || 'Shironium09',
      href: github?.url || 'https://github.com/Shironium09',
    },
    {
      id: 'email',
      Icon: GmailIcon,
      label: contact.email || 'dustinj.bal09@gmail.com',
      href: `mailto:${contact.email || 'dustinj.bal09@gmail.com'}`,
    },
  ]

  const rightColumnItems = [
    {
      id: 'linkedin',
      Icon: LinkedinIcon,
      label: linkedin?.username || 'Dustin Jesse Balansag',
      href: linkedin?.url || 'https://linkedin.com/in/dustin-jesse-balansag',
    },
    {
      id: 'facebook',
      Icon: FacebookIcon,
      label: facebook?.username || 'Dustin Jesse Balansag',
      href: facebook?.url || 'https://www.facebook.com/dustinjesse.balansag.5',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 py-10 sm:py-14 md:py-18 lg:py-24 2xl:py-32 select-none flex-1 flex flex-col justify-center items-center">
      <motion.div
        variants={containerVariants}
        initial={animationsEnabled ? 'hidden' : 'visible'}
        animate="visible"
        className="w-full flex flex-col items-center"
      >
        {/* 2-Column Contact Links Matching Sketch */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 lg:gap-24 2xl:gap-36 max-w-3xl lg:max-w-4xl 2xl:max-w-5xl">
          {/* Column 1 (Left): GitHub & Gmail */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 2xl:gap-14">
            {leftColumnItems.map((item) => {
              const { Icon } = item
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <a
                    href={item.href}
                    target={item.id === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-3.5 sm:gap-4.5 2xl:gap-6 transition-all duration-200 cursor-pointer ${
                      isDark
                        ? 'text-neutral-200 hover:text-white'
                        : 'text-neutral-800 hover:text-black'
                    }`}
                  >
                    <div
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isDark
                          ? 'text-neutral-300 group-hover:text-white'
                          : 'text-neutral-700 group-hover:text-black'
                      }`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 2xl:w-11 2xl:h-11" />
                    </div>
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </a>
                </motion.div>
              )
            })}
          </div>

          {/* Column 2 (Right): LinkedIn & Facebook */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 2xl:gap-14">
            {rightColumnItems.map((item) => {
              const { Icon } = item
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-3.5 sm:gap-4.5 2xl:gap-6 transition-all duration-200 cursor-pointer ${
                      isDark
                        ? 'text-neutral-200 hover:text-white'
                        : 'text-neutral-800 hover:text-black'
                    }`}
                  >
                    <div
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isDark
                          ? 'text-neutral-300 group-hover:text-white'
                          : 'text-neutral-700 group-hover:text-black'
                      }`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 2xl:w-11 2xl:h-11" />
                    </div>
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </a>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Download CV (Centered Underlined Link Matching Sketch) */}
        <motion.div
          variants={itemVariants}
          className="mt-14 sm:mt-18 md:mt-24 2xl:mt-36 text-center"
        >
          <a
            href={cvPdf}
            download="CV (Balansag).pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative inline-flex items-center gap-2.5 sm:gap-3 2xl:gap-4 text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-extrabold uppercase tracking-tight pb-1.5 2xl:pb-2.5 transition-all duration-300 cursor-pointer ${
              isDark
                ? 'text-white hover:text-neutral-200'
                : 'text-neutral-900 hover:text-neutral-700'
            }`}
            aria-label="Download Curriculum Vitae (PDF)"
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-8 2xl:h-8 transition-transform duration-300 group-hover:translate-y-1" />
            <span>Download CV</span>

            {/* Underline matching the sketch drawing */}
            <span
              className={`absolute bottom-0 left-0 right-0 h-[2px] 2xl:h-[3.5px] transition-all duration-300 ${
                isDark
                  ? 'bg-white group-hover:h-[3px] 2xl:group-hover:h-[5px]'
                  : 'bg-neutral-900 group-hover:h-[3px] 2xl:group-hover:h-[5px]'
              }`}
            />
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}
