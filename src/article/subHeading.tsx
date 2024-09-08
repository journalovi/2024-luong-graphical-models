import { ReactNode } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'

export interface AlertProps {
	title?: string
	children?: ReactNode
}

const SubHeading = ({ children, ...props }: AlertProps) => {
	return (
		<Grid>
			<Title {...props}>{children}</Title>
		</Grid>
	)
}

export default SubHeading

const Title = styled.p`
	${(p) => p.theme.gridColumn.text}
	${(p) => p.theme.text.h5}
	font-weight: 500;
	color: var(--color-label);
	margin-bottom: var(--adaptive-space-2);
`
