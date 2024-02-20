import { ReactNode, useCallback, useDeferredValue, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styled from 'styled-components'

import Button from '@components/button'
import Grid from '@components/grid'
import Panel from '@components/panel'
import ShadowRoot from '@components/shadowRoot'
import Spinner from '@components/spinner'
import IconRestart from '@icons/restart'

import { PREDICTION_MODEL } from '../constants'

import LivePredictionResults from './results'
import { inputPaddingRight, MODEL_NAME_WIDTH, SAMPLES } from './utils'

function getRandomIndex() {
	return Math.round(Math.random() * SAMPLES.length - 1)
}

interface LivePredictionProps {
	models: PREDICTION_MODEL[]
	label?: ReactNode
	initialInputValue?: string
	hideTagPrefixes?: boolean
	noMargin?: boolean
}

const LivePrediction = ({
	models,
	label,
	initialInputValue,
	hideTagPrefixes,
	noMargin,
}: LivePredictionProps) => {
	const inputRef = useRef<HTMLButtonElement>(null)

	// Store input value & split it into tokens
	const [inputValue, setInputValue] = useState(initialInputValue ?? '')
	const deferredInputValue = useDeferredValue(inputValue)

	// Store fetch state
	const [loading, setLoading] = useState(true)
	const [initialized, setInitialized] = useState(false)

	const randomize = useCallback(() => {
		let newValue = SAMPLES[getRandomIndex()]
		while (newValue === inputValue || !newValue) {
			newValue = SAMPLES[getRandomIndex()]
		}

		setInputValue(newValue)
	}, [inputValue])

	return (
		<Grid noPaddingOnMobile>
			<StyledPanel
				raised
				size="m"
				gridColumn="wide"
				noMargin={noMargin}
				nModels={models.length}
			>
				<InnerWrap>
					{label && <Label modelNameOffset={models.length > 1}>{label}</Label>}

					<InputGroup modelNameOffset={models.length > 1}>
						<Input ref={inputRef} onPress={randomize} title="Try new text sample">
							{inputValue}
						</Input>
						<RandomizeIconWrap>
							<SwitchTransition>
								<CSSTransition
									key={initialized && loading ? 'loading' : ''}
									timeout={125}
									appear
								>
									{initialized && loading ? (
										<LoadingSpinner
											label="Loading new predictions"
											diameter={16}
											strokeWidth={2}
										/>
									) : (
										<StyledIconRestart size="xl" />
									)}
								</CSSTransition>
							</SwitchTransition>
						</RandomizeIconWrap>
					</InputGroup>

					<LivePredictionResults
						inputValue={deferredInputValue}
						inputRef={inputRef}
						models={models}
						hideTagPrefixes={hideTagPrefixes}
						loading={loading || inputValue !== deferredInputValue}
						setLoading={setLoading}
						initialized={initialized}
						setInitialized={setInitialized}
					/>
				</InnerWrap>
			</StyledPanel>
		</Grid>
	)
}

export default LivePrediction

const BASE_PANEL_HEIGHT = 220
const MODEL_ROW_HEIGHT = 52
const StyledPanel = styled(Panel)<{ noMargin?: boolean; nModels: number }>`
	height: ${(p) => BASE_PANEL_HEIGHT + MODEL_ROW_HEIGHT * p.nModels}px;
	${(p) =>
		!p.noMargin &&
		`
			margin-top: var(--adaptive-space-2);
			margin-bottom: var(--adaptive-space-4);
	`}
	contain: content;
`

const InnerWrap = styled(ShadowRoot)`
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	height: 100%;
`

const Label = styled.p<{ modelNameOffset?: boolean }>`
	display: block;
	color: var(--color-label);
	margin-bottom: var(--space-1-5);

	${(p) => p.modelNameOffset && `margin-left: ${MODEL_NAME_WIDTH};`}
`

const InputGroup = styled.div<{ modelNameOffset?: boolean }>`
	position: relative;
	width: calc(
		100% - ${(p) => (p.modelNameOffset ? MODEL_NAME_WIDTH : '0px')} + var(--space-1-5)
	);
	margin-left: calc(
		${(p) => (p.modelNameOffset ? MODEL_NAME_WIDTH : '0px')} - var(--space-1-5) - 1px
	);

	${(p) => p.theme.breakpoints.xs} {
		margin-left: calc(
			${(p) => (p.modelNameOffset ? MODEL_NAME_WIDTH : '0px')} - var(--space-1) - 1px
		);
	}
`

const Input = styled(Button)`
	${(p) => p.theme.text.h6};
	font-family: ${(p) => p.theme.text.body1.fontFamily};
	font-weight: ${(p) => p.theme.text.body1.fontWeight};
	letter-spacing: -0.02em;

	background: var(--color-background);
	border-radius: var(--border-radius-m);
	border: solid 1px var(--color-line);

	&:hover {
		background: var(--color-background-hover);
	}

	padding: var(--space-1) var(--space-1-5);
	padding-right: ${inputPaddingRight};
	width: 100%;

	overflow: scroll;

	${(p) => p.theme.breakpoints.xs} {
		padding-left: var(--space-1);
	}
`

const RandomizeIconWrap = styled.div`
	position: absolute;
	top: 50%;
	right: var(--space-1);
	transform: translateY(-50%);
	width: var(--space-4);
	height: var(--space-4);
	pointer-events: none;

	color: var(--color-label);
`

const LoadingSpinner = styled(Spinner)`
	${(p) => p.theme.absCenter}
	${(p) => p.theme.transitionGroupFade}
	transition: opacity var(--animation-v-fast-out);
	color: var(--color-label);
`

const StyledIconRestart = styled(IconRestart)`
	${(p) => p.theme.absCenter}
	${(p) => p.theme.transitionGroupFade}
	transition: opacity var(--animation-v-fast-out);
`
