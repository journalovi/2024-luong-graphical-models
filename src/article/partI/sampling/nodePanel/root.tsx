import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import NumberField from '@components/fields/number'
import SelectField, { Item, Section } from '@components/fields/select'

import {
	ContinuousDistributionType,
	DiscreteDistributionType,
	DistributionType,
} from '../model/distributions/utils'
import SamplingNode from '../model/node'

import RootNodeDistributionViz from './rootViz'

interface RootNodePanelProps {
	node: SamplingNode
}

const RootNodePanel = ({ node }: RootNodePanelProps) => {
	const { parameters, parameterValues, type: distributionType } = node.distribution

	return (
		<Wrap>
			<NodeDescription>
				{`${node.label} is not conditionally dependent on any variable. It will be sampled directly from the distribution below.`}
			</NodeDescription>
			<RootNodeDistributionViz node={node} />
			<SelectField
				small
				rowLayout
				label="Distribution"
				value={distributionType}
				onChange={(dist) => node.setDistribution(dist as DistributionType)}
			>
				<Section title="Continuous">
					{Object.entries(ContinuousDistributionType).map(([name, key]) => (
						<Item key={key}>{name}</Item>
					))}
				</Section>
				<Section title="Discrete">
					{Object.entries(DiscreteDistributionType).map(([name, key]) => (
						<Item key={key}>{name}</Item>
					))}
				</Section>
			</SelectField>
			{Object.entries(parameters).map(([param, paramInfo]) => {
				const { displayName, description, minValue, maxValue, step } = paramInfo
				return (
					<NumberField
						key={param}
						small
						rowLayout
						value={parameterValues[param]}
						onChange={(val) => node.distribution.setParameterValue(param, val)}
						label={displayName}
						description={description}
						minValue={minValue}
						maxValue={maxValue}
						step={step ?? 1}
						inputWidth="4.5rem"
					/>
				)
			})}
		</Wrap>
	)
}

export default observer(RootNodePanel)

const Wrap = styled.div``

const NodeDescription = styled.p`
	${(p) => p.theme.text.small}
	color: var(--color-label);
	margin-bottom: var(--space-1);
`
