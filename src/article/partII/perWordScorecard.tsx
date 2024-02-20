import styled from 'styled-components'

import Grid from '@components/grid'
import Scorecard from '@components/scorecard'

const HMMPerWordScorecards = () => {
	return (
		<Grid>
			<Wrap>
				<Scorecard label="Accuracy" number={90.1} unit="%" />
			</Wrap>
		</Grid>
	)
}

export default HMMPerWordScorecards

const Wrap = styled.div`
	display: flex;
	flex-wrap: wrap;
	column-gap: var(--space-4);
	row-gap: var(--space-1);
	margin-bottom: var(--adaptive-space-2);
	${(p) => p.theme.gridColumn.text};
`
