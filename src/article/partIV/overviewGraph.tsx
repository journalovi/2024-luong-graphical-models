import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

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
		if (i > 0) {
			graph.addEdge(
				new Edge({
					nodes: { source: hiddenLayer[hiddenLayer.length - 1].id, target: state.id },
					isDirected: false,
				}),
			)
		}

		hiddenLayer.push(state)
		observedLayer.push(observation)
	}

	return graph
}

const CRFOverviewGraph = () => {
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
		<StyledGrid>
			<Wrap ref={wrapRef}>{graph && <StyledGraphView graph={graph} />}</Wrap>
		</StyledGrid>
	)
}

export default CRFOverviewGraph

const StyledGrid = styled(Grid)`
	contain: strict;
	height: 6rem;
	margin-bottom: var(--adaptive-space-2);
`

const Wrap = styled.div`
	position: relative;
	height: 6rem;
	${(p) => p.theme.gridColumn.text};
`

const StyledGraphView = styled(GraphView)`
	pointer-events: none;
`
