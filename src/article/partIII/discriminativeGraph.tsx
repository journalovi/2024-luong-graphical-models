import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'

import useSize from '@utils/useSize'

import Edge from '../graph/model/edge'
import Graph from '../graph/model/graph'
import Node from '../graph/model/node'
import GraphView from '../graph/view'

const S = ['O', 'O', 'O', 'B-PER', 'I-PER', 'O']
const O = ['Stately', ',', 'plump', 'Buck', 'Mulligan', 'came']

const createGraph = (shortForm: boolean, xDelta: number) => {
	const graph = new Graph()

	const hiddenLayer = []
	const observedLayer = []

	const SLength = shortForm ? 4 : S.length
	const SStart = shortForm ? 2 : 0

	for (let i = SStart; i < SStart + SLength; i++) {
		const xPosition = (i - SStart - (SLength - 1) / 2) * xDelta

		const s = new Node({ label: S[i], x: xPosition, y: -30 })
		const o = new Node({ label: O[i], x: xPosition, y: 30 })

		graph.addNode(s)
		graph.addNode(o)

		graph.addEdge(
			new Edge({
				nodes: { source: o.id, target: s.id },
				isDirected: true,
			}),
		)
		if (hiddenLayer.length > 0) {
			graph.addEdge(
				new Edge({
					nodes: { source: hiddenLayer[hiddenLayer.length - 1].id, target: s.id },
					isDirected: true,
				}),
			)
		}

		hiddenLayer.push(s)
		observedLayer.push(o)
	}

	return graph
}

const HMMNERGraph = () => {
	const wrapRef = useRef<HTMLDivElement>(null)
	const [graph, setGraph] = useState<Graph>()

	const { width } = useSize(wrapRef)

	useEffect(() => {
		if (!width) return

		const nStates = 4
		const shortForm = width / nStates < 160
		const xDelta = Math.min(80, width / nStates + 10)
		const graph = createGraph(shortForm, xDelta)
		setGraph(graph)
	}, [width])

	return (
		<StyledGrid>
			<Wrap ref={wrapRef}>{graph && <StyledGraphView graph={graph} />}</Wrap>
		</StyledGrid>
	)
}

export default HMMNERGraph

const StyledGrid = styled(Grid)`
	contain: strict;
	height: 7rem;
	margin-bottom: var(--adaptive-space-2);
`

const Wrap = styled.div`
	position: relative;
	height: 7rem;
	${(p) => p.theme.gridColumn.wide};
`

const StyledGraphView = styled(GraphView)`
	pointer-events: none;
`
