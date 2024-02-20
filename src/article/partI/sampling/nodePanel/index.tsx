import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import SamplingEdge from '../model/edge'
import SamplingNode from '../model/node'

import ChildNode from './child'
import RootNode from './root'

interface SamplingNodePanelProps {
	node: SamplingNode
	incomingEdges: SamplingEdge[]
	parentNodes: SamplingNode[]
}

const SamplingNodePanel = ({
	node,
	incomingEdges,
	parentNodes,
}: SamplingNodePanelProps) => {
	return (
		<Wrap>
			<NodeLabel>{node.label}</NodeLabel>
			{node.isRoot ? (
				<RootNode node={node} />
			) : (
				<ChildNode node={node} incomingEdges={incomingEdges} parentNodes={parentNodes} />
			)}
		</Wrap>
	)
}

export default observer(SamplingNodePanel)

const Wrap = styled.div`
	width: 100vw;
	max-width: 20rem;
`

const NodeLabel = styled.h2`
	${(p) => p.theme.text.h5};
	border-bottom: solid 1px var(--color-line);
	padding-bottom: var(--space-0);
	margin-top: var(--space-0);
	margin-bottom: var(--space-1);
`
