import React from 'react'

export default function DustinLogo({ className = 'w-9 h-9', isDark = true }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Slanted Geometric 'D' */}
      <g transform="skewX(-14)">
        {/* Main White 'D' Body */}
        <path
          d="M26 14 H56 C68 14 74 24 72 38 C70 52 60 66 46 66 H16 L26 14 Z"
          fill={isDark ? '#FFFFFF' : '#111218'}
        />
        {/* Inner Counter Cutout */}
        <path
          d="M38 26 H50 C55 26 58 31 57 38 C56 46 51 54 44 54 H33 L38 26 Z"
          fill={isDark ? '#07080b' : '#f4f5f8'}
        />
        {/* Red Tech Cross Overlap */}
        {/* Horizontal Red Bar */}
        <path
          d="M10 37 H48 V43 H10 Z"
          fill="#ef4444"
        />
        {/* Vertical Red Accent Bar */}
        <path
          d="M28 22 H34 V58 H28 Z"
          fill="#ef4444"
        />
      </g>
    </svg>
  )
}
