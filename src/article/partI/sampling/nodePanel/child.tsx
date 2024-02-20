import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import NumberField from '@components/fields/number'

import { tl } from '@utils/text'

import SamplingEdge from '../model/edge'
import SamplingNode from '../model/node'

interface ChildNodeFieldsProps {
	node: SamplingNode
	incomingEdges: SamplingEdge[]
	parentNodes: SamplingNode[]
}

const ChildNodeFields = ({ node, incomingEdges, parentNodes }: ChildNodeFieldsProps) => {
	const nodeDescription = tl(
		`${node.label} is conditionally depdendent on $1. In this example, we'll assume that ${node.label} is normally distributed, with the mean being a {1,multiple,weighted sum} of its {1,parent's, parents'} sampled {1,value,values}:`,
		parentNodes.map((n) => n.label),
	)

	const valueFn = `${node.label} ~ Normal(${incomingEdges
		.map((edge) => {
			const parentNode = parentNodes.find((n) => n.id === edge.nodes.source)
			if (!parentNode) return ''

			return `${edge.coefficient}${parentNode.label.toLowerCase()}`
		})
		.join(' + ')}, \u03c3\u00B2)`

	const valueFnDescription = tl(
		`where $1 {1,is a sample from,are samples from} $2.`,
		parentNodes.map((n) => n.label.toLowerCase()),
		parentNodes.map((n) => n.label),
	)

	return (
		<Wrap>
			<NodeDescription>{nodeDescription}</NodeDescription>
			<ValueFnWrap>
				<ValueFn>{valueFn}</ValueFn>
				<ValueFnDescription>{valueFnDescription}</ValueFnDescription>
			</ValueFnWrap>

			{incomingEdges.map((edge) => {
				const { id, coefficient } = edge
				const parentNode = parentNodes.find((n) => n.id === edge.nodes.source)
				if (!parentNode) return null
				return (
					<NumberField
						key={id}
						small
						rowLayout
						value={coefficient}
						onChange={(val) => edge.setCoefficient(val)}
						label={`Coefficient of ${parentNode.label.toLowerCase()}`}
						step={0.1}
						inputWidth="4.5rem"
					/>
				)
			})}
			<NumberField
				small
				rowLayout
				value={node.distribution.parameterValues.sigma}
				onChange={(val) => node.distribution.setParameterValue('sigma', val)}
				label={'\u03c3 – scale parameter'}
				description="Determines the normal distribution's standard deviation."
				step={0.1}
				inputWidth="4.5rem"
			/>
		</Wrap>
	)
}

export default observer(ChildNodeFields)

const Wrap = styled.div``

const NodeDescription = styled.p`
	${(p) => p.theme.text.small}
	color: var(--color-label);
	margin-bottom: var(--space-1);
`

const ValueFnWrap = styled.div`
	margin: var(--space-2) 0;
	padding: var(--space-0) var(--space-2);
	border-left: solid 2px var(--color-line);
`

const ValueFn = styled.p`
	${(p) => p.theme.vizText.body2};
`

const ValueFnDescription = styled.small`
	${(p) => p.theme.text.small};
`
