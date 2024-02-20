/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react'

const useMatchMedia = (query: string, defaultValue = false): boolean => {
	if (typeof window === 'undefined') return defaultValue

	const mediaQueryList = window.matchMedia(query)

	// State and setter for matched value
	const [value, setValue] = useState(mediaQueryList.matches)

	useEffect(() => {
		const handler = (): void => setValue(mediaQueryList.matches)
		mediaQueryList.addListener(handler)
		return (): void => mediaQueryList.removeListener(handler)
	}, [mediaQueryList])

	return value
}

export default useMatchMedia
