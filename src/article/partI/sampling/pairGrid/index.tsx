import { useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { extent } from 'd3-array'
import { select } from 'd3-selection'
import { autorun, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import BalancedText from '@components/balancedText'
import Button from '@components/button'

import { usePointerAction } from '@utils/text'
import useSize from '@utils/useSize'

import SamplingGraph from '../model/graph'

import { renderSVG } from './utils'

interface PairGridProps {
	graph: SamplingGraph
	title?: string
	className?: string
	/**
	 * The subplot to highlight, based on matrix index ([row index, column index]).
	 */
	highlightIndex?: [number, number] | null
}

const PairGrid = ({ graph, title, highlightIndex, className }: PairGridProps) => {
	const gridWrapRef = useRef<HTMLDivElement>(null)
	const svgRef = useRef<SVGSVGElement>(null)
	const { width, height } = useSize(gridWrapRef)
	const [samples, setSamples] = useState(() => graph.sample(30))

	const domains = useMemo(() => {
		if (!samples) return

		return Object.fromEntries(
			graph.nodes.map((node) => {
				const nodeExtent = extent(samples[node.id])
				if (!nodeExtent[0]) return [node.id, [0, 0]]
				return [node.id, nodeExtent]
			}),
		)
	}, [graph.nodes, samples])
	const subplotSizeProps = useMemo(
		() => ({
			width: width ?? 0,
			height: height ?? 0,
			numNodes: graph.nodes.length ?? 0,
		}),
		[width, height, graph.nodes.length],
	)

	useEffect(
		() =>
			autorun(() => {
				if (!svgRef.current || !samples || !width || !height) return

				const svg = select(svgRef.current)
				svg.call(renderSVG, {
					nodes: graph.nodes,
					samples,
					domains,
					...subplotSizeProps,
				})
			}),
		[width, height, domains, graph.nodes, samples, subplotSizeProps],
	)

	useEffect(() => {
		function highlightElements(queryString: string, classMatch: string) {
			if (!svgRef.current) return
			svgRef.current?.querySelectorAll(queryString).forEach((subplot) => {
				if (!highlightIndex) {
					subplot.classList.remove('highlighted')
					subplot.classList.remove('unhighlighted')
					return
				}

				if (subplot.classList.contains(classMatch)) {
					subplot.classList.remove('unhighlighted')
					subplot.classList.add('highlighted')
					return
				}
				subplot.classList.remove('highlighted')
				subplot.classList.add('unhighlighted')
			})
		}

		highlightElements(
			"g[class^='subplot']",
			highlightIndex ? `subplot-${highlightIndex[0]}-${highlightIndex[1]}` : '',
		)
	}, [highlightIndex])

	const [isStale, setIsStale] = useState(false)
	useEffect(
		() =>
			reaction(
				() => [
					...graph.nodes.map((n) => Object.entries(n.distribution.parameterValues)),
					...graph.edges.map((e) => e.coefficient),
				],
				() => setIsStale(true),
			),
		[graph],
	)
	const [sampleKey, setSampleKey] = useState(0)
	const resample = () => {
		setSamples(graph.sample(30))
		setIsStale(false)
		setSampleKey(Date.now()) // update TransitionGroup key to trigger an enter animation
	}

	const pointerAction = usePointerAction(true)

	return (
		<Wrap className={className}>
			<Header>
				<Title>Sampled Population</Title>
				<Button filled primary small onPress={resample}>
					Resample
				</Button>
			</Header>
			<GridWrap ref={gridWrapRef}>
				<TransitionGroup component={null}>
					<CSSTransition
						key={sampleKey}
						in={!isStale}
						timeout={{ enter: 500, exit: 0 }}
						mountOnEnter
						appear
					>
						<SVG ref={svgRef} aria-label={title} />
					</CSSTransition>
				</TransitionGroup>
				<CSSTransition
					in={isStale}
					timeout={{ enter: 500, exit: 0 }}
					unmountOnExit
					mountOnEnter
					appear
				>
					<EmptyWrap>
						<EmptyText>
							<BalancedText>
								{`Certain sampling parameters have changed. ${pointerAction} "Resample" to
								draw a new set of samples.`}
							</BalancedText>
						</EmptyText>
					</EmptyWrap>
				</CSSTransition>
			</GridWrap>
		</Wrap>
	)
}

export default observer(PairGrid)

const Wrap = styled.div`
	display: grid;
	grid-template-rows: max-content minmax(0, 1fr);
	gap: var(--space-2);
`

const Header = styled.div`
	flex-shrink: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: var(--space-1);
`

const Title = styled.p`
	${(p) => p.theme.text.h5}
	margin-right: var(--space-1);
`

const GridWrap = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;
`

const EmptyWrap = styled.div`
	${(p) => p.theme.spread}
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: var(--border-radius-m);

	::before {
		content: '';
		position: absolute;
		inset: -1.5rem;
		backdrop-filter: blur(0);
		transition: backdrop-filter var(--animation-fast-out);
	}

	&.enter-active::before,
	&.enter-done::before {
		backdrop-filter: blur(1.5rem);
	}
`

const EmptyText = styled.p`
	${(p) => p.theme.text.small};
	color: var(--color-label);
	margin-left: var(--page-margin-left);
	margin-right: var(--page-margin-right);
	max-width: 20rem;
	text-align: center;
	z-index: 1;
`

const SVG = styled.svg`
	${(p) => p.theme.vizText.body2};
	width: 100%;

	/*
	Axes
	*/
	g.axis {
		path.domain {
			stroke: var(--color-label);
			stroke-opacity: 0.5;
			stroke-width: 1.5;
			stroke-linecap: round;
		}

		&[class^='x-axis'] .tick line {
			transform: translateY(-3px);
		}
		&[class^='y-axis'] .tick line {
			transform: translateX(3px);
		}

		.tick {
			line {
				stroke: var(--color-label);
				stroke-opacity: 0.5;
				stroke-width: 1.5;
				stroke-linecap: round;
			}
			text {
				${(p) => p.theme.vizText.small};
				fill: var(--color-label);
			}
		}
	}

	/*
	Background
	*/
	rect.subplot-hover-background {
		fill-opacity: 0;
	}

	/*
	Data plots
	*/
	g.data circle {
		fill: var(--color-body);
	}
	g.data rect {
		fill: var(--color-bar);
	}

	g.row-label,
	g.column-label {
		text {
			fill: var(--color-label);
			transition: fill var(--animation-medium-out);
		}
		&.highlighted text {
			fill: currentcolor;
		}
	}

	g[class^='subplot'] {
		transition: opacity var(--animation-fast-out);
		&.unhighlighted {
			opacity: 0.25;
		}
	}

	/* 
	Animations 
	*/
	${(p) => p.theme.transitionGroupFade}
	transition: opacity var(--animation-medium-out);

	g[class^='x-axis'] path.domain {
		transform: scaleX(0);
		transform-box: fill-box;
		transform-origin: left;
		transition: transform var(--animation-medium-out), opacity var(--animation-medium-out);
	}
	g[class^='y-axis'] path.domain,
	g.data rect {
		transform: scaleY(0);
		transform-box: fill-box;
		transform-origin: bottom;
		transition: transform var(--animation-medium-out), opacity var(--animation-medium-out);
	}

	&.enter-active,
	&.enter-done {
		g[class^='x-axis'] path.domain {
			transform: scaleX(1);
		}
		g[class^='y-axis'] path.domain,
		g.data rect {
			transform: scaleY(1);
		}
	}
	&.exit-active {
		opacity: 0.75;

		g[class^='x-axis'] path.domain {
			transform: scaleX(1);
		}
		g[class^='y-axis'] path.domain,
		g.data rect {
			transform: scaleY(1);
		}
	}
`
