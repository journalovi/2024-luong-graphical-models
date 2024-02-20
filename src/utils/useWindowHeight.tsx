// Adapted from nslocum's useWindowWidth hook:
// https://gist.github.com/nslocum/f147149a243069577a91f5e1beaa5776
import { useEffect, useState } from 'react'

import { debounce } from '@utils/functions'

const getWindowInnerHeight = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 900
  }
  return window.innerHeight
}

const useWindowHeight = (delay = 700): [number, boolean] => {
  const [height, setHeight] = useState(getWindowInnerHeight())
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    const handleResize = () => setHeight(getWindowInnerHeight())
    const debouncedResizeHandler = debounce(handleResize, delay)
    window.addEventListener('resize', debouncedResizeHandler)

    const handleResizeStart = () => setIsResizing(true)
    window.addEventListener('resize', handleResizeStart, { once: true })

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler)
      window.removeEventListener('resize', handleResizeStart)
    }
  }, [delay])

  return [height, isResizing]
}

export default useWindowHeight
