import { useEffect, useRef, useState } from 'react'

export interface UseIsInViewportProps {
	/**
	 * Either a percentage of the viewport's height or the number of pixels to use as
	 * overscan. Will be used as the IntersectionObserver's rootMargin option.
	 */
	overscan?: string
	unobserveWhenTrue?: boolean
}

const useIsInViewport = <ElementType extends HTMLElement>(
	props: UseIsInViewportProps = {},
) => {
	const { overscan, unobserveWhenTrue } = props
	const containerRef = useRef<ElementType>(null)

	const [isInViewport, setIsInViewport] = useState(false)
	useEffect(() => {
		if (!containerRef.current) {
			setIsInViewport(true)
			return
		}

		const options: IntersectionObserverInit = { rootMargin: overscan ?? '50%' }
		const callback: IntersectionObserverCallback = (entries, observer) => {
			entries.forEach((entry) => {
				setIsInViewport(entry.isIntersecting)

				if (unobserveWhenTrue && entry.isIntersecting) {
					observer.unobserve(entry.target)
				}
			})
		}

		const observer = new IntersectionObserver(callback, options)
		observer.observe(containerRef.current)
	}, [overscan, unobserveWhenTrue])

	return { containerRef, isInViewport }
}

export default useIsInViewport
