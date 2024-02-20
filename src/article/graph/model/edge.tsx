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
}

class Edge {
	readonly id = nanoid()
	nodes: {
		source: string
		target: string
	}
	isDirected: boolean

	constructor(props: EdgeProps) {
		makeObservable(this, {
			id: observable,
			nodes: observable,
			isDirected: observable,
		})
		this.nodes = props.nodes
		this.isDirected = props.isDirected ?? true
	}
}

export default Edge
