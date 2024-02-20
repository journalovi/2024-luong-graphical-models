import { ReactNode } from 'react'
import styled from 'styled-components'

type IconSize = 'xs' | 's' | 'm' | 'l' | 'xl'

export interface IconProps {
	size?: IconSize
	color?: string
	className?: string
	useAlt?: boolean
}

interface SVGProps extends IconProps {
	alt: string
	children: ReactNode
}

const sizes: Record<IconSize, string> = {
	xs: '14px',
	s: '16px',
	m: '18px',
	l: '21px',
	xl: '24px',
}

const SVG = ({
	size = 'm',
	color = 'currentColor',
	className,
	alt,
	useAlt = false,
	children,
}: SVGProps) => {
	return (
		<StyledSVG
			xmlns="http://www.w3.org/2000/svg"
			width={sizes[size]}
			height={sizes[size]}
			viewBox="0 0 24 24"
			className={className}
			$color={color}
			{...(useAlt && { alt })}
		>
			{children}
		</StyledSVG>
	)
}

export default SVG

const StyledSVG = styled.svg<{ $color: string }>`
	fill: ${(p) =>
		!p.$color || p.$color === 'currentColor'
			? 'currentColor'
			: `var(--color-${p.$color})`};
	transition: color var(--animation-v-fast-out);

	path {
		transition: color var(--animation-v-fast-out);
	}
`
