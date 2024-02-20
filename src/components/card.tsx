import { HTMLAttributes, memo } from 'react'
import { Link } from 'gatsby'
import { GatsbyImage, GatsbyImageProps, getImage } from 'gatsby-plugin-image'
import { useHover } from '@react-aria/interactions'
import styled from 'styled-components'

import { AdaptiveGridColumns } from '@components/cardGroup'
import Grid, { gridColCounts } from '@components/grid'

import { Breakpoint, numericBreakpoints } from '@theme/breakpoints'
import { Story } from '@types'

/**
 * Returns custom value for the "sizes" image prop, based on width
 * information from gridCols
 */
const getImageSizesProp = (
	gridCols: AdaptiveGridColumns | undefined,
	rowLayout: boolean,
): string => {
	if (rowLayout) return `(max-width: ${numericBreakpoints.s}px) 100vw, 40vw`
	if (!gridCols) return '90vw'

	return (
		// Using a raw array to ensure that the breakpoint values are
		// organized from smallest to largest
		(['xs', 's', 'm', 'l', 'xl'] as Breakpoint[])
			.map((breakpoint) => {
				const gridColumns = gridCols[breakpoint]
				const maxWidth = numericBreakpoints[breakpoint]
				const slotWidth = Math.round(
					((gridColumns.end - gridColumns.start) / gridColCounts[breakpoint]) * 100,
				)

				return `(max-width: ${maxWidth}px) ${slotWidth}vw`
			})
			.join(', ') +
		// default slot width, for screens larger than the XL breakpoint
		`, ${Math.round(((gridCols.xl.end - gridCols.xl.start) / 12) * 100)}vw`
	)
}

interface CardProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'title'>, Story {
	path: string
	imageLoading?: GatsbyImageProps['loading']
	rowLayout?: boolean
	gridCols?: AdaptiveGridColumns
}

const Card = ({
	gridCols,
	path,
	title,
	description,
	cover,
	imageLoading = 'lazy',
	rowLayout = false,
	...wrapProps
}: CardProps) => {
	const { hoverProps, isHovered } = useHover({})

	const imageData = getImage(cover?.image)

	const content = (
		<StyledInnerGrid rowLayout={rowLayout}>
			{imageData && (
				<ImageWrap rowLayout={rowLayout} aria-hidden="true">
					<StyledGatsbyImage
						$colorScheme={cover.colorScheme}
						image={imageData}
						alt={cover.alt}
						sizes={getImageSizesProp(gridCols, rowLayout)}
						backgroundColor={imageData.backgroundColor}
						loading={imageLoading}
					/>
				</ImageWrap>
			)}

			<TitleWrap rowLayout={rowLayout}>
				<Title active={isHovered}>
					<DummyTitle active={isHovered} aria-hidden="true">
						{title.replace(/\s([^\s]+)$/, '\u00A0$1')}
					</DummyTitle>
					{title.replace(/\s([^\s]+)$/, '\u00A0$1')}
				</Title>
				<Description active={isHovered}>
					{description.replace(/\s([^\s]+)\s([^\s]+)$/, '\u00A0$1\u00A0$2')}
				</Description>
			</TitleWrap>
		</StyledInnerGrid>
	)

	return (
		<LinkWrap
			to={path}
			{...wrapProps}
			{...hoverProps}
			{...(rowLayout
				? { $rowLayout: true, $gridCols: undefined }
				: { $rowLayout: false, $gridCols: gridCols as AdaptiveGridColumns })}
		>
			{content}
		</LinkWrap>
	)
}

export default memo(Card)

const LinkWrap = styled(Link).withConfig({
	shouldForwardProp: (prop, defaultValidatorFn) => defaultValidatorFn(prop),
})<
	| { $rowLayout: true; $gridCols: undefined }
	| { $rowLayout: false; $gridCols: AdaptiveGridColumns }
>`
	display: block;
	position: relative;
	width: 100%;
	text-decoration: none;
	opacity: 0;
	animation: ${(p) => p.theme.fadeIn} var(--animation-medium-out) forwards;

	align-self: start;
	border-radius: var(--border-radius-m);

	&.focus-visible {
		${(p) => p.theme.focusVisible};
	}

	&:hover {
		text-decoration: none;
	}

	${(p) =>
		p.$rowLayout
			? `
			grid-column: 1 / -1;
		`
			: `
			padding-bottom: var(--space-1);
			grid-column: ${p.$gridCols.xl.start} / ${p.$gridCols.xl.end};

			${p.theme.breakpoints.l} {
				grid-column: ${p.$gridCols.l.start} / ${p.$gridCols.l.end};
			}
			${p.theme.breakpoints.m} {
				grid-column: ${p.$gridCols.m.start} / ${p.$gridCols.m.end};
			}
			${p.theme.breakpoints.s} {
				grid-column: ${p.$gridCols.s.start} / ${p.$gridCols.s.end};
			}
			${p.theme.breakpoints.xs} {
				grid-column: 1 / -1;
			}
`}
`

const StyledInnerGrid = styled(Grid)<{ rowLayout: boolean }>`
	padding: 0;
	${(p) => !p.rowLayout && `grid-template-columns: 1fr;`}
`

const ImageWrap = styled.div<{ rowLayout: boolean }>`
	${(p) => p.theme.flexCenter};
	position: relative;
	width: 100%;
	max-height: 48rem;
	overflow: hidden;
	border-radius: var(--border-radius-m);
	mask-image: radial-gradient(white, black);
	background: var(--color-background-recessed);

	::after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: var(--border-radius-m);
		box-shadow: inset 0 0 0 1px var(--color-line);
	}

	${(p) => p.rowLayout && `grid-column: 1 / 5;`}

	${(p) => p.theme.breakpoints.m} {
		max-height: 32rem;
	}
	${(p) => p.theme.breakpoints.s} {
		max-height: 24rem;
		${(p) => p.rowLayout && `grid-column: 1 / -1;`}
	}
	${(p) => p.theme.breakpoints.xs} {
		max-height: 16rem;
	}
`

const StyledGatsbyImage = styled(GatsbyImage)<{ $colorScheme: 'light' | 'dark' }>`
	width: 100%;
	transition: filter var(--animation-fast-out);

	${(p) =>
		p.$colorScheme === 'light' &&
		`
			@media (prefers-color-scheme: dark) {
				filter: brightness(95%);
			}
		`}
`

const TitleWrap = styled.div<{ rowLayout: boolean }>`
	padding-left: calc(var(--space-0) / 2);
	${(p) => (p.rowLayout ? `grid-column-end: span 4;` : `margin-top: var(--space-1-5);`)}

	${(p) => p.theme.breakpoints.s} {
		margin: var(--space-1) 0;
	}
`

const Title = styled.p<{ active: boolean }>`
	position: relative;

	${(p) => p.theme.text.h5};
	color: var(--color-heading);
	transition: color var(--animation-v-fast-out);

	${(p) => p.active && `color: var(--color-primary-link-text);`}
`

const DummyTitle = styled.span<{ active: boolean }>`
	${(p) => p.theme.spread};

	color: transparent;
	text-decoration-line: underline;
	text-decoration-color: var(--color-primary-link-underline);
	z-index: 0;
	opacity: 0;
	transition: opacity var(--animation-v-fast-out);

	${(p) => p.active && `opacity: 1;`}
`

const Description = styled.p<{ active: boolean }>`
	${(p) => p.theme.text.body2};
	line-height: ${(p) => p.theme.text.body1.lineHeight};
	margin-top: var(--space-0);

	color: var(--color-label);
	transition: color var(--animation-v-fast-out);
	${(p) => p.active && `color: var(--color-primary-link-text);`}
`
