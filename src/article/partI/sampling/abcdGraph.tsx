import { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import BalancedText from '@components/balancedText'
import Divider from '@components/divider'
import Grid from '@components/grid'
import GuideArrow from '@components/guideArrow'
import Panel from '@components/panel'
import ShadowRoot from '@components/shadowRoot'

import GlobalStyles from '@layouts/globalStyles'
import { usePointerAction } from '@utils/text'
import useIsInViewport from '@utils/useIsInViewport'
import useMobile from '@utils/useMobile'

import Node from '../../graph/model/node'
import GraphView from '../../graph/view'

import SamplingEdge from './model/edge'
import SamplingGraph from './model/graph'
import SamplingNode from './model/node'
import SamplingNodePanel from './nodePanel'
import PairGrid from './pairGrid'

const createGraph = () => {
	const g = new SamplingGraph()

	const nodeA = new SamplingNode({ label: 'A', x: -60, y: -60 })
	const nodeB = new SamplingNode({ label: 'B', x: 40, y: -80 })
	const nodeC = new SamplingNode({ label: 'C', x: -10, y: 120 })
	const nodeD = new SamplingNode({ label: 'D', x: 10, y: 20 })
	g.addNode(nodeA)
	g.addNode(nodeB)
	g.addNode(nodeC)
	g.addNode(nodeD)

	g.addEdge(
		new SamplingEdge({
			nodes: { source: nodeA.id, target: nodeB.id },
			isDirected: true,
		}),
	)

	g.addEdge(
		new SamplingEdge({
			nodes: { source: nodeA.id, target: nodeD.id },
			isDirected: true,
		}),
	)
	g.addEdge(
		new SamplingEdge({
			nodes: { source: nodeB.id, target: nodeD.id },
			isDirected: true,
		}),
	)
	g.addEdge(
		new SamplingEdge({
			nodes: { source: nodeC.id, target: nodeD.id },
			isDirected: true,
		}),
	)

	return g
}

const ABCDGraph = () => {
	const [graph] = useState(() => createGraph())
	const [showGuide, setShowGuide] = useState(false)
	const [guidePosition, setGuidePosition] = useState<{ x?: number; y?: number }>({})
	const [nodeEventListeners, setNodeEventListeners] = useState<
		ComponentProps<typeof GraphView>['nodeEventListeners']
	>([])

	const pointerAction = usePointerAction(true)
	const isMobile = useMobile()

	const graphViewRef = useRef<HTMLDivElement>(null)
	const { containerRef, isInViewport } = useIsInViewport<HTMLDivElement>({
		unobserveWhenTrue: true,
	})

	useEffect(() => {
		if (!isInViewport) {
			return
		}

		setTimeout(() => {
			const nodeA = graphViewRef.current?.shadowRoot?.querySelector<SVGGElement>(
				`g#node-${graph.nodes[0].id}`,
			)
			if (!nodeA) return

			const nodeABBox = nodeA.getBBox()
			setGuidePosition({ x: nodeABBox.x + nodeABBox.width / 2, y: nodeABBox.y })
			setShowGuide(true)
			nodeA.classList.add('highlighted-guide')

			setNodeEventListeners([
				[
					'mousedown',
					() => {
						nodeA?.classList.remove('highlighted-guide')
						setShowGuide(false)
						// Remove listener
						setNodeEventListeners([])
					},
				],
				[
					'touchstart',
					() => {
						nodeA?.classList.remove('highlighted-guide')
						setShowGuide(false)
						// Remove listener
						setNodeEventListeners([])
					},
				],
			])
		}, 2000)
	}, [isInViewport, graph.nodes])

	// Keep track of which node has its node panel open
	const [openNodes, setOpenNodes] = useState<Record<Node['id'], boolean>>({})
	const openNodeIndex = useMemo(() => {
		const openNodeId = Object.keys(openNodes).find((nodeId) => openNodes[nodeId])
		const openNodeIndex = graph.nodes.findIndex((node) => node.id === openNodeId)
		if (openNodeIndex < 0) {
			return null
		}
		return openNodeIndex
	}, [graph.nodes, openNodes])

	const onNodePanelOpenChange = useCallback((node: Node, open: boolean) => {
		setOpenNodes((current) => ({ ...current, [node.id]: open }))
	}, [])
	const renderNodePanel = useCallback(
		(node: Node) => {
			return (
				<SamplingNodePanel
					// styled-components doesn't preserve generic props
					// https://github.com/styled-components/styled-components/issues/1803
					node={node as SamplingNode}
					incomingEdges={graph.getIncomingEdges(node.id)}
					parentNodes={graph.getParentNodes(node.id)}
				/>
			)
		},
		[graph],
	)

	return (
		<Grid noPaddingOnMobile>
			<StyledPanel ref={containerRef} raised size="m" gridColumn="wide">
				{isInViewport && (
					<ContentWrap>
						<GraphViewWrap ref={graphViewRef}>
							<GlobalStyles />
							<StyledGraphView
								enableSimulation
								graph={graph}
								nodeEventListeners={nodeEventListeners}
								onNodePanelOpenChange={onNodePanelOpenChange}
								renderNodePanel={renderNodePanel}
							/>
							<CSSTransition in={showGuide} timeout={500} mountOnEnter appear>
								<GuideWrap x={guidePosition.x} y={guidePosition.y} aria-hidden="true">
									<GuideArrow from="right" to="bottom" width={48} height={120} />
									<GuideText>
										<BalancedText>
											{`${pointerAction} to view & edit distribution.`}
										</BalancedText>
									</GuideText>
								</GuideWrap>
							</CSSTransition>
						</GraphViewWrap>

						<StyledDivider orientation={isMobile ? 'horizontal' : 'vertical'} />
						<StyledPairGrid
							graph={graph}
							highlightIndex={
								openNodeIndex !== null ? [openNodeIndex, openNodeIndex] : null
							}
							title="Pair grid showing pairwise relationships between variables. Each cell in the grid is a scatterplot for the corresponding variables pair. There is a correlation between variables A and B, A and D, B and D, and C and D."
						/>
					</ContentWrap>
				)}
			</StyledPanel>
		</Grid>
	)
}

export default observer(ABCDGraph)

const StyledPanel = styled(Panel)`
	margin-top: var(--adaptive-space-2);
	margin-bottom: var(--adaptive-space-4);
	padding: 0;
	height: 36rem;
	contain: layout size;

	${(p) => p.theme.breakpoints.mobile} {
		height: auto;
		contain: layout;
	}
`

const ContentWrap = styled.div`
	width: 100%;
	height: 100%;
	animation: ${(p) => p.theme.fadeIn} 0.5s forwards;

	display: flex;
	${(p) => p.theme.breakpoints.mobile} {
		flex-direction: column;
	}
`

const StyledDivider = styled(Divider)`
	margin: 0;

	${(p) => p.theme.breakpoints.mobile} {
		margin-left: var(--page-margin-left);
		margin-right: var(--page-margin-right);
	}
`

const GraphViewWrap = styled(ShadowRoot)`
	position: relative;
	height: 100%;
	width: 35%;
	flex-shrink: 0;
	z-index: 1;

	${(p) => p.theme.breakpoints.mobile} {
		width: 100%;
		height: 22rem;
		contain: layout size;
	}
`

const StyledGraphView = styled(GraphView)`
	width: 100%;
	height: 100%;
`

const GuideWrap = styled.div<{ x?: number; y?: number }>`
	display: flex;
	align-items: center;
	position: absolute;
	top: 50%;
	left: 50%;
	pointer-events: none;

	${(p) => p.theme.transitionGroupFade}
	transition: opacity var(--animation-medium-out);

	${(p) =>
		p.x &&
		p.y &&
		`
		transform: translate(calc(-24px ${p.x > 0 ? `+ ${p.x}` : `- ${-p.x}`}px), calc(-100% ${
			p.y > 0 ? `+${p.y}` : `- ${-p.y}`
		}px));
	`}
`

const StyledPairGrid = styled(PairGrid)`
	width: 100%;
	margin: var(--space-3);

	${(p) => p.theme.breakpoints.mobile} {
		width: calc(100% - var(--page-margin-left) - var(--page-margin-right));
		margin-left: var(--page-margin-left);
		margin-right: var(--page-margin-right);
		height: 28rem;
		contain: strict;
	}
`

const GuideText = styled.p`
	${(p) => p.theme.text.small}
	color: var(--color-label);
	margin-left: var(--space-0);
	width: 8rem;
`
