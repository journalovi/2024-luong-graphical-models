import { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as tocbot from 'tocbot'

interface TOCProps {
	label: string
	contentSelector: string
	className?: string
}

const TOC = ({ label, contentSelector, className }: TOCProps) => {
	const [showUpperFade, setUpperFade] = useState(false)
	const [showLowerFade, setLowerFade] = useState(false)
	const upperCallback: IntersectionObserverCallback = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				setUpperFade(false)
			} else {
				setUpperFade(true)
			}
		})
	}
	const lowerCallback: IntersectionObserverCallback = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				setLowerFade(false)
			} else {
				setLowerFade(true)
			}
		})
	}

	useEffect(() => {
		const options = {
			root: document.querySelector(`${TocWrap}`),
			rootMargin: '0px',
			threshold: 1,
		}
		const upperObserver = new IntersectionObserver(upperCallback, options)
		const lowerObserver = new IntersectionObserver(lowerCallback, options)

		const upperTarget = document.querySelector(`${UpperIntersectionTarget}`)
		const lowerTarget = document.querySelector(`${LowerIntersectionTarget}`)
		tocbot.init({
			contentSelector,
			tocSelector: `${TocContent}`,
			scrollSmooth: false,
			headingSelector: 'h2',
		})

		upperTarget && upperObserver.observe(upperTarget)
		lowerTarget && lowerObserver.observe(lowerTarget)

		return () => {
			tocbot.destroy()
			upperTarget && upperObserver.unobserve(upperTarget)
			lowerTarget && lowerObserver.unobserve(lowerTarget)
		}
	}, [contentSelector])

	return (
		<TocWrap className={className}>
			<TocLabel>{label}</TocLabel>
			<TocInnerWrap>
				<UpperScrollFade visible={showUpperFade} />
				<TocInnerContentWrap>
					<UpperIntersectionTarget />
					<TocContent />
					<LowerIntersectionTarget />
				</TocInnerContentWrap>
				<LowerScrollFade visible={showLowerFade} />
			</TocInnerWrap>
		</TocWrap>
	)
}

export default TOC

const TocWrap = styled.div`
	box-sizing: border-box;
	height: 100vh;
`

const TocInnerWrap = styled.div`
	position: relative;
	height: 100%;
	padding-top: var(--space-2);
`

const TocInnerContentWrap = styled.div`
	position: relative;
	height: 100%;
	overflow-y: scroll;
	overscroll-behavior: contain;
	padding-right: 1rem;
`

const TocLabel = styled.p`
	${(p) => p.theme.text.label};
	color: var(--color-label);
	text-transform: uppercase;
`

const TocContent = styled.div`
	ol {
		margin-top: 0;
	}

	li {
		margin-bottom: var(--space-1);
	}

	li,
	li > a {
		color: var(--color-label);
		font-weight: 400;
	}
	li > a.is-active-link {
		font-weight: 500;
		color: var(--color-heading);
		text-decoration: none;
	}
`

const IntersectionTarget = styled.div`
	width: 100%;
	height: 1px;
	margin: 0.125rem 0;
`

const UpperIntersectionTarget = styled(IntersectionTarget)``
const LowerIntersectionTarget = styled(IntersectionTarget)``

const ScrollFade = styled.div<{ visible: boolean }>`
	position: absolute;
	width: 100%;
	height: var(--space-6);
	z-index: 1;
	pointer-events: none;
	transition: opacity var(--animation-fast-out);
	${(p) => (p.visible ? 'opacity: 1;' : 'opacity: 0;')}
`

const UpperScrollFade = styled(ScrollFade)`
	top: 0;
	background: linear-gradient(
			180deg,
			var(--color-background) 0%,
			var(--color-background-alpha-transparent) 100%
		),
		linear-gradient(
			180deg,
			var(--color-background) 0%,
			var(--color-background-alpha-transparent) 100%
		),
		linear-gradient(
			180deg,
			var(--color-background) 0%,
			var(--color-background-alpha-transparent) 100%
		);
`
const LowerScrollFade = styled(ScrollFade)`
	bottom: -1px;
	background: linear-gradient(
			0deg,
			var(--color-background) 0%,
			var(--color-background-alpha-transparent) 100%
		),
		linear-gradient(
			0deg,
			var(--color-background) 0%,
			var(--color-background-alpha-transparent) 100%
		),
		linear-gradient(
			0deg,
			var(--color-background) 0%,
			var(--color-background-alpha-transparent) 100%
		);
`
