import styled from 'styled-components'

import Grid from '@components/grid'
import Scorecard from '@components/scorecard'

const HMMPerEntityScorecards = () => {
	return (
		<Grid>
			<Wrap>
				<Scorecard label="Precision" number={64.2} unit="%" />
				<Scorecard label="Recall" number={55.8} unit="%" />
				<Scorecard label={`F\u2081 Score`} number={59.7} unit="%" />
			</Wrap>
		</Grid>
	)
}

export default HMMPerEntityScorecards

const Wrap = styled.div`
	display: flex;
	flex-wrap: wrap;
	column-gap: var(--space-4);
	row-gap: var(--space-1);
	margin-bottom: var(--adaptive-space-2);
	${(p) => p.theme.gridColumn.text};
`
