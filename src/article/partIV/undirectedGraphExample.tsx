import { ComponentProps, Fragment, useEffect, useMemo, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { runInAction } from 'mobx'
import styled from 'styled-components'

import BalancedText from '@components/balancedText'
import Divider from '@components/divider'
import Grid from '@components/grid'
import GuideArrow from '@components/guideArrow'
import Panel from '@components/panel'
import ShadowRoot from '@components/shadowRoot'

import { decimalFlex, isDefined } from '@utils/functions'
import { usePointerAction } from '@utils/text'
import useBreakpoint from '@utils/useBreakpoint'
import useMountEffect from '@utils/useMountEffect'

import Edge from '../graph/model/edge'
import Graph from '../graph/model/graph'
import Node from '../graph/model/node'
import GraphView from '../graph/view'

enum UNode {
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
	E = 'E',
	F = 'F',
}
const orderedNodes = [UNode.A, UNode.B, UNode.C, UNode.D, UNode.E, UNode.F]
const cliques = [
	[UNode.A, UNode.B, UNode.C],
	[UNode.A, UNode.B],
	[UNode.B, UNode.C],
	[UNode.A, UNode.C],
	[UNode.C, UNode.D],
	[UNode.D, UNode.E, UNode.F],
	[UNode.D, UNode.E],
	[UNode.E, UNode.F],
	[UNode.D, UNode.F],
]
const initialNodeValues: Record<UNode, 1 | 0> = {
	[UNode.A]: 1,
	[UNode.B]: 1,
	[UNode.C]: 1,
	[UNode.D]: 0,
	[UNode.E]: 0,
	[UNode.F]: 0,
}
const nodePositions: Record<UNode, { x: number; y: number }> = {
	[UNode.A]: { x: -20, y: -30 },
	[UNode.B]: { x: 0, y: -30 },
	[UNode.C]: { x: 0, y: -10 },
	[UNode.D]: { x: 0, y: 10 },
	[UNode.E]: { x: 0, y: 30 },
	[UNode.F]: { x: 20, y: 30 },
}

function createGraph() {
	const graph = new Graph()
	const nodes: Partial<Record<UNode, Node>> = {}

	for (const node in UNode) {
		const newNode = new Node({
			label: `${node} = ${initialNodeValues[node as UNode]}`,
			...nodePositions[node as UNode],
		})
		nodes[node as UNode] = newNode
		graph.addNode(newNode)
	}

	for (const nodePair of cliques.filter((n) => n.length === 2)) {
		const leftNode = nodes[nodePair[0]]
		const rightNode = nodes[nodePair[1]]
		if (!leftNode || !rightNode) continue

		const newEdge = new Edge({
			nodes: { source: leftNode.id, target: rightNode.id },
			isDirected: false,
		})
		graph.addEdge(newEdge)
	}

	return graph
}

function factor(a: 1 | 0, b: 1 | 0, c?: 1 | 0) {
	if (a === 1 && b === 1 && (isDefined(c) ? c === 1 : true)) {
		return 3
	}
	if (a === 0 && b === 0 && (isDefined(c) ? c === 0 : true)) {
		return 2
	}
	return 1
}

const z = 28915

type NodeEventListener = NonNullable<
	ComponentProps<typeof GraphView>['nodeEventListeners']
>

const CRFUndirectedGraphExample = () => {
	const [graph] = useState(createGraph())
	const [hoveredNode, setHoveredNode] = useState<UNode | null>(null)
	const [nodeValues, setNodeValues] = useState<Record<string, 1 | 0>>(initialNodeValues)
	const factorValues: Record<string, number> = useMemo(
		() => ({
			AB: factor(nodeValues.A, nodeValues.B),
			BC: factor(nodeValues.B, nodeValues.C),
			AC: factor(nodeValues.A, nodeValues.C),
			CD: factor(nodeValues.C, nodeValues.D),
			DE: factor(nodeValues.D, nodeValues.E),
			EF: factor(nodeValues.E, nodeValues.F),
			DF: factor(nodeValues.D, nodeValues.F),
			ABC: factor(nodeValues.A, nodeValues.B, nodeValues.C),
			DEF: factor(nodeValues.D, nodeValues.E, nodeValues.F),
		}),
		[nodeValues],
	)
	const factorProduct = useMemo(
		() => Object.values(factorValues).reduce((acc, cur) => acc * cur, 1),
		[factorValues],
	)

	// Update node labels when their values change
	useEffect(() => {
		graph.nodes.forEach((node) => {
			const nodeLabel = node.label.substring(0, 1)
			const newLabel = `${nodeLabel} = ${nodeValues[nodeLabel]}`
			if (node.label !== newLabel) {
				runInAction(() => {
					node.label = newLabel
				})
			}
		})
	}, [nodeValues, graph.nodes])
	const baseNodeEventListener = useMemo<NodeEventListener>(
		() => [
			[
				'click',
				(_, d) => {
					if (!d) return
					const node = d.label.substring(0, 1)
					setNodeValues((cur) => ({ ...cur, [node]: cur[node] === 1 ? 0 : 1 }))
				},
			],
			[
				'mouseenter',
				(_, d) => {
					if (!d) return
					const node = d.label.substring(0, 1)
					setHoveredNode(node as UNode)
				},
			],
			['mouseleave', () => setHoveredNode(null)],
		],
		[],
	)

	const [showGuide, setShowGuide] = useState(false)
	const [guidePosition, setGuidePosition] = useState<{ x?: number; y?: number }>({})
	const pointerAction = usePointerAction(true)
	const [nodeEventListeners, setNodeEventListeners] = useState<NodeEventListener>([
		...baseNodeEventListener,
	])

	useMountEffect(() => {
		setTimeout(() => {
			const nodeA = document.querySelector<SVGGElement>(`g#node-${graph.nodes[0].id}`)
			if (!nodeA) return

			const nodeABBox = nodeA.getBBox()
			setGuidePosition({ x: nodeABBox.x + nodeABBox.width / 2, y: nodeABBox.y })
			setShowGuide(true)
			nodeA.classList.add('highlighted-guide')

			setNodeEventListeners([
				...baseNodeEventListener,
				[
					'mousedown',
					() => {
						nodeA?.classList.remove('highlighted-guide')
						setShowGuide(false)
						// Remove listener
						setNodeEventListeners(baseNodeEventListener)
					},
				],
				[
					'touchstart',
					() => {
						nodeA?.classList.remove('highlighted-guide')
						setShowGuide(false)
						// Remove listener
						setNodeEventListeners(baseNodeEventListener)
					},
				],
			])
		}, 2000)
	})

	const isXS = useBreakpoint('xs')
	return (
		<Grid noPaddingOnMobile>
			<StyledPanel gridColumn="wide" raised>
				<InnerWrap>
					<GraphWrap>
						<GraphView
							enableSimulation
							graph={graph}
							minNodeDistance={10}
							nodeEventListeners={nodeEventListeners}
						/>
						<CSSTransition in={showGuide} timeout={500} mountOnEnter appear>
							<GuideWrap x={guidePosition.x} y={guidePosition.y} aria-hidden="true">
								<GuideArrow from="right" to="bottom" width={48} height={72} />
								<GuideText>
									<BalancedText>{`${pointerAction} to toggle value`}</BalancedText>
								</GuideText>
							</GuideWrap>
						</CSSTransition>
					</GraphWrap>
					<Divider orientation={isXS ? 'horizontal' : 'vertical'} />
					<CalculationWrap raised>
						<CalculationInnerWrap>
							<CalculationHeader>
								Calculating{' '}
								<CalculationHeaderBlock>p(A, B, C, D, E, F)</CalculationHeaderBlock>
							</CalculationHeader>
							<Calculation>
								p(
								{orderedNodes.map((node, i) => (
									<CalculationFactor
										key={node}
										siblingIsHighlighted={!!hoveredNode && hoveredNode !== node}
									>
										{nodeValues[node]}
										{i < orderedNodes.length - 1 ? ', ' : ''}
									</CalculationFactor>
								))}
								)
								<br />
								<CalculationBlock>
									<CalculationEqualSign>=</CalculationEqualSign>1/Z
									<br />
									{cliques.map((nodes) => (
										<Fragment key={nodes.join('')}>
											<CalculationFactor
												siblingIsHighlighted={
													!!hoveredNode && !nodes.includes(hoveredNode)
												}
											>
												<CalculationDot>&#10799;&nbsp;</CalculationDot>&#632;
												<sub>
													<sub>{nodes.join('')}</sub>
												</sub>
												({nodes.map((n) => nodeValues[n]).join(', ')})
											</CalculationFactor>
											<br />
										</Fragment>
									))}
								</CalculationBlock>
								<br />
								<CalculationBlock>
									<CalculationEqualSign>=</CalculationEqualSign>1 / {decimalFlex(z)}
									<br />
									{cliques.map((nodes) => (
										<Fragment key={nodes.join('')}>
											<CalculationFactor
												siblingIsHighlighted={
													!!hoveredNode && !nodes.includes(hoveredNode)
												}
											>
												<CalculationDot>&#10799;&nbsp;</CalculationDot>
												{factorValues[nodes.join('')]}
											</CalculationFactor>
											<br />
										</Fragment>
									))}
								</CalculationBlock>
								<br />
								<CalculationEqualSign>≈</CalculationEqualSign>
								<CalculationResult>{decimalFlex(factorProduct / z, 3)}</CalculationResult>
							</Calculation>
							<CalculationDescription>
								&#632;
								<sub>
									<sub>ABC</sub>
								</sub>
								&nbsp;=&nbsp;&#632;
								<sub>
									<sub>AB</sub>
								</sub>
								&nbsp;=&nbsp;&#632;
								<sub>
									<sub>…</sub>
								</sub>
								(x)&nbsp;=&nbsp;
								<CalculationDescBracket>
									3 if x<sub>1</sub> = x<sub>2</sub> = … = 1
									<br />2 if x<sub>1</sub> = x<sub>2</sub> = … = 0
									<br />1 otherwise
								</CalculationDescBracket>
							</CalculationDescription>
						</CalculationInnerWrap>
					</CalculationWrap>
				</InnerWrap>
			</StyledPanel>
		</Grid>
	)
}

export default CRFUndirectedGraphExample

const StyledPanel = styled(Panel)`
	height: 44rem;
	contain: strict;
	margin-top: var(--adaptive-space-2);
	margin-bottom: var(--adaptive-space-4);
	overflow: hidden;

	${(p) => p.theme.breakpoints.mobile} {
		padding-left: 0;
		padding-right: 0;
	}

	${(p) => p.theme.breakpoints.s} {
		height: 39rem;
	}

	${(p) => p.theme.breakpoints.xs} {
		height: 68rem;
	}
`

const InnerWrap = styled(ShadowRoot)`
	display: flex;
	width: 100%;
	height: 100%;
	${(p) => p.theme.breakpoints.xs} {
		flex-direction: column;
	}
`

const GraphWrap = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	flex-shrink: 1;
	overflow: hidden;
`

const GuideWrap = styled.div<{ x?: number; y?: number }>`
	display: flex;
	align-items: center;
	position: absolute;
	top: 50%;
	left: 50%;
	pointer-events: none;

	transition: opacity var(--animation-medium-out);
	${(p) => p.theme.transitionGroupFade}

	${(p) =>
		p.x &&
		p.y &&
		`
		transform: translate(calc(-24px ${p.x > 0 ? `+ ${p.x}` : `- ${-p.x}`}px), calc(-100% ${
			p.y > 0 ? `+${p.y}` : `- ${-p.y}`
		}px));
	`}
`

const GuideText = styled.p`
	${(p) => p.theme.text.small}
	color: var(--color-label);
	margin-left: var(--space-0);
	width: 8rem;
`

const CalculationWrap = styled(Panel)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex-shrink: 0;
	align-items: center;
	width: 24rem;
	padding: var(--space-2) var(--space-5);
	border: none;
	border-radius: 0;

	${(p) => p.theme.breakpoints.mobile} {
		padding-left: var(--page-margin-left);
		padding-right: var(--page-margin-right);
	}

	${(p) => p.theme.breakpoints.s} {
		padding: var(--space-2) var(--space-3);
		width: 20rem;
	}

	${(p) => p.theme.breakpoints.xs} {
		flex-shrink: 0;
		padding-top: var(--space-4);
		padding-bottom: var(--space-4);
		width: 100%;
		height: max-content;
	}
`

const CalculationInnerWrap = styled.div``

const CalculationHeader = styled.p`
	${(p) => p.theme.text.h5}
	margin-bottom: var(--space-1-5);
`

const CalculationDescription = styled.p`
	display: flex;
	width: 100%;
	${(p) => p.theme.text.small}
	color: var(--color-label);

	border-top: solid 1px var(--color-line);
	padding-top: var(--space-1-5);
	margin-top: var(--space-2);
`

const CalculationDescBracket = styled.span`
	display: inline-block;
	border-left: solid 2px var(--color-bar);
	padding-left: var(--space-0-5);
	margin-left: var(--space-0);
`

const CalculationHeaderBlock = styled.span`
	white-space: nowrap;
`

const Calculation = styled.p`
	font-variant-numeric: tabular-nums;
	letter-spacing: 0.025em;
	white-space: nowrap;
	color: var(--color-heading);
`

const CalculationBlock = styled.span`
	display: inline-block;
	margin-top: var(--space-1-5);
`

const CalculationEqualSign = styled.span`
	display: inline-block;
	width: 0;
	text-align: right;
	transform: translateX(calc(var(--space-1-5) * -1));
`

const CalculationDot = styled.span`
	display: inline-block;
	text-align: right;
`

const CalculationFactor = styled.span<{ siblingIsHighlighted: boolean }>`
	transition: opacity var(--animation-v-fast-out);
	${(p) => p.siblingIsHighlighted && `opacity: 0.25;`}
`

const CalculationResult = styled.span`
	${(p) => p.theme.text.h5}
	display: inline-block;
	margin-top: var(--space-1);
`
