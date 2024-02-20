import styled from 'styled-components'

const getPosition = ({ borderWidth = 0 }) => {
	return `
		position: absolute;
		top: 50%;
		left: 50%;
		width: calc(100% + ${borderWidth * 2}px);
		height: calc(100% + ${borderWidth * 2}px);
		transform: translate(-50%, -50%);
	`
}

interface StateLayerProps {
	borderWidth?: number
	isHovered?: boolean
	isPressed?: boolean
	isExpanded?: boolean
	isCurrent?: boolean
	opacityFactor?: number
}

export default styled.div.attrs(
	({ isHovered, isPressed, isExpanded, isCurrent }: StateLayerProps) => ({
		role: 'presentation',
		['data-is-hovered']: isHovered,
		['data-is-pressed']: isPressed,
		['data-is-expanded']: isExpanded,
		['data-is-current']: isCurrent,
	}),
)<StateLayerProps>`
	${getPosition}
	z-index: 0;
	opacity: 0;
	background-color: currentcolor;
	border-radius: inherit;
	border: solid ${(p) => p.borderWidth ?? 0}px transparent;
	filter: saturate(10%);

	*:hover > &:not([data-is-hovered]),
	&&[data-is-hovered='true'] {
		opacity: calc(0.06 * var(--opacity-factor) * ${(p) => p.opacityFactor ?? 1});
	}

	*:active > &&:not([data-is-pressed], [data-is-expanded], [data-is-current]),
	*[aria-expanded='true'] > &&:not([data-is-expanded]),
	*[aria-current]:not([aria-current='false']) > &&:not([data-is-current]),
	&&&[data-is-pressed='true'],
	&&&[data-is-expanded='true'],
	&&&[data-is-current='true'] {
		opacity: calc(0.1 * var(--opacity-factor) * ${(p) => p.opacityFactor ?? 1});
	}
`
