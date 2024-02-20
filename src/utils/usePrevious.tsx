import { useEffect, useRef } from 'react'

/**
 * Stores and returns the previous value of a mutable
 */
const usePrevious = <T,>(value: T) => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePrevious
