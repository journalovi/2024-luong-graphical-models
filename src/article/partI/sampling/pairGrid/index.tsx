import { useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { extent } from 'd3-array'
import { select } from 'd3-selection'
import { autorun, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import Button from '@components/button'

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
	const [sampleKey, setSampleKey] = useState(0)

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
		const queryString = "g[class^='subplot']"
		const classMatch = highlightIndex
			? `subplot-${highlightIndex[0]}-${highlightIndex[1]}`
			: ''

		gridWrapRef.current?.querySelectorAll(queryString).forEach((subplot) => {
			if (!classMatch) {
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
	}, [highlightIndex, sampleKey])

	useEffect(
		() =>
			reaction(
				() => [
					...graph.nodes.map((n) => Object.values(n.hyperparameters)),
					...graph.edges.map((e) => e.coefficient),
				],
				() => {
					setSamples(graph.sample(30))
					setSampleKey(Date.now()) // update TransitionGroup key to trigger an enter animation
				},
			),
		[graph],
	)

	return (
		<Wrap className={className}>
			<Header>
				<Title>Sampled Population</Title>
				<Button
					filled
					primary
					small
					onPress={() => {
						setSamples(graph.sample(30))
						setSampleKey(Date.now()) // update TransitionGroup key to trigger an enter animation
					}}
				>
					Resample
				</Button>
			</Header>
			<GridWrap ref={gridWrapRef}>
				<TransitionGroup component={null}>
					<CSSTransition
						key={sampleKey}
						timeout={{ enter: 500, exit: 0 }}
						mountOnEnter
						appear
					>
						<SVG ref={svgRef} aria-label={title} />
					</CSSTransition>
				</TransitionGroup>
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
		transition:
			transform var(--animation-medium-out),
			opacity var(--animation-medium-out);
	}
	g[class^='y-axis'] path.domain,
	g.data rect {
		transform: scaleY(0);
		transform-box: fill-box;
		transform-origin: bottom;
		transition:
			transform var(--animation-medium-out),
			opacity var(--animation-medium-out);
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
