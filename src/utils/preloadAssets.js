import { preloadAllSounds } from './soundEffects'

const imageModules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
})

export function preloadAllAssets(onProgress) {
  preloadAllSounds()
  const srcs = Object.values(imageModules)
  const total = srcs.length + 1 // +1 for fonts
  let loaded = 0

  const tick = () => {
    loaded++
    if (typeof onProgress === 'function') {
      const pct = Math.min(100, Math.round((loaded / total) * 100))
      onProgress(pct)
    }
  }

  const imagePromises = srcs.map((src) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img
        .decode()
        .catch(() => {})
        .finally(() => {
          tick()
          resolve()
        })
    })
  })

  const fontPromise = (document.fonts?.ready || Promise.resolve())
    .then(tick)
    .catch(tick)

  return Promise.all([...imagePromises, fontPromise])
}

export default preloadAllAssets
