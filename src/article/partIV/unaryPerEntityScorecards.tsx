import styled from 'styled-components'

import Grid from '@components/grid'
import Scorecard from '@components/scorecard'

const CRFUnaryPerEntityScorecards = () => {
	return (
		<Grid>
			<Wrap>
				<Scorecard label="Precision" number={77.8} unit="%" />
				<Scorecard label="Recall" number={74.9} unit="%" />
				<Scorecard label={`F\u2081 Score`} number={76.3} unit="%" />
			</Wrap>
		</Grid>
	)
}

export default CRFUnaryPerEntityScorecards

const Wrap = styled.div`
	display: flex;
	flex-wrap: wrap;
	column-gap: var(--space-4);
	row-gap: var(--space-1);
	margin-bottom: var(--adaptive-space-2);
	${(p) => p.theme.gridColumn.text};
`
