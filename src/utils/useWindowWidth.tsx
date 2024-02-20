// Adapted from nslocum's useWindowWidth hook:
// https://gist.github.com/nslocum/f147149a243069577a91f5e1beaa5776
import { useEffect, useState } from 'react'

import { debounce } from '@utils/functions'

const getWindowInnerWidth = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 1400
  }
  return window.innerWidth
}

const useWindowWidth = (delay = 700): [number, boolean] => {
  const [width, setWidth] = useState(getWindowInnerWidth())
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setWidth(getWindowInnerWidth())

      setIsResizing(false)
      window.addEventListener('resize', handleResizeStart, { once: true })
    }
    const debouncedResizeHandler = debounce(handleResize, delay)
    window.addEventListener('resize', debouncedResizeHandler)

    const handleResizeStart = () => setIsResizing(true)
    window.addEventListener('resize', handleResizeStart, { once: true })
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler)
      window.removeEventListener('resize', handleResizeStart)
    }
  }, [delay])

  return [width, isResizing]
}

export default useWindowWidth
