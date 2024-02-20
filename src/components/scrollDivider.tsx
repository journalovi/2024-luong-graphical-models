import {
	CSSProperties,
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react'
import styled from 'styled-components'

interface ScrollDividerProps extends HTMLAttributes<HTMLDivElement> {
	paddingLeft?: CSSProperties['left']
	paddingRight?: CSSProperties['right']
}

const BaseScrollDivider = (
	{ paddingLeft = 0, paddingRight = 0, children, ...props }: ScrollDividerProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
) => {
	const anchorRef = useRef<HTMLDivElement>(null)
	const [showDivider, setShowDivider] = useState(false)

	useEffect(() => {
		if (!anchorRef.current) return

		const callback: IntersectionObserverCallback = (entries) => {
			entries.forEach((entry) => {
				if (!(entry.target instanceof HTMLElement)) {
					return
				}
				setShowDivider(!entry.isIntersecting)
			})
		}

		const io = new IntersectionObserver(callback, { threshold: 1 })
		io.observe(anchorRef.current)
		return () => io.disconnect()
	}, [])

	return (
		<ScrollFadeWrap {...props}>
			<Divider visible={showDivider} style={{ left: paddingLeft, right: paddingRight }} />
			<ScrollFadeInnerWrap ref={forwardedRef}>
				<Anchor ref={anchorRef} data-scroll-fade-location="top" aria-hidden />
				{children}
			</ScrollFadeInnerWrap>
		</ScrollFadeWrap>
	)
}
const ScrollDivider = forwardRef(BaseScrollDivider)

export default ScrollDivider

const ScrollFadeWrap = styled.div`
	display: flex;
	position: relative;
	min-height: 0;
`

const ScrollFadeInnerWrap = styled.div<{ showDivider?: boolean }>`
	position: relative;
	overflow: auto;
`

const Divider = styled.div<{ visible: boolean }>`
	position: absolute;
	top: 0;
	height: 1px;
	background: var(--color-line);
	opacity: ${(p) => (p.visible ? 1 : 0)};
`

const Anchor = styled.div`
	position: absolute;
	top: 0;
	width: 1px;
	height: 1px;
	visibility: hidden;
`
