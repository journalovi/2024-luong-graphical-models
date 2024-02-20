import { ReactNode } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'

export interface AlertProps {
	title?: string
	children?: ReactNode
}

const Alert = ({ title, children, ...props }: AlertProps) => {
	return (
		<Grid>
			<Wrap {...props}>
				{title && <Title>{title}</Title>}
				<Content>{children}</Content>
			</Wrap>
		</Grid>
	)
}

export default Alert

const Wrap = styled.p<AlertProps>`
	${(p) => p.theme.text.small}
	${(p) => p.theme.gridColumn.text}
	column-gap: var(--space-0);

	margin-top: var(--adaptive-space-3);
	margin-bottom: var(--adaptive-space-3);
	border-top: solid 1px var(--color-line);
	border-bottom: solid 1px var(--color-line);
	padding: var(--space-1-5) 0;

	color: var(--color-label);
`

const Title = styled.span`
	font-weight: 500;
	color: var(--color-label);
	margin-bottom: var(--space-0);
`

const Content = styled.span``
