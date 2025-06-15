import styled from 'styled-components'

import Grid from '@components/grid'
import Panel from '@components/panel'
import { Table, TableBody, TableHead, TD, TH, TR } from '@components/table'

const wordShapeExamples: Array<[string, number]> = [
	['Stately', 0],
	[',', 0],
	['plump', 0],
	['Buck', 1],
	['Mulligan', 0],
	['came', 0],
]

const MEMMWordShapeExamples = () => {
	return (
		<Grid noPaddingOnMobile>
			<Wrap raised size="m" gridColumn="wide">
				<TableWrap>
					<StyledTable>
						<colgroup>
							<col />
							<col />
							<col />
						</colgroup>
						<TableHead>
							<TR>
								<TH scope="col">
									o<sub>t</sub>
								</TH>
								<TH scope="col" align="right">
									b<sub>shape=Xxxx</sub>(o<sub>t</sub>)
								</TH>
							</TR>
						</TableHead>
						<TableBody>
							{wordShapeExamples.map(([observation, featureValue]) => (
								<TR key={observation}>
									<TD>{observation}</TD>
									<TD align="right">{featureValue}</TD>
								</TR>
							))}
						</TableBody>
					</StyledTable>
				</TableWrap>
			</Wrap>
		</Grid>
	)
}

export default MEMMWordShapeExamples

const Wrap = styled(Panel)`
	${(p) => p.theme.gridColumn.text};
	margin-top: var(--adaptive-space-2);
	margin-bottom: var(--adaptive-space-4);
	overflow: auto;
`

const TableWrap = styled.div`
	overflow: auto;

	padding-bottom: var(--space-2);
	padding-left: var(--space-2);
	margin-left: calc(var(--space-2) * -1);
	margin-right: calc(var(--space-2) * -1);
`

const StyledTable = styled(Table)`
	/* Pseudo right padding when container is scrolling */
	border-right: solid 16px transparent;

	tbody {
		${(p) => p.theme.vizText.body2}
	}

	colgroup {
		col:nth-child(1) {
			width: calc(100% - 20em);
		}
		col:nth-child(2) {
			width: 10em;
		}
	}

	${(p) => p.theme.breakpoints.mobile} {
		colgroup {
			col:nth-child(1) {
				width: calc(100% - 12em);
			}
			col:nth-child(2) {
				width: 6em;
			}
		}
	}
`
