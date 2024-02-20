import styled from 'styled-components'

import Divider from '@components/divider'
import Grid from '@components/grid'

const Footer = () => {
	return (
		<Wrap role="contentinfo" aria-label="Footer">
			<Grid aria-hidden>
				<StyledDivider />
			</Grid>
			<ContentWrap>
				<Copyright>© {new Date().getFullYear()} Vu Luong</Copyright>
			</ContentWrap>
		</Wrap>
	)
}

export default Footer

const Wrap = styled.footer`
	margin-top: var(--adaptive-space-7);
`

const StyledDivider = styled(Divider)`
	grid-column: 1 / -1;
`

const ContentWrap = styled(Grid)`
	padding-top: var(--space-2);
	padding-bottom: calc(var(--space-2) + var(--sab, 0));
	justify-items: start;
`

const Copyright = styled.p`
	grid-column-end: span 2;
	${(p) => p.theme.text.small};
	color: var(--color-label);

	${(p) => p.theme.breakpoints.xs} {
		grid-column-end: span 4;
		margin-bottom: var(--space-1);
	}
`
