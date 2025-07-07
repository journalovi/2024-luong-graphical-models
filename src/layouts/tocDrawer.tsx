import {
	HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { useHover } from '@react-aria/interactions'
import { AriaLinkOptions, useLink } from '@react-aria/link'
import { mergeProps } from '@react-aria/utils'
import styled, { css } from 'styled-components'

import Button from '@components/button'
import Popover, { usePopover } from '@components/popover'
import { REFERENCES_ID } from '@components/references'
import ScrollDivider from '@components/scrollDivider'
import ShadowRoot from '@components/shadowRoot'
import StateLayer from '@components/stateLayer'
import IconTOC from '@icons/toc'
import BackgroundNoise from '@images/background-noise.png'

import { TableOfContentsItem } from '@types'
import useBreakpoint from '@utils/useBreakpoint'

const REFERENCES_URL = `#${REFERENCES_ID}`

interface TOCDrawerProps {
	items: TableOfContentsItem[]
}

const TOCDrawer = ({ items }: TOCDrawerProps) => {
	const { open, setOpen, triggerProps, popoverProps } = usePopover({
		placement: 'bottom-end',
		offset: 4,
		resize: true,
	})

	const flatItems = useMemo<Array<{ url: string; depth: 1 | 2 }>>(
		() =>
			items
				.flatMap<{ url: string; depth: 1 | 2 }>((item) => [
					{ url: item.url, depth: 1 },
					...(item.items?.map<{ url: string; depth: 1 | 2 }>((i) => ({
						url: i.url,
						depth: 2,
					})) ?? []),
				])
				.concat([{ url: REFERENCES_URL, depth: 1 }]),
		[items],
	)

	/**
	 * URL of the item that should be marked as current within the table of contents. This
	 * is either the last heading in viewport, or, if there's no item in viewport, the
	 * closest item on top of the viewport.
	 */
	const [currentItem, setCurrentItem] = useState('')
	const itemsInViewport = useRef<Set<string>>(new Set())

	useEffect(() => {
		const ioOptions: IntersectionObserverInit = { threshold: 1 }
		// Debounced to prevent the callback from firing during smooth scrool
		const ioCallback: IntersectionObserverCallback = (entries) => {
			const newItemsInViewport = new Set(itemsInViewport.current)
			entries.forEach((entry) => {
				entry.isIntersecting
					? newItemsInViewport.add(`#${entry.target.id}`)
					: newItemsInViewport.delete(`#${entry.target.id}`)
			})

			itemsInViewport.current = newItemsInViewport

			// If there are items in the viewport, find the last one and mark it as current
			if (newItemsInViewport.size > 0) {
				const newActiveItem = [...flatItems].find(({ url }) =>
					newItemsInViewport.has(url),
				)?.url
				newActiveItem && setCurrentItem(newActiveItem)
				return
			}

			// If no item is in the viewport, then find the closest one above
			let closestElement: HTMLHeadingElement | null = null
			let closestElementTop = -Infinity

			for (const { url } of flatItems) {
				const element = document.querySelector<HTMLHeadingElement>(url)
				if (!element) return

				const elementTop = element.getBoundingClientRect().top
				if (elementTop < 0 && elementTop > closestElementTop) {
					closestElement = element
					closestElementTop = elementTop
				}
			}

			setCurrentItem(closestElement ? `#${closestElement?.id}` : '')
		}

		const observer = new IntersectionObserver(ioCallback, ioOptions)
		flatItems.forEach(({ url }) => {
			const element = document.querySelector<HTMLHeadingElement>(url)
			element && observer.observe(element)
		})

		return () => observer.disconnect()
	}, [flatItems])

	const isXS = useBreakpoint('xs')
	const scrollWrapperRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!open || isXS) return

		setTimeout(() => {
			const element = document.getElementById(`toc-item-${currentItem}`)
			if (!scrollWrapperRef.current || !element) return

			const elementOffset = element.offsetTop + element.offsetHeight
			const wrapperScrollOffset =
				scrollWrapperRef.current.offsetHeight + scrollWrapperRef.current.scrollTop

			if (elementOffset > wrapperScrollOffset) {
				element.scrollIntoView({ behavior: 'instant' })
			}
		}, 25)
	}, [isXS, open, currentItem])

	/**
	 * URL of the item that was just clicked on (within 2 seconds ago). This is a temporary
	 * value — it's meant to replace the `currentItem` state immediately after the click and
	 * while the browser scrolls to the anchor element. After 2 seconds it will turn back
	 * to an empty string and yield to `currentItem`.
	 */
	const [forceCurrentItem, setForceCurrentItem] = useState('')
	const forceCurrentItemTimeout = useRef<NodeJS.Timeout>()

	const onPress = useCallback<NonNullable<AriaLinkOptions['onPress']>>(
		(e) => {
			const url = e.target.getAttribute('href')
			if (url) {
				setForceCurrentItem(url)
				// In case two items were pressed consecutively within 1 second
				if (forceCurrentItemTimeout.current) {
					clearTimeout(forceCurrentItemTimeout.current)
				}
				forceCurrentItemTimeout.current = setTimeout(() => setForceCurrentItem(''), 2000)
			}

			if (isXS) {
				const href = e.target.getAttribute('href')
				setOpen(false)
				href && (location.hash = href)
			}
		},
		[isXS, setOpen],
	)

	const resolvedCurrentItem = forceCurrentItem || currentItem
	return (
		<TOCControlOuterWrap role="presentation">
			<TOCTriggerButton
				{...triggerProps}
				id="nav-toc-trigger"
				aria-label={'Table of Contents'}
				extraSmall
			>
				<IconTOC size="l" useAlt />
			</TOCTriggerButton>
			<TOCContainer {...popoverProps} animateScale>
				<TOCBackgroundNoise aria-hidden />
				<TOCTitle>Contents</TOCTitle>
				<TOCScrollWrapper
					ref={scrollWrapperRef}
					paddingLeft="var(--space-3)"
					paddingRight="var(--space-3)"
				>
					<TOCList aria-label="Table of Contents" tabIndex={-1}>
						{items.map((item) =>
							item.items && item.items.length > 0 ? (
								<TOCListItem key={item.url} aria-labelledby={`toc-item-${item.url}`}>
									<TOCItem
										{...item}
										id={`toc-item-${item.url}`}
										depth={1}
										current={resolvedCurrentItem === item.url}
										onPress={onPress}
									/>
									<TOCListSubitemList>
										{item.items.map((subItem) => (
											<TOCListSubitem key={subItem.url}>
												<TOCItem
													{...subItem}
													id={`toc-item-${subItem.url}`}
													depth={2}
													current={resolvedCurrentItem === subItem.url}
													onPress={onPress}
												/>
											</TOCListSubitem>
										))}
									</TOCListSubitemList>
								</TOCListItem>
							) : (
								<TOCListItem key={item.url}>
									<TOCItem
										{...item}
										id={`toc-item-${item.url}`}
										depth={1}
										current={resolvedCurrentItem === item.url}
										onPress={onPress}
									/>
								</TOCListItem>
							),
						)}

						<TOCListItem>
							<TOCItem
								depth={1}
								title="References"
								url={REFERENCES_URL}
								id={`toc-item-${REFERENCES_URL}`}
								current={resolvedCurrentItem === REFERENCES_URL}
								onPress={onPress}
							/>
						</TOCListItem>
					</TOCList>
				</TOCScrollWrapper>
			</TOCContainer>
		</TOCControlOuterWrap>
	)
}

export default TOCDrawer

interface TOCItemProps
	extends Omit<HTMLAttributes<HTMLAnchorElement>, keyof AriaLinkOptions | 'title'>,
		AriaLinkOptions,
		TableOfContentsItem {
	depth: 1 | 2
	current: boolean
}

const BaseTOCItem = ({ title, url, depth, current, ...props }: TOCItemProps) => {
	const ref = useRef<HTMLAnchorElement>(null)
	const { linkProps } = useLink(props, ref)
	const { isHovered, hoverProps } = useHover({})

	return (
		<TOCItemWrap
			ref={ref}
			{...mergeProps(linkProps, hoverProps)}
			href={url}
			depth={depth}
			aria-current={current ? 'location' : 'false'}
		>
			<StateLayer isHovered={isHovered} opacityFactor={current ? 0.75 : 1} />
			<CSSTransition in={current} timeout={{ appear: 0, enter: 250, exit: 250 }} appear>
				<TOCItemCurrentIndicator role="presentation" />
			</CSSTransition>
			<TOCItemTitle>{title}</TOCItemTitle>
		</TOCItemWrap>
	)
}

const TOCItem = memo(BaseTOCItem)

const TOCControlOuterWrap = styled(ShadowRoot)`
	contain: layout;
`

const TOCTriggerButton = styled(Button)`
	display: flex;
	gap: var(--space-0-5);
`

const TOCBackgroundNoise = styled.div`
	${(p) => p.theme.spread};
	background-image: url(${BackgroundNoise});
	background-size: 25px;
	background-repeat: repeat;
	opacity: 0.5;
`

const TOCContainer = styled(Popover)`
	display: flex;
	flex-direction: column;
	padding: 0;
	z-index: var(--z-index-toc);
	contain: content;
	transition-delay: 25ms;

	${(p) => p.theme.breakpoints.xs} {
		&.exiting {
			transition: none;
		}
	}

	background: var(--color-background);

	@supports (backdrop-filter: blur(1px)) {
		background: var(--color-background-raised-alpha-backdrop);
		backdrop-filter: saturate(200%) blur(20px);
	}
`

const TOCTitle = styled.p`
	${(p) => p.theme.text.h5}
	padding: var(--space-2) var(--space-3) var(--space-1);
`

const TOCScrollWrapper = styled(ScrollDivider)``

const TOCList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: var(--space-1-5);
	padding: var(--space-0-5) var(--space-3) var(--space-2);
`

const TOCListItem = styled.li`
	display: flex;
	flex-direction: column;
	gap: 1px;
	cursor: pointer;
`

const TOCListSubitemList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 1px;
	cursor: pointer;
`

const TOCListSubitem = styled.li``

const TOCItemWrap = styled.a<{ depth: number }>`
	display: flex;
	position: relative;
	padding: var(--space-0-5) var(--space-2) var(--space-0-5) var(--space-1);
	margin: 0 calc(var(--space-1) * -1);
	border-radius: var(--border-radius-s);
	z-index: ${(p) => (p.depth === 1 ? 2 : 1)};
	cursor: pointer;

	scroll-margin: var(--space-0-5);
	li:last-of-type > & {
		scroll-margin-bottom: var(--space-2);
	}

	white-space: nowrap;
	${(p) => p.theme.text.body2}

	&.focus-visible {
		${(p) => p.theme.focusVisible}
	}

	&:hover {
		text-decoration: none;
	}

	${(p) =>
		p.depth === 1
			? css`
					color: var(--color-heading);
					font-weight: 500;
				`
			: css`
					color: var(--color-label);
					font-weight: 400;
				`}
`

const TOCItemCurrentIndicator = styled.div`
	position: absolute;
	top: 50%;
	right: calc(100% + 3px);
	transform: translateY(-50%);
	width: 3px;
	height: 75%;
	border-radius: 3px;
	background: var(--color-active-background);

	transition: opacity var(--animation-fast-out);
	${(p) => p.theme.transitionGroupFade}
`

const TOCItemTitle = styled.span`
	display: inline-block;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;

	&.focus-visible > &,
	[aria-current='location'] > & {
		color: var(--color-active-text);
	}
`
