import { useMemo, useState } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'
import SegmentedControl, { Item } from '@components/segmentedControl'

import Callout from '../callout'
import { MODEL, MODEL_SHORT } from '../constants'
import Heatmap from '../heatmap'

const hmmPrecisionByEntityLength = [
	[0.61, 0.68, 0.3, 0.12, 0.28],
	[0.96, 0.67, 0.7, null, null],
	[0.88, 0.36, null, null, null],
	[0.9, 0.46, 0.24, 0.12, null],
	[0.77, 0.61, 0.31, 0.12, 0.29],
]
const hmmRecallByEntityLength = [
	[0.51, 0.61, 0.62, 0.38, 0.44],
	[0.08, 0.88, 0.11, null, null],
	[0.63, 0.55, 0.2, null, null],
	[0.41, 0.43, 0.48, null, null],
	[0.48, 0.74, 0.42, 0.38, 0.5],
]

const memmPrecisionByEntityLength = [
	[0.76, 0.69, 0.84, 0.36, 0.8],
	[0.59, 0.91, 0.66, 0.25, null],
	[0.8, 0.33, 0.35, 0.0, null],
	[0.82, 0.57, 0.29, 0.18, null],
	[0.77, 0.7, 0.58, 0.16, 0.43],
]
const memmRecallByEntityLength = [
	[0.55, 0.46, 0.38, 0.12, 0.44],
	[0.34, 0.74, 0.8, null, null],
	[0.83, 0.66, 0.52, null, null],
	[0.63, 0.44, 0.52, null, null],
	[0.64, 0.64, 0.53, 0.22, 0.5],
]

const crfUnaryPrecisionByEntityLength = [
	[0.77, 0.81, 0.65, 0.39, 0.43],
	[0.58, 0.85, 0.69, null, null],
	[0.86, 0.69, 0.77, null, null],
	[0.84, 0.61, 0.31, 0.18, null],
	[0.79, 0.81, 0.63, 0.35, 0.46],
]
const crfUnaryRecallByEntityLength = [
	[0.67, 0.64, 0.73, 0.62, 0.56],
	[0.51, 0.96, 0.83, null, null],
	[0.83, 0.74, 0.68, null, null],
	[0.69, 0.55, 0.48, null, null],
	[0.71, 0.83, 0.73, 0.62, 0.6],
]

const groups = [1, 2, 3, 4, 5]

interface EntityLengthHeatmapProps {
	models: MODEL[]
}

const EntityLengthHeatmap = ({ models }: EntityLengthHeatmapProps) => {
	const [metric, setMetric] = useState<'precision' | 'recall'>('precision')

	const [selectedModel, setSelectedModel] = useState<MODEL>(models[0])

	const data = useMemo(() => {
		if (metric === 'precision') {
			switch (selectedModel) {
				case MODEL.HMM:
					return hmmPrecisionByEntityLength
				case MODEL.MEMM:
					return memmPrecisionByEntityLength
				case MODEL.CRF_UNARY:
				default:
					return crfUnaryPrecisionByEntityLength
			}
		}

		switch (selectedModel) {
			case MODEL.HMM:
				return hmmRecallByEntityLength
			case MODEL.MEMM:
				return memmRecallByEntityLength
			case MODEL.CRF_UNARY:
			default:
				return crfUnaryRecallByEntityLength
		}
	}, [selectedModel, metric])

	return (
		<>
			<Wrap>
				<ControlWrap>
					{models.length > 1 && (
						<SegmentedControl
							aria-label="Model"
							value={selectedModel}
							onChange={setSelectedModel}
						>
							{models.map((model) => (
								<Item key={model}>{MODEL_SHORT[model]}</Item>
							))}
						</SegmentedControl>
					)}
					<SegmentedControl aria-label="Metric" value={metric} onChange={setMetric}>
						<Item key="precision">Precision</Item>
						<Item key="recall">Recall</Item>
					</SegmentedControl>
				</ControlWrap>
				<ContentWrap>
					<Heatmap data={data} groups={groups} groupLabel="Entity Length" />
				</ContentWrap>
			</Wrap>
			<StyledCallout>
				An empty cell means there were not enough (fewer than five) relevant entities.
				E.g. in the precision tab, there were not enough entities predicted to be a
				location name that were five words long.
			</StyledCallout>
		</>
	)
}

export default EntityLengthHeatmap

const Wrap = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	${(p) => p.theme.gridColumn.text};
	margin-top: var(--adaptive-space-1);
	gap: var(--space-1-5);
	max-width: 32rem;
	contain: content;
`

const ControlWrap = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	column-gap: var(--space-2);
	row-gap: var(--space-1);
`

const ContentWrap = styled.div`
	position: relative;
	width: 100%;
`

const StyledCallout = styled(Callout)`
	margin-bottom: var(--adaptive-space-3);
`
