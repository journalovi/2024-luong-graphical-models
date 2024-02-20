import Graph from '../../../graph/model/graph'

import SamplingEdge from './edge'
import SamplingNode from './node'

class SamplingGraph extends Graph<SamplingNode, SamplingEdge> {
	sample(n = 1) {
		// We sample in order from root nodes to leaf nodes, as non-root nodes require
		// sample values from their parent(s)
		const sortedNodes = this.getSortedNodes()
		const samples: Record<string, number[]> = {}

		sortedNodes.forEach((nodeId) => {
			const node = this.getNode(nodeId)

			// If current node is a root node, then sample from its sampling distribution
			if (node.isRoot) {
				samples[nodeId] = node.sample(n)
				// If the current node has at least one parent, then its sample value is a
				// weighted sum of its parents' sample values
			} else {
				const incomingEdges = this.getIncomingEdges(nodeId)
				const parentNodes = this.getParentNodes(nodeId)

				samples[nodeId] = new Array<number>(n).fill(0).map((_, sampleIndex) => {
					const weightedParentSum = incomingEdges.reduce(
						(sum, incomingEdge, edgeIndex) => {
							const parentNode = parentNodes[edgeIndex]
							const parentNodeSample = samples[parentNode.id][sampleIndex]

							return sum + parentNodeSample * incomingEdge.coefficient
						},
						0,
					)

					node.distribution.setParameterValue('mu', weightedParentSum)
					return node.sample()[0]
				})
			}
		})

		return samples
	}
}

export default SamplingGraph
