import { makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

interface EdgeProps {
	/**
	 * The nodes that this edge connects. If this is a directed edge, the order
	 * matters: the first listed node is the starting node, and the second the
	 * end node. Otherwise it the order does not matter.
	 */
	nodes: {
		source: string
		target: string
	}
	isDirected?: boolean
	isFaded?: boolean
	label?: string
}

class Edge {
	readonly id = nanoid()
	nodes: {
		source: string
		target: string
	}
	isDirected: boolean
	isFaded: boolean
	label?: string

	constructor(props: EdgeProps) {
		makeObservable(this, {
			id: observable,
			nodes: observable,
			isDirected: observable,
		})
		this.nodes = props.nodes
		this.isDirected = props.isDirected ?? true
		this.isFaded = props.isFaded ?? false
		this.label = props.label
	}
}

export default Edge
