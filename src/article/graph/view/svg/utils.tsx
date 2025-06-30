import { D3DragEvent, drag } from 'd3-drag'
import { Simulation } from 'd3-force'
import intersect from 'path-intersection'

import { isDefined } from '@utils/functions'

import Edge from '../../model/edge'
import Node from '../../model/node'

import {
	MutableEdge,
	MutableNode,
	NodeEventListener,
	RenderedEdges,
	RenderedNodes,
} from './types'

export function mapMutableNodes(node: Node, index: number): MutableNode {
	return {
		index,
		id: node.id,
		label: node.label,
		isFaded: node.isFaded,
		x: node.x,
		y: node.y,
		forceX: node.forceX,
		forceY: node.forceY,
	}
}

export function mapMutableEdges(
	edge: Edge,
	index: number,
	mutableNodes: MutableNode[],
): MutableEdge {
	return {
		index,
		id: edge.id,
		source: mutableNodes.find((n) => n.id === edge.nodes.source) as MutableNode,
		target: mutableNodes.find((n) => n.id === edge.nodes.target) as MutableNode,
		isDirected: edge.isDirected,
		isFaded: edge.isFaded,
		label: edge.label,
	}
}

function getNodeBoxWidth(node: MutableNode) {
	return node.label.length * 9 + 20
}
function getNodeBoxHeight() {
	return 24
}

export function renderSVGNodes(
	renderedNodes: RenderedNodes,
	data: MutableNode[],
	eventListeners?: NodeEventListener[],
) {
	renderedNodes
		.selectAll('g')
		.data<MutableNode>(data, (n) => (n as MutableNode).id)
		.join(
			(enter) => {
				const g = enter
					.append('g')
					.classed('node-wrap', true)
					.classed('faded', (d) => d.isFaded)
					.attr('id', (d) => `node-${d.id}`)

				const rect = g
					.append('rect')
					.classed('node-box', true)
					.attr('width', getNodeBoxWidth)
					.attr('height', getNodeBoxHeight)
					.attr('x', (d) => -getNodeBoxWidth(d) / 2)
					.attr('y', -getNodeBoxHeight() / 2)
					.attr('rx', getNodeBoxHeight() / 2)
					.attr('transform', (d) => `translate(${d.x ?? 0} ${d.y ?? 0})`)

				eventListeners?.forEach((listener) => rect.on(...listener))

				g.append('text')
					.text((d) => d.label)
					.attr('text-anchor', 'middle')
					.attr('dominant-baseline', 'central')
					.attr('aria-haspopup', true)
					.attr('aria-expanded', false)
					.attr('transform', (d) => `translate(${d.x ?? 0} ${d.y ?? 0})`)

				return g
			},
			(update) => {
				const rect = update
					.select<SVGRectElement>('rect')
					.attr('width', getNodeBoxWidth)
					.attr('height', getNodeBoxHeight)
					.attr('x', (d) => -getNodeBoxWidth(d) / 2)
					.attr('y', -getNodeBoxHeight() / 2)
					.attr('rx', getNodeBoxHeight() / 2)

				rect.on('.', null)
				eventListeners?.forEach((listener) => rect.on(...listener))

				update.select('text').text((d) => d.label)

				return update
			},
		)
}

function getEdgeBoxWidth(edge: MutableEdge) {
	if (!edge.label) {
		return 0
	}
	return edge.label.length * 9 + 8
}
function getEdgeBoxHeight() {
	return 18
}

export function renderSVGEdges(
	renderedEdges: RenderedEdges,
	data: MutableEdge[],
	arrowMarkerId: string,
) {
	renderedEdges
		.selectAll('g')
		.data<MutableEdge>(data, (e) => (e as MutableEdge).id)
		.join((enter) => {
			const group = enter
				.append('g')
				.datum<MutableEdge>((edge: MutableEdge) => getUpdatedMutableEdge(edge))
				.classed('edge-wrap', true)
				.classed('faded', (d) => d.isFaded)

			group
				.append('line')
				.attr('marker-end', (edge: MutableEdge) =>
					edge.isDirected ? `url(#arrow-marker-${arrowMarkerId})` : null,
				)
				.attr('x1', (d: MutableEdge) => d.x1 ?? null)
				.attr('y1', (d: MutableEdge) => d.y1 ?? null)
				.attr('x2', (d: MutableEdge) => d.x2 ?? null)
				.attr('y2', (d: MutableEdge) => d.y2 ?? null)

			group
				.append('rect')
				.attr(
					'x',
					(d: MutableEdge) => ((d.x2 ?? 0) + (d.x1 ?? 0)) / 2 - getEdgeBoxWidth(d) / 2,
				)
				.attr(
					'y',
					(d: MutableEdge) => ((d.y2 ?? 0) + (d.y1 ?? 0)) / 2 - getEdgeBoxHeight() / 2,
				)
				.attr('width', getEdgeBoxWidth)
				.attr('height', getEdgeBoxHeight)
				.classed('edge-label-box', true)

			group
				.append('text')
				.text((d: MutableEdge) => d.label ?? '')
				.attr('dominant-baseline', 'middle')
				.attr('text-anchor', 'middle')
				.attr('x', (d: MutableEdge) => ((d.x2 ?? 0) + (d.x1 ?? 0)) / 2)
				.attr('y', (d: MutableEdge) => ((d.y2 ?? 0) + (d.y1 ?? 0)) / 2 + 1)
				.classed('edge-label', true)
		})
}

export function getNodeBoundary(node: MutableNode) {
	const { x, y } = node
	const w = getNodeBoxWidth(node) / 2 + 1
	const h = getNodeBoxHeight() / 2 + 1

	if (!isDefined(x) || !isDefined(y)) return null

	return [
		`M ${x},${y - h}`,
		`H ${x + w - h}`,
		`Q ${x + w}, ${y - h}, ${x + w}, ${y}`,
		`Q ${x + w}, ${y + h}, ${x + w - h}, ${y + h}`,
		`H ${x - w + h}`,
		`Q ${x - w}, ${y + h}, ${x - w}, ${y}`,
		`Q ${x - w}, ${y - h}, ${x - w + h}, ${y - h}`,
		'z',
	].join(' ')
}

function getUpdatedMutableEdge(edge: MutableEdge) {
	const { source, target } = edge

	if (
		!isDefined(source.x) ||
		!isDefined(source.y) ||
		!isDefined(target.x) ||
		!isDefined(target.y)
	) {
		return edge
	}

	const edgePath = `M ${source.x}, ${source.y} L ${target.x} ${target.y}`

	const sourceNodeBoundary = getNodeBoundary(source)
	const targetNodeBoundary = getNodeBoundary(target)

	if (!sourceNodeBoundary || !targetNodeBoundary) return edge

	const sourceIntersect = intersect(sourceNodeBoundary, edgePath)[0]
	const targetIntersect = intersect(targetNodeBoundary, edgePath)[0]

	if (!sourceIntersect || !targetIntersect) return edge

	return {
		...edge,
		x1: sourceIntersect.x,
		y1: sourceIntersect.y,
		x2: targetIntersect.x,
		y2: targetIntersect.y,
	}
}

export function ticked(renderedNodes: RenderedNodes, renderedEdges: RenderedEdges) {
	return () => {
		renderedEdges
			.selectAll('g')
			.datum<MutableEdge>((edge) => getUpdatedMutableEdge(edge as MutableEdge))
			.select('line')
			.attr('x1', (d) => d.x1 ?? null)
			.attr('y1', (d) => d.y1 ?? null)
			.attr('x2', (d) => d.x2 ?? null)
			.attr('y2', (d) => d.y2 ?? null)

		renderedNodes.selectAll('text').attr('transform', (d) => {
			const { x, y } = d as MutableNode
			return isDefined(x) && isDefined(y) ? `translate(${x} ${y})` : null
		})
		renderedNodes.selectAll('rect').attr('transform', (d) => {
			const { x, y } = d as MutableNode
			return isDefined(x) && isDefined(y) ? `translate(${x} ${y})` : null
		})
	}
}

export function dragCallback(simulation: Simulation<MutableNode, MutableEdge>) {
	// Debounce dragStarted, to prevent the graph from jiggling when the user clicks but
	// doesn't drag.
	let timeout: NodeJS.Timeout
	function dragstarted(event: D3DragEvent<SVGTextElement, MutableNode, MutableNode>) {
		timeout = setTimeout(() => {
			if (!event.active) simulation.alphaTarget(0.3).restart()
			event.subject.fx = event.subject.x
			event.subject.fy = event.subject.y
		}, 100)
	}

	function dragged(event: D3DragEvent<SVGTextElement, MutableNode, MutableNode>) {
		event.subject.fx = event.x
		event.subject.fy = event.y
	}

	function dragended(event: D3DragEvent<SVGTextElement, MutableNode, MutableNode>) {
		clearTimeout(timeout)
		if (!event.active) simulation.alphaTarget(0)
		event.subject.fx = null
		event.subject.fy = null
	}

	return drag<SVGTextElement, MutableNode>()
		.on('start', dragstarted)
		.on('drag', dragged)
		.on('end', dragended)
}
