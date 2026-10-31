import React, { useState, useEffect } from 'react'
import { Mail } from 'lucide-react'

export function GithubIcon({ className = 'w-4 h-4' }) {
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

export default function PageFooter({
  isDark = true,
  githubUrl = 'https://github.com/Shironium09',
  githubLabel = 'Shironium09',
  email = 'dustinj.bal09@gmail.com',
  className = '',
}) {
  const [cebuTime, setCebuTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
        setCebuTime(formatter.format(new Date()))
      } catch {
        const now = new Date()
        const utc = now.getTime() + now.getTimezoneOffset() * 60000
        const cebuDate = new Date(utc + 3600000 * 8)
        setCebuTime(cebuDate.toLocaleTimeString())
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <footer
      className={`w-full flex flex-col items-center justify-center pt-10 sm:pt-14 2xl:pt-20 pb-8 2xl:pb-12 select-none pointer-events-auto ${className}`}
    >
      {/* Centered GitHub & Email Links */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 2xl:gap-12 text-xs sm:text-sm 2xl:text-base font-medium">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center gap-2 2xl:gap-3 transition-colors duration-200 ${
            isDark
              ? 'text-neutral-400 hover:text-white'
              : 'text-neutral-600 hover:text-black'
          }`}
        >
          <GithubIcon className="w-4 h-4 2xl:w-5 2xl:h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span>{githubLabel}</span>
        </a>

        <a
          href={`mailto:${email}`}
          className={`group inline-flex items-center gap-2 2xl:gap-3 transition-colors duration-200 ${
            isDark
              ? 'text-neutral-400 hover:text-white'
              : 'text-neutral-600 hover:text-black'
          }`}
        >
          <Mail
            className="w-4 h-4 2xl:w-5 2xl:h-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
            strokeWidth={2}
          />
          <span>{email}</span>
        </a>
      </div>

      {/* Centered CEB-TIME directly below */}
      <div className="flex items-center justify-center mt-3 sm:mt-3.5 2xl:mt-5">
        <span
          className={`font-mono text-xs sm:text-sm 2xl:text-base tracking-wider font-semibold select-none ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          CEB-{cebuTime}
        </span>
      </div>
    </footer>
  )
}
