import { action, computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

interface NodeProps {
	label?: string
	edges?: {
		incoming: string[]
		outgoing: string[]
		undirected: string[]
	}
	/**
	 * Adds a forceX to the simulation. When paired with forceY, will force the
	 * node to stay in the specified position even after dragging.
	 */
	forceX?: number
	/**
	 * Adds a forceY to the simulation. When paired with forceX, will force the
	 * node to stay in the specified position even after dragging.
	 */
	forceY?: number
	/**
	 * Useful for defining starting positions. This will be overridden once the
	 * force simulation starts. To force the node to stay in the same place
	 * throughout the simulation, use forceX and forceY instead.
	 */
	x?: number
	/**
	 * Useful for defining starting positions. This will be overridden once the
	 * force simulation starts. To force the node to stay in the same place
	 * throughout the simulation, use forceX and forceY instead.
	 */
	y?: number
}

class Node {
	readonly id = nanoid()
	label: string
	edges: {
		incoming: string[]
		outgoing: string[]
		undirected: string[]
	}
	isHighlighted: boolean
	forceX?: number
	forceY?: number
	x?: number
	y?: number

	constructor(props: NodeProps) {
		makeObservable(this, {
			id: observable,
			label: observable,
			edges: observable,
			addIncomingEdge: action,
			addOutgoingEdge: action,
			addUndirectedEdge: observable,
			isRoot: computed,
			isHighlighted: observable,
			setIsHighlighted: action,
			forceX: observable,
			forceY: observable,
			setForceX: action,
			setForceY: action,
		})
		this.label = props.label ?? ''
		this.edges = { incoming: [], outgoing: [], undirected: [] }
		this.isHighlighted = false
		this.forceX = props.forceX
		this.forceY = props.forceY
		this.x = props.x
		this.y = props.y
	}

	addIncomingEdge(edge: string) {
		this.edges.incoming.push(edge)
	}

	addOutgoingEdge(edge: string) {
		this.edges.outgoing.push(edge)
	}

	addUndirectedEdge(edge: string) {
		this.edges.undirected.push(edge)
	}

	get isRoot() {
		return this.edges.incoming.length === 0
	}

	setIsHighlighted(to: boolean) {
		this.isHighlighted = to
	}

	setForceX(to: number) {
		this.forceX = to
	}

	setForceY(to: number) {
		this.forceY = to
	}
}

export default Node
