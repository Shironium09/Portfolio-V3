import popSoundUrl from '../assets/effects/pop-sound.wav'
import transitionSoundUrl from '../assets/effects/transition.wav'
import clickSoundUrl from '../assets/effects/click.mp3'

const STORAGE_KEY = 'portfolio_sound_muted'

let isMutedState =
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY) === 'true'
    : false

let audioCtx = null
let popAudioBuffer = null
let transitionAudioBuffer = null
let clickAudioBuffer = null

export function getSoundMuted() {
  return isMutedState
}

export function setSoundMuted(muted) {
  isMutedState = Boolean(muted)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, String(isMutedState))
    } catch {
      // Ignore localStorage errors
    }
  }
}

export function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  return audioCtx
}

export function unlockAudio() {
  if (typeof window === 'undefined') return
  try {
    const ctx = getAudioContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
  } catch {
    // Ignore unlock errors
  }
}

// Global unlock on early user gesture
if (typeof window !== 'undefined') {
  const onGesture = () => {
    unlockAudio()
    window.removeEventListener('pointerdown', onGesture)
    window.removeEventListener('keydown', onGesture)
    window.removeEventListener('touchstart', onGesture)
  }

  window.addEventListener('pointerdown', onGesture, { passive: true })
  window.addEventListener('keydown', onGesture, { passive: true })
  window.addEventListener('touchstart', onGesture, { passive: true })
}

async function decodeAudioUrl(ctx, url) {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return await ctx.decodeAudioData(arrayBuffer)
  } catch {
    return null
  }
}

export async function preloadAllSounds() {
  if (typeof window === 'undefined') return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const [popBuf, transBuf, clickBuf] = await Promise.all([
      decodeAudioUrl(ctx, popSoundUrl),
      decodeAudioUrl(ctx, transitionSoundUrl),
      decodeAudioUrl(ctx, clickSoundUrl),
    ])
    if (popBuf) popAudioBuffer = popBuf
    if (transBuf) transitionAudioBuffer = transBuf
    if (clickBuf) clickAudioBuffer = clickBuf
  } catch {
    // Fall back to HTML5 Audio if decode fails
  }
}

export function preloadPopSound() {
  return preloadAllSounds()
}

function playSound(buffer, fallbackUrl, volume) {
  if (typeof window === 'undefined' || isMutedState) return

  // 1. Try Web Audio API ONLY if context is currently running.
  try {
    const ctx = getAudioContext()
    if (ctx && ctx.state === 'running' && buffer) {
      const source = ctx.createBufferSource()
      const gainNode = ctx.createGain()
      gainNode.gain.value = volume
      source.buffer = buffer
      source.connect(gainNode)
      gainNode.connect(ctx.destination)
      source.start(0)
      return
    }
  } catch {
    // Fall through to HTML5 fallback
  }

  // 2. HTML5 Audio Fallback
  try {
    const audio = new Audio(fallbackUrl)
    audio.volume = volume
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Discard without queuing
      })
    }
  } catch {
    // Ignore audio error
  }
}

export function playPopSound(volume = 0.08) {
  playSound(popAudioBuffer, popSoundUrl, volume)
}

export function playTransitionSound(volume = 0.05) {
  playSound(transitionAudioBuffer, transitionSoundUrl, volume)
}

export function playClickSound(volume = 0.06) {
  playSound(clickAudioBuffer, clickSoundUrl, volume)
}

// Global click sound listener for anything clickable
if (typeof window !== 'undefined') {
  document.addEventListener(
    'click',
    (e) => {
      if (isMutedState) return

      const target = e.target
      if (!target || !(target instanceof Element)) return

      // Look for clickable element
      const clickable = target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], [data-clickable="true"], .cursor-pointer'
      )

      if (!clickable) return

      // Opt out if marked with data-no-click-sound
      if (
        clickable.getAttribute('data-no-click-sound') === 'true' ||
        clickable.closest('[data-no-click-sound="true"]')
      ) {
        return
      }

      playClickSound()
    },
    true // Capture phase
  )
}
