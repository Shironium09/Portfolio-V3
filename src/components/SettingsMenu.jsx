import React from 'react'
import {
  Moon,
  Sun,
  Sparkles,
  ZapOff,
  X,
  SlidersHorizontal,
} from 'lucide-react'

export default function SettingsMenu({
  isOpen,
  setIsOpen,
  isDark,
  setIsDark,
  animationsEnabled,
  setAnimationsEnabled,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-4 md:p-6 bg-black/40 backdrop-blur-sm transition-all duration-200">
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setIsOpen(false)}
      />

      {/* Popover Card */}
      <div
        className={`w-72 sm:w-80 rounded-2xl border p-4 shadow-2xl transition-all duration-200 ${
          isDark
            ? 'bg-[#12131a]/95 border-white/[0.12] text-white shadow-black/80'
            : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-xl'
        } backdrop-blur-xl animate-in fade-in zoom-in-95`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold tracking-wider uppercase font-mono">
              System Settings
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? 'text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {/* 1. Theme Toggle */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.06]'
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-lg ${
                  isDark ? 'bg-white/[0.08] text-amber-300' : 'bg-neutral-200 text-amber-600'
                }`}
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-[13px] font-medium leading-tight">Theme</div>
                <div className="text-[11px] text-neutral-400">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isDark ? 'bg-red-500' : 'bg-neutral-300'
              }`}
              role="switch"
              aria-checked={isDark}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 2. Animations Toggle */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.06]'
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-lg ${
                  animationsEnabled
                    ? 'bg-red-500/10 text-red-400'
                    : isDark
                    ? 'bg-white/[0.08] text-neutral-400'
                    : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {animationsEnabled ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <ZapOff className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="text-[13px] font-medium leading-tight">Animations</div>
                <div className="text-[11px] text-neutral-400">
                  {animationsEnabled ? 'Active (Globe & Motion)' : 'Disabled (Reduced Motion)'}
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setAnimationsEnabled((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                animationsEnabled ? 'bg-red-500' : 'bg-neutral-400/40'
              }`}
              role="switch"
              aria-checked={animationsEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer status tip */}
        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-400">
          <span>Unscrollable Viewport</span>
          <span className="font-mono text-red-500/90 font-medium">LIVE</span>
        </div>
      </div>
    </div>
  )
}
