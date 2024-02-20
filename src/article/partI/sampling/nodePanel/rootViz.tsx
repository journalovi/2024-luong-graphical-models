import { useEffect, useMemo, useRef } from 'react'
import { axisBottom, axisRight } from 'd3-axis'
import { ScaleLinear, scaleLinear } from 'd3-scale'
import { select,Selection } from 'd3-selection'
import { curveBasis, line } from 'd3-shape'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import styled from 'styled-components'

import useMountEffect from '@utils/useMountEffect'

import { getValueDomain, isContinuousDistribution } from '../model/distributions/utils'
import SamplingNode from '../model/node'

interface Render {
	xAxis: Selection<SVGGElement, unknown, null, undefined>
	yAxis: Selection<SVGGElement, unknown, null, undefined>
	dataLine: Selection<SVGPathElement, number[], null, undefined>
}

interface YAxisProps {
	isContinuous: boolean
	y: ScaleLinear<number, number>
}
const renderYAxis = (yAxis: Render['yAxis'], { y }: YAxisProps) => {
	return yAxis.call(
		axisRight(y)
			.ticks(3)
			.tickSize(width - paddingRight)
			.tickPadding(8),
	)
}

interface XAxisProps {
	isContinuous: boolean
	x: ScaleLinear<number, number>
}
const renderXAxis = (xAxis: Render['xAxis'], { x, isContinuous }: XAxisProps) => {
	const axisCall = axisBottom(x).ticks(5).tickSize(0).tickPadding(8)
	const domain = x.domain()
	if (!isContinuous && domain[1] - domain[0] < 5) {
		const tickValues = new Array(domain[1] - domain[0] + 1)
			.fill(0)
			.map((_, i) => domain[0] + i)
		axisCall.tickValues(tickValues)
	}
	xAxis.call(axisCall)
	xAxis.select('path.domain').attr('d', function () {
		return `M-${paddingLeft}${select(this).attr('d').substring(2)}h${paddingRight}`
	})
	return
}

interface DataLineProps {
	isContinuous: boolean
	probabilityFn: (value: number) => number
	x: ScaleLinear<number, number>
	y: ScaleLinear<number, number>
	dotMarkerId: string
}

const renderDataLine = (
	dataLine: Render['dataLine'],
	{ isContinuous, probabilityFn, x, y, dotMarkerId }: DataLineProps,
) => {
	const lined = line<number>()
		.x((d) => x(d))
		.y((d) => y(probabilityFn(d)))
	isContinuous && lined.curve(curveBasis)

	dataLine
		.attr('d', lined)
		.classed('continuous', isContinuous)
		.classed('discrete', !isContinuous)
		.attr('marker-start', isContinuous ? 'none' : `url(#dot-marker-${dotMarkerId})`)
		.attr('marker-mid', isContinuous ? 'none' : `url(#dot-marker-${dotMarkerId})`)
		.attr('marker-end', isContinuous ? 'none' : `url(#dot-marker-${dotMarkerId})`)

	return dataLine
}

const width = 320
const height = 80
const paddingBottom = 16
const paddingLeft = 12
const paddingRight = 32
const innerHeight = height - paddingBottom
const innerWidth = width - paddingLeft - paddingRight

interface RootNodeDistributionVizProps {
	node: SamplingNode
}

const RootNodeDistributionViz = ({ node }: RootNodeDistributionVizProps) => {
	const svgRef = useRef<SVGSVGElement>(null)
	const render = useRef<Render>()

	const { distribution } = node

	const dotMarkerId = useMemo(() => nanoid(), [])

	const { x, y, probabilityFn, values } = useMemo(
		() =>
			computed(() => {
				const valueDomain = getValueDomain(distribution)

				const isContinuous = isContinuousDistribution(distribution)
				const probabilityFn = (x: number) =>
					isContinuous ? distribution.pdf(x) : distribution.pmf(x)
				const probabilityDomain = [0, probabilityFn(distribution.mode)]

				const valueIncrements = isContinuous ? (valueDomain[1] - valueDomain[0]) / 100 : 1
				const values = new Array(
					isContinuous ? 100 : Math.round(valueDomain[1] - valueDomain[0] + 1),
				)
					.fill(0)
					.map((_, i) => valueDomain[0] + i * valueIncrements)

				const x = scaleLinear().domain(valueDomain).range([0, innerWidth])
				const y = scaleLinear()
					.domain(probabilityDomain)
					.range([0, -(height - 16)])

				return { x, y, probabilityFn, values }
			}),
		[distribution],
	).get()

	useMountEffect(() => {
		if (!svgRef.current) return
		const isContinuous = isContinuousDistribution(distribution)

		const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height])
		const marker = svg
			.append('defs')
			.append('marker')
			.attr('viewBox', [0, 0, 5, 5])
			.attr('refX', 2.5)
			.attr('refY', 2.5)
			.attr('markerWidth', 5)
			.attr('markerHeight', 5)
			.attr('id', `dot-marker-${dotMarkerId}`)
		marker
			.append('circle')
			.classed('outer-dot', true)
			.attr('cx', 2.5)
			.attr('cy', 2.5)
			.attr('r', 2.5)
		marker
			.append('circle')
			.classed('inner-dot', true)
			.attr('cx', 2.5)
			.attr('cy', 2.5)
			.attr('r', 1.5)

		const xAxis = svg
			.append('g')
			.classed('axis x-axis', true)
			.attr('transform', `translate(${paddingLeft} ${innerHeight})`)
			.call(renderXAxis, { x, isContinuous })

		const yAxis = svg
			.append('g')
			.classed('axis y-axis', true)
			.attr('transform', `translate(0 ${innerHeight})`)
			.call(renderYAxis, { y, isContinuous })

		const dataLine = svg
			.append('path')
			.datum(values)
			.classed('data-line', true)
			.attr('transform', `translate(${paddingLeft} ${innerHeight})`)
			.call(renderDataLine, { isContinuous, probabilityFn, x, y, dotMarkerId })

		render.current = { xAxis, yAxis, dataLine }
	})

	// Re-render when distribution parameters change
	useEffect(() => {
		if (!render.current) return
		const { xAxis, yAxis, dataLine } = render.current
		const isContinuous = isContinuousDistribution(distribution)

		xAxis.call(renderXAxis, { x, isContinuous })
		yAxis.call(renderYAxis, { y })
		dataLine
			.datum(values)
			.call(renderDataLine, { isContinuous, probabilityFn, x, y, dotMarkerId })
	}, [distribution, x, y, probabilityFn, values, dotMarkerId])

	return (
		<Wrapper>
			<Label>
				{isContinuousDistribution(distribution)
					? 'Probability Density'
					: 'Probability Mass'}
			</Label>
			<Wrap ref={svgRef} />
		</Wrapper>
	)
}

export default observer(RootNodeDistributionViz)

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin: var(--space-2) 0;
`

const Label = styled.small`
	display: block;
	color: var(--color-label);
	margin-left: auto;
	margin-bottom: var(--space-1);
`

const Wrap = styled.svg`
	width: 100%;
	height: auto;

	g.axis text {
		${(p) => p.theme.vizText.small}
		fill: var(--color-label);
	}
	g.x-axis path {
		stroke: var(--color-line);
		stroke-width: 1.5;
		stroke-linecap: round;
	}
	g.y-axis {
		path {
			stroke: none;
		}
		line {
			stroke: var(--color-line);
		}
		.tick:first-of-type {
			display: none;
		}
	}

	path.data-line {
		fill: none;
		stroke: var(--color-body);
		stroke-width: 1.5;
		stroke-linecap: round;

		&.continuous {
			stroke-opacity: 0.75;
		}
		&.discrete {
			stroke-opacity: 0;
		}
	}

	marker {
		.inner-dot {
			fill: var(--color-body);
		}
		.outer-dot {
			fill: var(--color-background);
		}
	}
`
