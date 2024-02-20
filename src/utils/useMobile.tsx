import { breakpoints } from '@theme/breakpoints'
import useMatchMedia from '@utils/useMatchMedia'

/**
 * Returns whether the screen is mobile
 */
const useMobile = (): boolean => {
  const isS = useMatchMedia(`(max-width: ${breakpoints.s})`)
  const isLandscape = useMatchMedia(`(max-height: ${breakpoints.s})`)
  return isS || isLandscape
}

export default useMobile
