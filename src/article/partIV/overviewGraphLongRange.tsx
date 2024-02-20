import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import BalancedText from '@components/balancedText'
import Grid from '@components/grid'

import useSize from '@utils/useSize'

import Edge from '../graph/model/edge'
import Graph from '../graph/model/graph'
import Node from '../graph/model/node'
import GraphView from '../graph/view'

const createGraph = (nStates: number, xDelta: number) => {
	const graph = new Graph()

	const hiddenLayer = []
	const observedLayer = []

	for (let i = 0; i < nStates; i++) {
		const xPosition = (i - 1.5) * xDelta
		const subscript = String.fromCodePoint(0x2080 + i + 1)

		const state = new Node({ label: `S${subscript}`, x: xPosition, y: -30 })
		const observation = new Node({ label: `O${subscript}`, x: xPosition, y: 30 })

		graph.addNode(state)
		graph.addNode(observation)

		graph.addEdge(
			new Edge({
				nodes: { source: observation.id, target: state.id },
				isDirected: false,
			}),
		)

		for (const j of [1, 2]) {
			if (i > j - 1) {
				graph.addEdge(
					new Edge({
						nodes: { source: observedLayer[hiddenLayer.length - j].id, target: state.id },
						isDirected: false,
					}),
				)
				graph.addEdge(
					new Edge({
						nodes: {
							source: observation.id,
							target: hiddenLayer[hiddenLayer.length - j].id,
						},
						isDirected: false,
					}),
				)
			}
		}

		hiddenLayer.push(state)
		observedLayer.push(observation)
	}

	return graph
}

const CRFOverviewGraphWithLabel = () => {
	const wrapRef = useRef<HTMLDivElement>(null)
	const [graph, setGraph] = useState<Graph>()

	const { width } = useSize(wrapRef)

	useEffect(() => {
		if (!width) return

		const nStates = 4
		const xDelta = Math.min(80, width / nStates)
		const graph = createGraph(nStates, xDelta)
		setGraph(graph)
	}, [width])

	return (
		<Grid>
			<OuterWrap>
				<GraphWrap ref={wrapRef}>{graph && <StyledGraphView graph={graph} />}</GraphWrap>
				<Caption>
					<BalancedText>
						Linear-chain CRF where the hidden layer depends on the current, previous, and
						future observations.
					</BalancedText>
				</Caption>
			</OuterWrap>
		</Grid>
	)
}

export default CRFOverviewGraphWithLabel

const GraphWrap = styled.div`
	position: relative;
	height: 6rem;
	contain: strict;
`

const OuterWrap = styled.div`
	${(p) => p.theme.gridColumn.text};
	margin-bottom: var(--adaptive-space-2);
`

const Caption = styled.small`
	display: block;
	max-width: 20rem;
	margin: var(--space-1) auto 0;

	${(p) => p.theme.text.small};
	color: var(--color-label);
	text-align: center;
`

const StyledGraphView = styled(GraphView)`
	pointer-events: none;
`
