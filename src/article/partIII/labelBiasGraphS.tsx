import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'

import Edge from '../graph/model/edge'
import Graph from '../graph/model/graph'
import Node from '../graph/model/node'
import GraphView from '../graph/view'

const createGraph = () => {
	const graph = new Graph()

	const stone = new Node({ label: 'Stone', x: 0, y: -55 })
	const creek = new Node({ label: 'Creek', x: 120, y: -55, isFaded: true })
	const s = new Node({ label: 'S', x: -120, y: -10 })
	const l1 = new Node({ label: 'LOC', x: 0, y: -10 })
	const l2 = new Node({ label: 'LOC', x: 120, y: -10, isFaded: true })
	const p1 = new Node({ label: 'PER', x: 0, y: 50 })
	const p2 = new Node({ label: 'PER', x: 120, y: 50, isFaded: true })

	graph.addNode(stone)
	graph.addNode(creek)
	graph.addNode(s)
	graph.addNode(l1)
	graph.addNode(l2)
	graph.addNode(p1)
	graph.addNode(p2)

	graph.addEdge(
		new Edge({
			nodes: { source: s.id, target: l1.id },
			isDirected: true,
			label: '0.5',
		}),
	)
	graph.addEdge(
		new Edge({
			nodes: { source: s.id, target: p1.id },
			isDirected: true,
			label: '0.5',
		}),
	)

	graph.addEdge(
		new Edge({
			nodes: { source: l1.id, target: l2.id },
			isDirected: true,
			isFaded: true,
		}),
	)
	graph.addEdge(
		new Edge({
			nodes: { source: l1.id, target: p2.id },
			isDirected: true,
			isFaded: true,
		}),
	)

	graph.addEdge(
		new Edge({
			nodes: { source: p1.id, target: l2.id },
			isDirected: true,
			isFaded: true,
		}),
	)
	graph.addEdge(
		new Edge({
			nodes: { source: p1.id, target: p2.id },
			isDirected: true,
			isFaded: true,
		}),
	)

	return graph
}

const MEMMLabelBiasGraphS = () => {
	const [graph, setGraph] = useState<Graph>()

	useEffect(() => {
		const graph = createGraph()
		setGraph(graph)
	}, [])

	return (
		<StyledGrid>
			<Wrap>{graph && <StyledGraphView graph={graph} />}</Wrap>
		</StyledGrid>
	)
}

export default MEMMLabelBiasGraphS

const StyledGrid = styled(Grid)`
	contain: strict;
	height: 9rem;
	margin-bottom: var(--adaptive-space-2);
`

const Wrap = styled.div`
	position: relative;
	height: 9rem;
	${(p) => p.theme.gridColumn.wide};
`

const StyledGraphView = styled(GraphView)`
	pointer-events: none;
`
