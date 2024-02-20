import { GatsbyImage, GatsbyImageProps, getImage } from 'gatsby-plugin-image'
import styled from 'styled-components'

import { Theme } from '@theme'

interface FigureProps extends GatsbyImageProps {
	caption?: string
	from?: string
	gridColumn?: keyof Theme['gridColumn']
	className?: string
}

const Figure = ({
	image,
	alt,
	loading = 'lazy',
	caption,
	from,
	gridColumn,
	className,
}: FigureProps) => {
	const imageData = getImage(image)

	if (!caption) {
		return (
			<ImageWrap className={className} gridColumn={gridColumn}>
				{imageData && <StyledImage image={imageData} alt={alt} loading={loading} />}
			</ImageWrap>
		)
	}

	return (
		<Wrap className={className} gridColumn={gridColumn}>
			<ImageWrap gridColumn={gridColumn}>
				{imageData && <StyledImage image={imageData} alt={alt} loading={loading} />}
			</ImageWrap>
			<Caption gridColumn={gridColumn}>
				{caption}
				{from && <From>{` ${from}.`}</From>}
			</Caption>
		</Wrap>
	)
}

export default Figure

const Wrap = styled.figure<{ gridColumn?: FigureProps['gridColumn'] }>`
	margin: 0;
	padding: 0;

	${(p) => p.gridColumn && p.theme.gridColumn[p.gridColumn]}
`

const ImageWrap = styled('div')<{ gridColumn?: FigureProps['gridColumn'] }>`
	${(p) => p.theme.flexCenter};
	position: relative;
	width: 100%;
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

	${(p) =>
		p.gridColumn === 'wide' &&
		`
			${p.theme.breakpoints.s} {
				border-radius: 0;
				border-left-width: 0;
				border-right-width: 0;
				::after {
					border-radius: 0;
					width: calc(100% + 2px);
					transform: translateX(-1px);
				}
			}
		`}
`

const StyledImage = styled(GatsbyImage)`
	width: 100%;
`

const Caption = styled.figcaption<{ gridColumn?: FigureProps['gridColumn'] }>`
	${(p) => p.theme.vizText.small};
	text-transform: uppercase;
	line-height: 1.4;
	margin-top: var(--space-1);
	max-width: 40rem;

	${(p) =>
		p.gridColumn === 'wide' &&
		`
		${p.theme.breakpoints.mobile} {
			padding-left: var(--page-margin-left);
			padding-right: var(--page-margin-right);
		}
	`}
`

const From = styled.span`
	color: var(--color-label);
`
