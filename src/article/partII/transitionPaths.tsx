import { Fragment, useRef } from 'react'
import styled from 'styled-components'

import Grid from '@components/grid'

import { tl } from '@utils/text'
import useSize from '@utils/useSize'

import { states, transitionProbabilities } from './constants'

function probabilityToOpacity(probability: number) {
	return probability / (1.2 * probability + 0.75)
}

const title = 'Transition paths between hidden states'

const HMMTransitionPaths = ({ nStates, label }: { nStates: number; label?: string }) => {
	const innerWrapRef = useRef<HTMLDivElement>(null)
	const { width, height } = useSize(innerWrapRef)

	return (
		<StyledGrid>
			<Wrap>
				<InnerWrap ref={innerWrapRef}>
					{width && height && (
						<SVG
							viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
							aria-label={tl(
								`Visualization of potential transition paths between ${nStates} consecutive hidden states. Each state's potential values include $1. There are lines connecting each state's potential values to the next state's potential values. Each line has a different opacity indicating the transition path's probability.`,
								states,
							).join('')}
						>
							{new Array(nStates).fill(0).map((_, layerIndex) => {
								const xDelta = Math.min(160, width / (nStates - 1) - 25)
								const xStart = (-(nStates - 1) / 2 + layerIndex) * xDelta
								const xEnd = (-(nStates - 1) / 2 + layerIndex + 1) * xDelta

								const yDelta = height / (states.length + 1) // add one for state label

								return (
									<Fragment key={layerIndex}>
										<g>
											<text x={xStart} y={(-states.length / 2) * yDelta - 4}>
												s
												<tspan dy="0.5em">
													i
													{layerIndex !== 1 &&
														(layerIndex - 1 > 0 ? `+${layerIndex - 1}` : layerIndex - 1)}
												</tspan>
											</text>
											{states.map((state, stateIndex) => {
												const y = (-states.length / 2 + stateIndex + 1) * yDelta

												return (
													<text key={stateIndex} x={xStart} y={y}>
														{state}
													</text>
												)
											})}
										</g>
										{layerIndex < nStates - 1 && (
											<g>
												{states.map((sourceState, sourceStateIndex) => {
													const ySource =
														(-states.length / 2 + sourceStateIndex + 1) * yDelta

													return (
														<g key={sourceStateIndex}>
															{states.map((targetState, targetStateIndex) => {
																const yTarget =
																	(-states.length / 2 + targetStateIndex + 1) * yDelta

																const opacity = probabilityToOpacity(
																	transitionProbabilities[sourceStateIndex][
																		targetStateIndex
																	],
																)

																if (opacity < 0.025) return null

																return (
																	<path
																		key={targetStateIndex}
																		d={`M ${xStart + 30} ${ySource} L ${
																			xEnd - 30
																		} ${yTarget}`}
																		strokeOpacity={opacity}
																	/>
																)
															})}
														</g>
													)
												})}
											</g>
										)}
									</Fragment>
								)
							})}
						</SVG>
					)}
				</InnerWrap>

				<Legend aria-hidden="true">
					<strong>
						{title}
						{label && '.'}
					</strong>
					<br />
					{label}
				</Legend>
			</Wrap>
		</StyledGrid>
	)
}

export default HMMTransitionPaths

const StyledGrid = styled(Grid)`
	${(p) => p.theme.flexCenter}
	contain: strict;
	height: 18rem;
	margin-top: var(--adaptive-space-1);
	margin-bottom: var(--adaptive-space-3);
`

const Wrap = styled.div`
	position: relative;
	${(p) => p.theme.gridColumn.text};
`

const InnerWrap = styled.div`
	position: relative;
	height: 15rem;
	margin-bottom: var(--space-1);
`

const SVG = styled.svg`
	width: 100%;
	height: 100%;

	text {
		fill: var(--color-body);
		text-anchor: middle;
		transform: translateY(0.35em);
		&:first-child {
			font-weight: 500;
			fill: var(--color-label);
		}
		tspan {
			font-size: 0.75em;
		}
	}

	path {
		stroke: var(--color-body);
		stroke-width: 2;
		stroke-linecap: round;
	}
`

const Legend = styled.small`
	${(p) => p.theme.text.small};
	color: var(--color-label);

	display: block;
	max-width: 22rem;
	margin: 0 auto;
	text-align: center;
	margin-bottom: var(--space-0);

	strong {
		font-weight: 500;
		color: var(--color-label);
	}
`
