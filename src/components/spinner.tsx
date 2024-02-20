import { useProgressBar } from '@react-aria/progress'
import styled, { keyframes } from 'styled-components'

interface SpinnerProps {
	label: string
	showLabel?: boolean
	diameter?: number
	strokeWidth?: number
	className?: string
}

const Spinner = ({
	diameter = 24,
	strokeWidth = 2,
	label = 'Loading…',
	showLabel,
	className,
}: SpinnerProps) => {
	const { progressBarProps } = useProgressBar({
		isIndeterminate: true,
		'aria-label': label,
	})

	return (
		<Wrap className={className} {...progressBarProps}>
			<SVG viewBox={`0 0 ${diameter} ${diameter}`} width={diameter} height={diameter}>
				<Circle
					cx={diameter / 2}
					cy={diameter / 2}
					r={diameter / 2 - 1}
					diameter={diameter - 2}
					strokeWidth={strokeWidth}
					stroke="currentColor"
					fill="none"
					role="presentation"
				/>
			</SVG>
			{showLabel && <Label>{label}</Label>}
		</Wrap>
	)
}

export default Spinner

const rotate = keyframes`
	100% { transform: rotate(360deg) }
`

const dash = (diameter: number) => keyframes`
	0% {
    stroke-dasharray: 1, ${diameter * 3.75};
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: ${diameter * 2.25}, ${diameter * 3.75};
    stroke-dashoffset: ${-diameter * 0.7};
  }
  100% {
    stroke-dasharray: ${diameter * 2.25}, ${diameter * 3.75};
    stroke-dashoffset: ${-diameter * 3.14 + 2};
  }
`

const Wrap = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const SVG = styled.svg`
	animation: ${rotate} 1.8s linear infinite;
`

const Circle = styled.circle<{ diameter: number }>`
	stroke-linecap: round;
	animation: ${(p) => dash(p.diameter)} 1.5s var(--ease-in-out-quad) infinite;
`

const Label = styled.span`
	${(p) => p.theme.text.small}
	color: var(--color-label);
	margin-top: var(--space-2);
`
