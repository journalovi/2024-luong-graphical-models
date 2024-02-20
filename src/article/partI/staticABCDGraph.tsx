import { useState } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'

import Edge from '../graph/model/edge'
import Graph from '../graph/model/graph'
import Node from '../graph/model/node'
import GraphView from '../graph/view'

const createGraph = () => {
	const graph = new Graph()

	const nodeA = new Node({ label: 'A', x: -40, y: -30 })
	const nodeB = new Node({ label: 'B', x: 50, y: -40 })
	const nodeC = new Node({ label: 'C', x: -50, y: 40 })
	const nodeD = new Node({ label: 'D', x: 40, y: 30 })
	graph.addNode(nodeA)
	graph.addNode(nodeB)
	graph.addNode(nodeC)
	graph.addNode(nodeD)

	graph.addEdge(
		new Edge({
			nodes: { source: nodeA.id, target: nodeB.id },
			isDirected: true,
		}),
	)
	graph.addEdge(
		new Edge({
			nodes: { source: nodeA.id, target: nodeD.id },
			isDirected: true,
		}),
	)
	graph.addEdge(
		new Edge({
			nodes: { source: nodeB.id, target: nodeD.id },
			isDirected: true,
		}),
	)
	graph.addEdge(
		new Edge({
			nodes: { source: nodeC.id, target: nodeD.id },
			isDirected: true,
		}),
	)

	return graph
}

const StaticABCDGraph = () => {
	const [graph] = useState(createGraph())

	return (
		<StyledGrid>
			<Wrap>
				<StyledGraphView graph={graph} />
			</Wrap>
		</StyledGrid>
	)
}

export default StaticABCDGraph

const StyledGrid = styled(Grid)`
	contain: strict;
	height: 8rem;
	margin-bottom: var(--adaptive-space-2);
`

const Wrap = styled.div`
	position: relative;
	height: 8rem;
	${(p) => p.theme.gridColumn.text};
`

const StyledGraphView = styled(GraphView)`
	pointer-events: none;
`
