import { action, computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

import BaseEdge from './edge'
import BaseNode from './node'

interface GraphProps<N, E> {
	nodes?: N[]
	edges?: E[]
}

class Graph<Node extends BaseNode = BaseNode, Edge extends BaseEdge = BaseEdge> {
	readonly id = nanoid()
	nodesMap: Record<string, Node>
	edgesMap: Record<string, Edge>

	constructor(props: GraphProps<Node, Edge> = {}) {
		makeObservable(this, {
			id: observable,
			nodesMap: observable,
			edgesMap: observable,
			nodes: computed,
			edges: computed,
			addNode: action,
			addEdge: action,
		})
		this.nodesMap = props.nodes
			? Object.fromEntries(props.nodes.map((node) => [node.id, node]))
			: {}
		this.edgesMap = props.edges
			? Object.fromEntries(props.edges.map((edge) => [edge.id, edge]))
			: {}
	}

	get nodes() {
		return Object.values(this.nodesMap)
	}

	getNode(nodeId: string) {
		return this.nodesMap[nodeId]
	}

	getParentNodes(nodeId: string) {
		const incomingEdgeIds = this.getNode(nodeId).edges.incoming
		return incomingEdgeIds.map((incomingEdgeId) => {
			const incomingEdge = this.getEdge(incomingEdgeId)
			const parentNode = this.getNode(incomingEdge.nodes.source)
			return parentNode
		})
	}

	getChildNodes(nodeId: string) {
		const outgoingEdgeIds = this.getNode(nodeId).edges.outgoing
		return outgoingEdgeIds.map((outgoingEdgeId) => {
			const outgoingEdge = this.getEdge(outgoingEdgeId)
			const childNode = this.getNode(outgoingEdge.nodes.target)
			return childNode
		})
	}

	getIncomingEdges(nodeId: string) {
		const incomingEdges = this.getNode(nodeId).edges.incoming
		return incomingEdges.map((incomingEdgeId) => this.getEdge(incomingEdgeId))
	}

	getOutgoingEdges(nodeId: string) {
		const outgoingEdgeIds = this.getNode(nodeId).edges.outgoing
		return outgoingEdgeIds.map((outgoingEdgeId) => this.getEdge(outgoingEdgeId))
	}

	addNode(node: Node) {
		this.nodesMap[node.id] = node
	}

	get edges() {
		return Object.values(this.edgesMap)
	}

	getEdge(edgeId: string) {
		return this.edgesMap[edgeId]
	}

	addEdge(edge: Edge) {
		const sourceNode = this.getNode(edge.nodes.source)
		const targetNode = this.getNode(edge.nodes.target)

		if (!sourceNode) throw 'Source node not found in graph'
		if (!targetNode) throw 'Target node not found in graph'

		this.edgesMap[edge.id] = edge

		if (edge.isDirected) {
			sourceNode.addOutgoingEdge(edge.id)
			targetNode.addIncomingEdge(edge.id)
		} else {
			sourceNode.addUndirectedEdge(edge.id)
			targetNode.addUndirectedEdge(edge.id)
		}

		return edge
	}

	/**
	 * Topological sort using Kahn's algorithm. Returns a new sorted node list
	 * or a warning if the graph is cyclical. Does not mutate the graph's
	 * internal list.
	 */
	getSortedNodes() {
		const rootNodes = this.nodes.filter((n) => n.isRoot)
		const allEdges = [...this.edges]
		const removedEdges = new Set<string>()
		const sortedNodes = []

		while (rootNodes.length > 0) {
			const currentRoot = rootNodes.splice(0, 1)[0]
			sortedNodes.push(currentRoot.id)

			// Handle each of rootNode's outgoing edge
			currentRoot.edges.outgoing.forEach((edgeId) => {
				const outgoingEdge = this.getEdge(edgeId)
				const childNode = this.getNode(outgoingEdge.nodes.target)
				const edgeIndex = allEdges.findIndex((e) => e.id === outgoingEdge.id)

				// Remove edge from running list
				allEdges.splice(edgeIndex, 1)
				removedEdges.add(edgeId)

				// If childNode has no other incoming edge, add it to rootNodes to be re-processed.
				if (
					childNode.edges.incoming
						.filter((edgeId) => !removedEdges.has(edgeId))
						.map((edgeId) => this.getEdge(edgeId)).length === 0
				) {
					rootNodes.push(childNode)
				}
			})
		}

		if (allEdges.length > 0) {
			throw 'Graph cycle detected'
		}

		return sortedNodes
	}
}

export default Graph
