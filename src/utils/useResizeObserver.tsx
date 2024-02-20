import { RefObject, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

interface UseResizeObserverProps<T> {
  ref: RefObject<T>
  onResize: () => void
}

const useResizeObserver = <T extends HTMLElement>({
  ref,
  onResize,
}: UseResizeObserverProps<T>) => {
  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const ResizeObserverInstance = new ResizeObserver((entries) => {
      if (!entries.length) {
        return
      }
      onResize()
    })

    ResizeObserverInstance.observe(element)

    return () => element && ResizeObserverInstance.unobserve(element)
  }, [ref, onResize])
}

export default useResizeObserver
