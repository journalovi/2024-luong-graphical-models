import { useEffect, useRef } from 'react'

import { isDefined } from '@utils/functions'

/**
 * Executes a callback function once, when all items in deps array is defined.
 */
const useEffectOnceDefined = (callback: () => void, deps: unknown[]) => {
	const called = useRef(false)

	useEffect(() => {
		// Return if callback has already been called
		if (called.current) return

		// Return if some items in the deps array are still undefined
		if (deps.some((dep) => !isDefined(dep))) return

		callback()
		called.current = true
	}, [callback, deps])
}

export default useEffectOnceDefined
