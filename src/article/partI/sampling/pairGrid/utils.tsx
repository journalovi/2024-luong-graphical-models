import { Bin, bin, max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { format } from 'd3-format'
import { interpolateRound } from 'd3-interpolate'
import { ScaleLinear, scaleLinear } from 'd3-scale'
import { Selection } from 'd3-selection'

import SamplingNode from '../model/node'

/**
 * Inner padding for subplots, counted as distance between the origin and the
 * x-coordinate of the lowest value.
 */
const subPlotPadding = 12
/**
 * Gap between subplots in the grid
 */
const gridGap = 24
const marginLeft = 48
const marginBottom = 40

interface SubplotSizeProps {
	width: number
	height: number
	numNodes: number
}

const getSubplotSize = ({ width, height, numNodes }: SubplotSizeProps) => ({
	width: Math.round((width - marginLeft - (numNodes - 1) * gridGap) / numNodes),
	height: Math.round((height - marginBottom - (numNodes - 1) * gridGap) / numNodes),
})

const renderBackground = (
	backgroundSelection: Selection<SVGRectElement, null, SVGGElement, null>,
	{
		nodeIndex,
		crossNodeIndex,
		...subplotSizeProps
	}: SubplotSizeProps & {
		svg: Selection<SVGSVGElement, null, SVGGElement, null>
		nodeIndex: number
		crossNodeIndex: number
	},
) => {
	const isFirstColumn = nodeIndex === 0
	const isFirstRow = crossNodeIndex === 0
	const { width: subplotWidth, height: subplotHeight } = getSubplotSize(subplotSizeProps)
	const translateX = Math.round(
		(isFirstColumn ? 0 : marginLeft) +
			nodeIndex * subplotWidth +
			nodeIndex * gridGap -
			(isFirstColumn ? 0 : gridGap / 2),
	)
	const translateY = Math.round(
		crossNodeIndex * subplotHeight +
			crossNodeIndex * gridGap -
			(isFirstRow ? 0 : gridGap / 2),
	)
	const width = Math.round(
		subplotWidth +
			(isFirstColumn ? marginLeft : 0) +
			(isFirstColumn ? gridGap / 2 : gridGap),
	)
	const height = Math.round(
		subplotHeight + subPlotPadding + (isFirstRow ? gridGap / 2 : gridGap),
	)

	return backgroundSelection
		.attr('transform', `translate(${translateX} ${translateY})`)
		.attr('width', width)
		.attr('height', height)
}

const renderXAxis = (
	axisSelection: Selection<SVGGElement, null, SVGGElement, null>,
	{
		xScale,
		nodeIndex,
		crossNodeIndex,
		...subplotSizeProps
	}: SubplotSizeProps & {
		xScale: ScaleLinear<number, number>
		nodeIndex: number
		crossNodeIndex: number
	},
) => {
	const xAxis = axisBottom(xScale)
	const { numNodes } = subplotSizeProps
	const { width: subplotWidth, height: subplotHeight } = getSubplotSize(subplotSizeProps)

	const tickValues = crossNodeIndex === numNodes - 1 ? xAxis.scale().domain() : []
	const translateX = Math.round(
		marginLeft + nodeIndex * subplotWidth + nodeIndex * gridGap,
	)
	const translateY = Math.round(
		crossNodeIndex * subplotHeight + crossNodeIndex * gridGap + subplotHeight,
	)

	return axisSelection
		.attr('transform', `translate(${translateX} ${translateY})`)
		.call(
			xAxis
				.tickValues(tickValues)
				.tickFormat(format('.1f'))
				.tickPadding(4)
				.tickSizeInner(6)
				.tickSizeOuter(0),
		) // Extend domain line
		.select('path.domain')
		.attr('d', `M${-subPlotPadding / 2},0H${subplotWidth}`)
}

const renderYAxis = (
	axisSelection: Selection<SVGGElement, null, SVGGElement, null>,
	{
		yScale,
		nodeIndex,
		crossNodeIndex,
		...subplotSizeProps
	}: SubplotSizeProps & {
		yScale: ScaleLinear<number, number>
		nodeIndex: number
		crossNodeIndex: number
	},
) => {
	const yAxis = axisLeft(yScale)
	const { width: subplotWidth, height: subplotHeight } = getSubplotSize(subplotSizeProps)

	const tickValues = nodeIndex === 0 ? yAxis.scale().domain() : []
	const translateX = Math.round(
		marginLeft + nodeIndex * subplotWidth + nodeIndex * gridGap,
	)
	const translateY = Math.round(crossNodeIndex * subplotHeight + crossNodeIndex * gridGap)

	return axisSelection
		.attr('transform', `translate(${translateX} ${translateY})`)
		.call(
			yAxis
				.tickValues(tickValues)
				.tickFormat(format('.1f'))
				.tickPadding(4)
				.tickSizeInner(6)
				.tickSizeOuter(0),
		) // Extend domain line
		.select('path.domain')
		.attr('d', `M0,${subplotHeight + subPlotPadding / 2}V0`)
}

const renderRowLabel = (
	labelSelection: Selection<SVGGElement, null, SVGGElement, null>,
	{
		label,
		crossNodeIndex,
		...subplotSizeProps
	}: SubplotSizeProps & {
		label: string
		crossNodeIndex: number
	},
) => {
	const { height: subplotHeight } = getSubplotSize(subplotSizeProps)
	const translateY = Math.round(
		crossNodeIndex * subplotHeight + crossNodeIndex * gridGap + subplotHeight / 2,
	)

	return labelSelection
		.attr('transform', `translate(${subPlotPadding} ${translateY}) rotate(-90)`)
		.selectAll<SVGTextElement, null>('text')
		.data([null])
		.join((enter) => {
			enter.append('text').attr('text-anchor', 'middle').text(label)
			return enter
		})
}

const renderColumnLabel = (
	labelSelection: Selection<SVGGElement, null, SVGGElement, null>,
	{
		label,
		nodeIndex,
		...subplotSizeProps
	}: SubplotSizeProps & {
		label: string
		nodeIndex: number
	},
) => {
	const { height } = subplotSizeProps
	const { width: subPlotWidth } = getSubplotSize(subplotSizeProps)
	const translateX = Math.round(
		marginLeft + nodeIndex * subPlotWidth + nodeIndex * gridGap + subPlotWidth / 2,
	)

	return labelSelection
		.attr('transform', `translate(${translateX} ${height - 4}) `)
		.selectAll<SVGTextElement, null>('text')
		.data([null])
		.join((enter) => {
			enter.append('text').attr('text-anchor', 'middle').text(label)
			return enter
		})
}

const renderScatterPlot = (
	dataSelection: Selection<SVGGElement, null, SVGGElement, null>,
	{
		data,
		xScale,
		yScale,
		nodeIndex,
		crossNodeIndex,
		...subplotSizeProps
	}: SubplotSizeProps & {
		xScale: ScaleLinear<number, number>
		yScale: ScaleLinear<number, number>
		data: { x: number; y: number }[]
		nodeIndex: number
		crossNodeIndex: number
	},
) => {
	const { width: subplotWidth, height: subplotHeight } = getSubplotSize(subplotSizeProps)
	const translateX = Math.round(
		marginLeft + nodeIndex * subplotWidth + nodeIndex * gridGap,
	)
	const translateY = Math.round(crossNodeIndex * subplotHeight + crossNodeIndex * gridGap)

	dataSelection
		.attr('transform', `translate(${translateX} ${translateY})`)
		.selectAll('circle')
		.data(data)
		.join(
			(enter) =>
				enter
					.append('circle')
					.attr('cx', (d) => xScale(d.x))
					.attr('cy', (d) => yScale(d.y))
					.attr('r', 1.5),
			(update) => update.attr('cx', (d) => xScale(d.x)).attr('cy', (d) => yScale(d.y)),
		)
}

const renderHistogram = (
	dataSelection: Selection<SVGGElement, null, SVGGElement, null>,
	{
		bins,
		xScale,
		yScale,
		nodeIndex,
		...subplotSizeProps
	}: SubplotSizeProps & {
		xScale: ScaleLinear<number, number>
		yScale: ScaleLinear<number, number>
		bins: Bin<number, number>[]
		nodeIndex: number
		crossNodeIndex: number
	},
) => {
	const { width: subplotWidth, height: subplotHeight } = getSubplotSize(subplotSizeProps)
	const translateX = Math.round(
		marginLeft + nodeIndex * subplotWidth + nodeIndex * gridGap,
	)
	const translateY = Math.round(nodeIndex * subplotHeight + nodeIndex * gridGap)

	dataSelection
		.attr('transform', `translate(${translateX} ${translateY})`)
		.selectAll('rect')
		.data(bins)
		.join(
			(enter) =>
				enter
					.append('rect')
					.attr('x', (d) => xScale(d.x0 ?? 0))
					.attr('y', (d) => yScale(d.length) - 1)
					.attr('width', function (d) {
						return Math.abs(xScale(d.x1 ?? 0) - xScale(d.x0 ?? 0) - 1)
					})
					.attr('height', function (d) {
						return Math.abs(subplotHeight - yScale(d.length))
					}),
			(update) =>
				update
					.attr('x', (d) => xScale(d.x0 ?? 0))
					.attr('y', (d) => yScale(d.length) + 1)
					.attr('width', function (d) {
						return Math.abs(xScale(d.x1 ?? 0) - xScale(d.x0 ?? 0) - 1)
					})
					.attr('height', function (d) {
						return Math.abs(subplotHeight - yScale(d.length))
					}),
		)
	return
}

export const renderSVG = (
	svg: Selection<SVGSVGElement, unknown, null, undefined>,
	{
		samples,
		nodes,
		domains,
		...subplotSizeProps
	}: SubplotSizeProps & {
		nodes: SamplingNode[]
		samples: Record<string, number[]>
		domains: Record<string, number[]>
	},
) => {
	const { width, height } = subplotSizeProps
	const { width: subplotWidth, height: subplotHeight } = getSubplotSize(subplotSizeProps)
	svg.attr('viewBox', [0, 0, width, height])

	nodes.forEach((node, nodeIndex) => {
		const xScale = scaleLinear()
			.domain(domains[node.id])
			.range([subPlotPadding, subplotWidth - subPlotPadding])
			.interpolate(interpolateRound)

		nodes.forEach((crossNode, crossNodeIndex) => {
			const yScale = scaleLinear()
				.domain(domains[crossNode.id])
				.range([subplotHeight - subPlotPadding, subPlotPadding])
				.interpolate(interpolateRound)

			const subplot = svg
				.selectAll<SVGGElement, null>(`.subplot-${nodeIndex}-${crossNodeIndex}`)
				.data([null])
				.join((enter) =>
					enter.append('g').classed(`subplot-${nodeIndex}-${crossNodeIndex}`, true),
				)
				.on('mouseenter', function () {
					node.setIsHighlighted(true)
					crossNode.setIsHighlighted(true)

					svg
						.select(`.subplot-0-${crossNodeIndex} .row-label`)
						.classed('highlighted', true)
					svg
						.select(`.subplot-${nodeIndex}-${nodes.length - 1} .column-label`)
						.classed('highlighted', true)
				})
				.on('mouseleave', function () {
					node.setIsHighlighted(false)
					crossNode.setIsHighlighted(false)

					svg
						.select(`.subplot-0-${crossNodeIndex} .row-label`)
						.classed('highlighted', false)
					svg
						.select(`.subplot-${nodeIndex}-${nodes.length - 1} .column-label`)
						.classed('highlighted', false)
				})

			// Subplot background, used to supplement subplot's hoverable area.
			subplot
				.selectAll<SVGRectElement, null>('.subplot-hover-background')
				.data([null])
				.join((enter) => enter.append('rect').classed('subplot-hover-background', true))
				.call(renderBackground, {
					svg,
					nodeIndex,
					crossNodeIndex,
					...subplotSizeProps,
				})

			// X-axes
			subplot
				.selectAll<SVGGElement, null>('.x-axis')
				.data([null])
				.join((enter) => enter.append('g').classed('axis x-axis', true))
				.call(renderXAxis, {
					xScale,
					nodeIndex,
					crossNodeIndex,
					...subplotSizeProps,
				})

			// Y-axes
			subplot
				.selectAll<SVGGElement, null>('.y-axis')
				.data([null])
				.join((enter) => enter.append('g').classed('axis y-axis', true))
				.call(renderYAxis, {
					yScale,
					nodeIndex,
					crossNodeIndex,
					...subplotSizeProps,
				})

			// Row labels
			if (nodeIndex === 0) {
				subplot
					.selectAll<SVGGElement, null>('.row-label')
					.data([null])
					.join((enter) => enter.append('g').classed('row-label', true))
					.call(renderRowLabel, {
						label: crossNode.label,
						crossNodeIndex,
						...subplotSizeProps,
					})
			}

			// Column labels
			if (crossNodeIndex === nodes.length - 1) {
				subplot
					.selectAll<SVGGElement, null>('.column-label')
					.data([null])
					.join((enter) => enter.append('g').classed('column-label', true))
					.call(renderColumnLabel, {
						label: node.label,
						nodeIndex,
						...subplotSizeProps,
					})
			}

			// Draw scatter plots. We'll draw histograms for diagonal subplots below
			if (nodeIndex !== crossNodeIndex) {
				const data = samples[node.id].map((x, i) => ({ x, y: samples[crossNode.id][i] }))
				subplot
					.selectAll<SVGGElement, null>('.data')
					.data([null])
					.join((enter) => enter.append('g').classed('data', true))
					.call(renderScatterPlot, {
						data,
						nodeIndex,
						crossNodeIndex,
						xScale,
						yScale,
						...subplotSizeProps,
					})
			}
		})
	})

	// Draw histograms for subplots on the diagonal line
	const nBins = Math.max(5, Math.round(subplotWidth / 12))
	const allBins = Object.fromEntries(
		nodes.map((node) => {
			const domain = domains[node.id]
			const step = (domain[1] - domain[0]) / nBins
			const thresholds = new Array(nBins + 1).fill(0).map((_, i) => domain[0] + i * step)
			const bins = bin().thresholds(thresholds)(samples[node.id])

			return [node.id, bins]
		}),
	)

	// Normalize all histograms by using the same yScale for all of them
	const maxHistCount =
		max(Object.values(allBins).map((bins) => max(bins.map((b) => b.length)) ?? 0)) ?? 0
	const histYScale = scaleLinear()
		.range([subplotHeight - subPlotPadding, subPlotPadding])
		.domain([0, maxHistCount])

	nodes.forEach((node, nodeIndex) => {
		const xScale = scaleLinear()
			.domain(domains[node.id])
			.range([subPlotPadding, subplotWidth - subPlotPadding])

		svg
			.select<SVGGElement>(`.subplot-${nodeIndex}-${nodeIndex}`)
			.selectAll<SVGGElement, null>('.data')
			.data([null])
			.join((enter) => enter.append('g').classed('data', true))
			.call(renderHistogram, {
				bins: allBins[node.id],
				nodeIndex,
				xScale,
				yScale: histYScale,
				...subplotSizeProps,
			})
	})
}
