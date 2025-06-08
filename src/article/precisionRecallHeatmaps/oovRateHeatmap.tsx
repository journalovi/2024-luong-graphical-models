import { useMemo, useState } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'
import SegmentedControl, { Item } from '@components/segmentedControl'

import Callout from '../callout'
import { MODEL, MODEL_SHORT } from '../constants'
import Heatmap from '../heatmap'

const hmmPrecisionByOOVRate = [
	[0.86, null, null, null, null, null, null, null, null, null, 0.3],
	[0.8, null, null, null, null, 0.5, null, null, null, null, 0.52],
	[0.78, null, null, 0.15, null, null, null, 0.06, null, null, 0.0],
	[0.42, null, 0.22, null, null, 0.0, null, null, 0.0, null, 0.0],
	[0.67, null, null, null, 0.22, null, 0.0, null, null, 0.14, null],
	[0.84, null, 0.22, 0.15, 0.22, 0.48, 0.0, 0.06, 0.0, 0.14, 0.41],
]
const hmmRecallByOOVRate = [
	[0.61, null, null, null, null, null, null, null, null, null, 0.11],
	[0.78, null, null, null, null, 0.71, null, null, null, null, 0.7],
	[0.59, null, null, 0.25, null, null, null, 0.19, null, null, 0.0],
	[0.38, null, 0.5, null, null, null, null, null, null, null, null],
	[0.4, 0.5, null, null, null, null, null, null, null, null, null],
	[0.64, 0.5, 0.5, 0.25, null, 0.71, null, 0.19, null, null, 0.29],
]

const memmPrecisionByOOVRate = [
	[0.83, null, null, null, null, null, null, null, null, null, 0.34],
	[0.76, null, null, null, null, 0.72, null, null, null, null, 0.55],
	[0.6, null, null, 0.56, null, null, null, 0.59, null, null, 0.5],
	[0.16, null, 0.2, null, null, 0.0, null, null, null, null, null],
	[0.6, 0.5, null, null, null, null, null, null, null, null, null],
	[0.8, 0.5, 0.2, 0.56, null, 0.71, null, 0.59, null, null, 0.45],
]
const memmRecallByOOVRate = [
	[0.82, null, null, null, null, null, null, null, null, null, 0.14],
	[0.74, null, null, null, null, 0.62, null, null, null, null, 0.5],
	[0.51, null, null, 0.55, null, null, null, 0.59, null, null, 0.5],
	[0.19, null, 0.25, null, null, null, null, null, null, null, null],
	[0.6, 0.5, null, null, null, null, null, null, null, null, null],
	[0.79, 0.5, 0.25, 0.55, null, 0.61, null, 0.59, null, null, 0.25],
]

const crfUnaryPrecisionByOOVRate = [
	[0.89, null, null, null, null, null, null, null, null, null, 0.4],
	[0.83, null, null, null, null, 0.75, null, null, null, null, 0.83],
	[0.78, null, null, 0.55, null, null, null, 0.47, null, null, 0.37],
	[0.5, null, 0.52, null, null, 0.1, null, null, 0.0, null, null],
	[0.7, null, null, null, null, null, null, null, null, null, null],
	[0.87, null, 0.52, 0.55, null, 0.74, null, 0.47, 0.0, null, 0.56],
]
const crfUnaryRecallByOOVRate = [
	[0.86, null, null, null, null, null, null, null, null, null, 0.29],
	[0.86, null, null, null, null, 0.77, null, null, null, null, 0.85],
	[0.75, null, null, 0.68, null, null, null, 0.81, null, null, 0.56],
	[0.52, null, 0.92, null, null, null, null, null, null, null, null],
	[0.7, 0.67, null, null, null, null, null, null, null, null, null],
	[0.85, 0.67, 0.92, 0.68, null, 0.77, null, 0.81, null, null, 0.46],
]

const entityLengths = [1, 2, 3, 4, 5]
const oovRates = [0, 0.2, 0.25, 0.33, 0.4, 0.5, 0.6, 0.66, 0.75, 0.8, 1]

interface OOVRateHeatmapProps {
	models: MODEL[]
}

const OOVRateHeatmap = ({ models }: OOVRateHeatmapProps) => {
	const [metric, setMetric] = useState<'precision' | 'recall'>('precision')

	const [selectedModel, setSelectedModel] = useState<MODEL>(models[0])

	const data = useMemo(() => {
		if (metric === 'precision') {
			switch (selectedModel) {
				case MODEL.HMM:
					return hmmPrecisionByOOVRate
				case MODEL.MEMM:
					return memmPrecisionByOOVRate
				case MODEL.CRF_UNARY:
				default:
					return crfUnaryPrecisionByOOVRate
			}
		}

		switch (selectedModel) {
			case MODEL.HMM:
				return hmmRecallByOOVRate
			case MODEL.MEMM:
				return memmRecallByOOVRate
			case MODEL.CRF_UNARY:
			default:
				return crfUnaryRecallByOOVRate
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
					<Heatmap
						data={data}
						groups={oovRates}
						groupLabel="OOV Rate"
						rows={entityLengths}
						rowLabel="Entity Length"
						separateLastRow={false}
					/>
				</ContentWrap>
			</Wrap>
			<StyledCallout>
				An empty cell means either it is impossible (e.g. a two-word entity can’t have an
				OOV rate of 0.25) or there were not enough (fewer than five) relevant entities to
				form a reliable score.
			</StyledCallout>
		</>
	)
}

export default OOVRateHeatmap

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
	justify-content: center;
	gap: var(--space-2);
`

const ContentWrap = styled.div`
	position: relative;
	width: 100%;
`

const StyledCallout = styled(Callout)`
	margin-bottom: var(--adaptive-space-3);
`
