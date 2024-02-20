import styled from 'styled-components'

interface ScorecardProps {
	label?: string
	number: string | number
	unit?: string
}

const Scorecard = ({ label, number, unit }: ScorecardProps) => {
	return (
		<Wrap>
			{label && <Label>{label}</Label>}
			<Main>
				<MainNumber>{number}</MainNumber>
				{unit && <MainUnit>{unit}</MainUnit>}
			</Main>
		</Wrap>
	)
}

export default Scorecard

const Wrap = styled.div``

const Label = styled.p`
	${(p) => p.theme.text.label};
	color: var(--color-label);
	margin-top: 0;
	margin-bottom: 0;
	contain: content;
`

const Main = styled.p``

const MainNumber = styled.span`
	${(p) => p.theme.text.h3};
	color: var(--color-heading);
	padding-right: var(--space-0);
	line-height: 1;
`

const MainUnit = styled.span`
	${(p) => p.theme.text.h5};
	color: var(--color-label);
	line-height: 0.9;
`
