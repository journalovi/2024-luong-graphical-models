import {
	Dispatch,
	memo,
	RefObject,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components'

import { debounce, isDev } from '@utils/functions'
import useMountEffect from '@utils/useMountEffect'

import { MODEL_FULL, PREDICTION_MODEL } from '../constants'
import { getTokenSpaces, tokenize } from '../utils'

import {
	CRF_PREDICTIONS,
	HMM_PREDICTIONS,
	inputPaddingRight,
	MEMM_PREDICTIONS,
	MODEL_NAME_WIDTH,
	SAMPLES,
} from './utils'

const EMPTY_PREDS = {
	[PREDICTION_MODEL.HMM]: [],
	[PREDICTION_MODEL.MEMM]: [],
	[PREDICTION_MODEL.CRF]: [],
}

const PRED_LABELS = [
	['O', 'not a name'],
	['ORG', 'organization'],
	['PER', 'person'],
	['LOC', 'location'],
	['MISC', 'miscellaneous'],
]

interface LivePredictionResultsProps {
	inputValue: string
	models: PREDICTION_MODEL[]
	hideTagPrefixes?: boolean
	inputRef: RefObject<HTMLButtonElement>
	loading: boolean
	setLoading: Dispatch<SetStateAction<boolean>>
	initialized: boolean
	setInitialized: Dispatch<SetStateAction<boolean>>
}

const LivePredictionResults = ({
	inputValue,
	inputRef,
	models,
	hideTagPrefixes,
	loading,
	setLoading,
	initialized,
	setInitialized,
}: LivePredictionResultsProps) => {
	const tableWrapperRef = useRef<HTMLDivElement>(null)

	// Store input value & split it into tokens
	const [tokens, setTokens] = useState<string[]>([])
	const [tokenSpaces, setTokenSpaces] = useState<boolean[]>([])

	// Fetch & store predictions
	const [predictions, setPredictions] =
		useState<Record<PREDICTION_MODEL, string[]>>(EMPTY_PREDS)

	const debouncedUpdatePredictions = useMemo(
		() =>
			debounce<[value: string]>((value: string) => {
				if (value.length === 0) {
					setPredictions(EMPTY_PREDS)
					return
				}

				const tokens = tokenize(value ?? '')

				const sampleIndex = SAMPLES.indexOf(value)

				setTokens(tokens)
				setTokenSpaces(getTokenSpaces(value, tokens))
				setLoading(false)
				setInitialized(true)

				setPredictions({
					[PREDICTION_MODEL.HMM]: HMM_PREDICTIONS[sampleIndex],
					[PREDICTION_MODEL.MEMM]: MEMM_PREDICTIONS[sampleIndex],
					[PREDICTION_MODEL.CRF]: CRF_PREDICTIONS[sampleIndex],
				})

				setTimeout(() => {
					inputRef.current &&
						tableWrapperRef.current &&
						tableWrapperRef.current.scrollTo(inputRef.current.scrollLeft, 0)
				}, 0)
			}, 500),
		[inputRef, setInitialized, setLoading],
	)

	useEffect(() => {
		if (isDev) return
		setLoading(true)
		debouncedUpdatePredictions(inputValue)
	}, [inputValue, debouncedUpdatePredictions, setLoading])

	// Sync scroll positions of input & table
	useMountEffect(() => {
		if (!inputRef.current || !tableWrapperRef.current) return
		let scrollingFromInput = false
		let scrollingFromInputKeypress = false
		let scrollingFromTable = false

		inputRef.current.onkeyup = (e) => {
			if (scrollingFromTable) {
				scrollingFromTable = false
				return
			}

			if (!tableWrapperRef.current) return
			scrollingFromInputKeypress = true
			tableWrapperRef.current.scrollLeft = (e.target as HTMLDivElement).scrollLeft
		}

		inputRef.current.onscroll = (e) => {
			if (scrollingFromTable) {
				scrollingFromTable = false
				return
			}

			if (!tableWrapperRef.current) return
			scrollingFromInput = true
			tableWrapperRef.current.scrollLeft = (e.target as HTMLDivElement).scrollLeft
		}

		tableWrapperRef.current.onscroll = (e) => {
			if (scrollingFromInput) {
				scrollingFromInput = false
				return
			}

			if (scrollingFromInputKeypress) {
				scrollingFromInputKeypress = false
				return
			}

			if (!inputRef.current) return
			scrollingFromTable = true
			inputRef.current.scrollLeft = (e.target as HTMLDivElement).scrollLeft
		}
	})

	return (
		<ResultsWrapper>
			<CSSTransition in={!initialized} timeout={250} unmountOnExit appear>
				<LoadingWrap showBorders={models.length > 1}>
					<LoadingMessage>Starting prediction server…</LoadingMessage>
				</LoadingWrap>
			</CSSTransition>
			<CSSTransition in={initialized} timeout={250} appear>
				<ResultsAnimationWrapper aria-hidden={!initialized}>
					<TableWrapper ref={tableWrapperRef}>
						<Table showModelNames={models.length > 1}>
							<thead>
								<ConnectorRow>
									<ModelNameHeader scope="col" aria-label="Model" />
									{tokens.map((token, i) => (
										<ConnectorCell key={i} scope="col">
											{token}
											{tokenSpaces[i] && <span aria-hidden="true">&nbsp;</span>}
											{token && <Connector isLoading={loading} />}
										</ConnectorCell>
									))}
								</ConnectorRow>
							</thead>
							<tbody>
								{models.map((model) => (
									<PredRow key={model}>
										<ModelName scope="row">
											<ModelNameContent>
												<abbr title={MODEL_FULL[model]}>{model}</abbr>
											</ModelNameContent>
										</ModelName>

										{predictions[model]?.map((pred, i) => (
											<Pred key={i}>
												<ZeroWidth isLoading={loading}>
													{tokens[i] && (
														<PredSpan isOut={pred === 'O'}>
															<PredBackground aria-hidden="true" />
															{hideTagPrefixes ? pred.split('-').slice(-1) : pred}
														</PredSpan>
													)}
												</ZeroWidth>
											</Pred>
										))}

										<RowPadding aria-hidden="true" />
									</PredRow>
								))}
							</tbody>
						</Table>
					</TableWrapper>

					<Legend>
						{PRED_LABELS.map(([term, label]) => (
							<LegendItem key={term}>
								<LegendDT>{term}</LegendDT>
								<LegendDD>
									<span aria-hidden="true">&nbsp;=&nbsp;</span>
									{label}
								</LegendDD>
							</LegendItem>
						))}
					</Legend>
				</ResultsAnimationWrapper>
			</CSSTransition>
		</ResultsWrapper>
	)
}

export default memo(LivePredictionResults)

const ResultsWrapper = styled.div`
	position: relative;
`

const ResultsAnimationWrapper = styled.div`
	width: calc(100% - ${inputPaddingRight});

	${(p) => p.theme.transitionGroupFade}
	transition: opacity var(--animation-fast-out);
`

const LoadingWrap = styled.div<{ showBorders: boolean }>`
	position: absolute;
	inset: var(--space-2) 0 0 0;
	border-radius: var(--border-radius-m);

	${(p) => p.showBorders && `border: dashed 1px var(--color-line);`}

	${(p) => p.theme.flexCenter};
	${(p) => p.theme.transitionGroupFade}
	transition: opacity var(--animation-fast-out);
	z-index: 1;
`

const LoadingMessage = styled.p`
	${(p) => p.theme.text.small}
	color: var(--color-label);
`

const TableWrapper = styled.div`
	overflow: auto;
	position: relative;

	padding-top: var(--space-0);

	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const Table = styled.table<{ showModelNames?: boolean }>`
	border-spacing: 0;
	width: 100%;

	th {
		font-weight: 400;
	}

	tr:not(:last-child) > td,
	tr:not(:last-child) > th {
		border-bottom: solid 1px var(--color-line);
	}

	td {
		padding: var(--space-2) 0;
	}

	${(p) =>
		!p.showModelNames &&
		`
			& > thead > tr > th:first-child,
			& > tbody > tr > th:first-child {
				display: none;
			}
		`}
`

const ConnectorRow = styled.tr`
	height: 3rem;
`

const ConnectorCell = styled.th`
	position: relative;
	padding: var(--space-1) 0;
	user-select: none;

	${(p) => p.theme.text.h6};
	font-family: ${(p) => p.theme.text.body1.fontFamily};
	font-weight: ${(p) => p.theme.text.body1.fontWeight};
	letter-spacing: -0.02em;
	color: transparent;

	opacity: 0;
	animation: ${(p) => p.theme.fadeIn} var(--animation-fast-out) forwards;
`

const Connector = styled.div<{ isLoading: boolean }>`
	width: 0;
	height: calc(100% - var(--space-2));
	border-right: solid 1px var(--color-line);

	${(p) => p.theme.absCenter}

	transition: opacity var(--animation-fast-out);
	transition-delay: 10ms;
	${(p) => p.isLoading && `opacity: 0;`};
`

const ModelNameHeader = styled(ConnectorCell)`
	position: sticky;
	left: 0;
	width: ${MODEL_NAME_WIDTH};
	min-width: ${MODEL_NAME_WIDTH};

	background: var(--color-background);
	color: transparent;
	z-index: 1;
`

const ModelName = styled.th`
	position: sticky;
	left: 0;
	width: ${MODEL_NAME_WIDTH};
	min-width: ${MODEL_NAME_WIDTH};

	background: var(--color-background);
	color: var(--color-label);
	text-transform: uppercase;
	z-index: 1;
`

const ModelNameContent = styled.span`
	position: relative;
	display: flex;
	align-items: center;
	min-height: 3rem;
`

const PredRow = styled.tr`
	height: 3rem;
`

const Pred = styled.td`
	${(p) => p.theme.vizText.label};
	font-weight: 500;
	text-align: center;
	text-transform: uppercase;
	white-space: nowrap;

	&:hover {
		position: relative;
		z-index: 1;
	}

	opacity: 0;
	animation: ${(p) => p.theme.fadeIn} var(--animation-fast-out) forwards;
`

const ZeroWidth = styled.span<{ isLoading: boolean }>`
	width: 0;
	display: flex;
	justify-content: center;
	margin: 0 auto;

	transition: opacity var(--animation-fast-out);
	${(p) => p.isLoading && `opacity: 0.25;`};
`

const PredSpan = styled.span<{ isOut?: boolean }>`
	display: inline-block;
	position: relative;

	${(p) => p.isOut && `color: var(--color-label);`}
`

const PredBackground = styled.div`
	${(p) => p.theme.absCenter}

	width: calc(100% + var(--space-0));
	height: calc(100% + var(--space-0));
	background: var(--color-background);
	border-radius: var(--border-radius-s);
	opacity: 0.9;
	z-index: -1;
`

const RowPadding = styled.td`
	width: 100%;
`

const Legend = styled.dl`
	display: flex;
	flex-wrap: wrap;

	${(p) => p.theme.text.small}
	color: var(--color-label);

	width: 100%;
	border-top: solid 1px var(--color-line);
	padding-top: var(--space-2);
	margin: 0;
	white-space: nowrap;
`

const LegendItem = styled.div`
	display: flex;
	margin-right: var(--space-2);
`

const LegendDT = styled.dt`
	${(p) => p.theme.vizText.small}
`

const LegendDD = styled.dd`
	margin: 0;
`
