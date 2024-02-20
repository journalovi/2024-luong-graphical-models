import styled from 'styled-components'

import Grid from '@components/grid'
import Scorecard from '@components/scorecard'

const MEMMPerEntityScorecards = () => {
	return (
		<Grid>
			<Wrap>
				<Scorecard label="Precision" number={72.9} unit="%" />
				<Scorecard label="Recall" number={63.5} unit="%" />
				<Scorecard label={`F\u2081 Score`} number={67.9} unit="%" />
			</Wrap>
		</Grid>
	)
}

export default MEMMPerEntityScorecards

const Wrap = styled.div`
	display: flex;
	flex-wrap: wrap;
	column-gap: var(--space-4);
	row-gap: var(--space-1);
	margin-bottom: var(--adaptive-space-2);
	${(p) => p.theme.gridColumn.text};
`
