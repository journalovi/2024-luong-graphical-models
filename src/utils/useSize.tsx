import { RefObject, useMemo, useState } from 'react'

import { debounce } from '@utils/functions'
import useResizeObserver from '@utils/useResizeObserver'

const useSize = (ref: RefObject<HTMLElement>) => {
	const [width, setWidth] = useState<number>()
	const [height, setHeight] = useState<number>()

	const debouncedOnResize = useMemo(() => {
		const updateSize = () => {
			if (!ref.current) return
			const bBox = ref.current.getBoundingClientRect()
			setWidth(bBox.width)
			setHeight(bBox.height)
		}
		updateSize()

		return debounce(updateSize, 100)
	}, [ref])

	useResizeObserver({ ref, onResize: debouncedOnResize })

	return { width, height }
}

export default useSize
