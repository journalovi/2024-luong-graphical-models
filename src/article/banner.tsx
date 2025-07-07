import { ReactNode } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'

const Banner = ({ children }: { children: ReactNode }) => {
	return (
		<Grid>
			<Wrap>{children}</Wrap>
		</Grid>
	)
}

export default Banner

const Wrap = styled.p`
	position: relative;
	${(p) => p.theme.text.body2}
	${(p) => p.theme.gridColumn.text}
	column-gap: var(--space-0);

	margin-top: var(--adaptive-space-2);
	margin-bottom: var(--adaptive-space-3);

	&::before {
		content: '';
		position: absolute;
		top: calc(var(--adaptive-space-1-5) * -1);
		bottom: calc(var(--adaptive-space-1-5) * -1);
		left: calc(var(--adaptive-space-2) * -1);
		right: calc(var(--adaptive-space-2) * -1);
		background: var(--color-background-raised);
		border: solid 1px var(--color-line);
		border-radius: var(--border-radius-m);
		z-index: -1;
	}

	color: var(--color-text);

	a {
		font-size: 1em;
		color: currentcolor;
		text-decoration-line: underline;
		text-decoration-color: var(--color-link-underline);
	}
	a:hover {
		text-decoration-color: var(--color-link-underline-hover);
	}
`
