import { useRef, useState } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'

import Edge from '../graph/model/edge'
import Graph from '../graph/model/graph'
import Node from '../graph/model/node'
import GraphView from '../graph/view'

const createGraph = () => {
	const graph = new Graph()

	const nodeA = new Node({ label: 'A', x: -80, y: -33 })
	const nodeB = new Node({ label: 'B', x: 0, y: -33 })
	const nodeC = new Node({ label: 'C', x: -40, y: 33 })
	const nodeD = new Node({ label: 'D', x: 40, y: 33 })

	graph.addNode(nodeA)
	graph.addNode(nodeB)
	graph.addNode(nodeC)
	graph.addNode(nodeD)

	graph.addEdge(
		new Edge({
			nodes: { source: nodeA.id, target: nodeB.id },
			isDirected: false,
		}),
	)
	graph.addEdge(
		new Edge({
			nodes: { source: nodeB.id, target: nodeC.id },
			isDirected: false,
		}),
	)
	graph.addEdge(
		new Edge({
			nodes: { source: nodeC.id, target: nodeA.id },
			isDirected: false,
		}),
	)

	return graph
}

const CRFRandomFieldGraph = () => {
	const wrapRef = useRef<HTMLDivElement>(null)
	const [graph] = useState<Graph>(createGraph())

	return (
		<StyledGrid>
			<Wrap ref={wrapRef}>{graph && <StyledGraphView graph={graph} />}</Wrap>
		</StyledGrid>
	)
}

export default CRFRandomFieldGraph

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
