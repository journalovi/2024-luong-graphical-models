import { Selection } from 'd3-selection'

import Edge from '../../model/edge'
import Node from '../../model/node'

export interface MutableNode {
	id: Node['id']
	label: Node['label']
	index: number
	forceX?: number
	forceY?: number
	x?: number
	y?: number
	vx?: number
	vy?: number
	fx?: number | null
	fy?: number | null
}

export interface MutableEdge {
	id: Edge['id']
	index: number
	source: MutableNode
	target: MutableNode
	isDirected: boolean
	x1?: number
	y1?: number
	x2?: number
	y2?: number
}

export type RenderedNodes = Selection<
	SVGGElement,
	MutableNode[] | undefined,
	null,
	unknown
>

export type RenderedEdges = Selection<
	SVGGElement,
	MutableEdge[] | undefined,
	null,
	unknown
>

export type NodeEventListener = Parameters<
	Selection<SVGGElement, MutableNode | undefined, null, unknown>['on']
>
