import { useEffect, useState } from 'react'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import styled from 'styled-components'

import GuideArrow from '@components/guideArrow'

import { decimalFlex, isDefined } from '@utils/functions'
import useMatchMedia from '@utils/useMatchMedia'

import { entityNameCategories } from './constants'

export interface HeatmapProps {
	data: (number | null)[][]
	groups: (number | string)[]
	groupLabel?: string
	rows?: (number | string)[]
	rowLabel?: string
	separateLastRow?: boolean
}

const Heatmap = ({
	data,
	groups,
	groupLabel,
	rows = entityNameCategories,
	rowLabel,
	separateLastRow = true,
}: HeatmapProps) => {
	// Must redefined with React state to avoid Gatbsy SSG interference
	const prefersDark = useMatchMedia('(prefers-color-scheme: dark)')
	const [dark, setDark] = useState(false)
	useEffect(() => setDark(prefersDark), [prefersDark])

	return (
		<Wrap>
			<InnerWrap>
				{rowLabel && (
					<RowCaption aria-hidden="true">
						<RowLabel>{rowLabel}</RowLabel>
						<GuideArrow
							from="top"
							to="bottom"
							width={8}
							height={80}
							strokeWidth={1.125}
						/>
					</RowCaption>
				)}
				<Table separateLastRow={separateLastRow}>
					<colgroup>
						<col style={{ width: 'max-content' }} />
						{groups.map((_, index) => (
							<col key={index} style={{ width: `calc(100% / ${groups.length}` }} />
						))}
					</colgroup>
					<VisuallyHidden elementType="thead">
						<tr>
							<RowName scope="col" invisible>
								{rowLabel ?? 'Tag'}
							</RowName>
							{groups.map((group) => (
								<GroupName key={group} scope="col">
									{`${groupLabel ? `${groupLabel} ` : ''}${group}`}
								</GroupName>
							))}
						</tr>
					</VisuallyHidden>

					<TBody>
						{rows.map((row, rowIndex) => (
							<TR key={row}>
								<RowName scope="row">{row}</RowName>
								{groups.map((group, groupIndex) => {
									const value = data[rowIndex][groupIndex]

									if (!isDefined(value)) return <TD key={group} />

									const whiteText = dark ? value < 0.5 : value > 0.75

									const labelOpacity = dark
										? value < 0.25
											? 0.5 + value
											: 0.75 + value / 4
										: value < 0.25
											? 0.6 + value
											: 0.85 + value / 6

									return (
										<TD key={group}>
											<TDBackground opacity={0.025 + value * 0.85} aria-hidden="true" />
											<TDLabel whiteText={whiteText} opacity={labelOpacity}>
												{decimalFlex(value, 2)}
											</TDLabel>
										</TD>
									)
								})}
							</TR>
						))}
					</TBody>

					<TFoot aria-hidden="true">
						<tr>
							<RowName invisible isLabel scope="col">
								{rowLabel ?? 'Tag'}
							</RowName>
							{groups.map((group) => (
								<GroupName key={group} scope="col">
									{group}
								</GroupName>
							))}
						</tr>
					</TFoot>
				</Table>
			</InnerWrap>
			{groupLabel && (
				<GroupCaption aria-hidden="true">
					<GuideArrow from="left" to="right" width={80} height={8} strokeWidth={1.125} />
					<GroupLabel>{groupLabel}</GroupLabel>
				</GroupCaption>
			)}
		</Wrap>
	)
}

export default Heatmap

const Wrap = styled.div`
	width: 100%;
	contain: content;
`

const InnerWrap = styled.div`
	display: flex;
	width: 100%;
	overflow: scroll;

	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const Table = styled.table<{ separateLastRow: boolean }>`
	width: 100%;
	border-spacing: 1px;

	tbody > tr:first-of-type > td:first-of-type > div {
		border-top-left-radius: var(--border-radius-s);
	}
	tbody > tr:first-of-type > td:last-of-type > div {
		border-top-right-radius: var(--border-radius-s);
	}
	tbody > tr:last-of-type > td:first-of-type > div {
		border-bottom-left-radius: var(--border-radius-s);
	}
	tbody > tr:last-of-type > td:last-of-type > div {
		border-bottom-right-radius: var(--border-radius-s);
	}

	${(p) =>
		p.separateLastRow &&
		`
			tbody > tr:last-of-type > th,
			tbody > tr:last-of-type > td {
				border-top: solid var(--space-0) transparent;
			}

			tbody > tr:nth-last-of-type(2) > th,
			tbody > tr:nth-last-of-type(2) > td {
				border-bottom: solid var(--space-0) transparent;
			}

			tbody > tr:nth-last-of-type(2) > td:first-of-type > div {
				border-bottom-left-radius: var(--border-radius-s);
			}
			tbody > tr:nth-last-of-type(2) > td:last-of-type > div {
				border-bottom-right-radius: var(--border-radius-s);
			}
			tbody > tr:last-of-type > td:first-of-type > div {
				border-top-left-radius: var(--border-radius-s);
			}
			tbody > tr:last-of-type > td:last-of-type > div {
				border-top-right-radius: var(--border-radius-s);
			}
	`}
`

const TFoot = styled.tfoot``

const GroupName = styled.th`
	${(p) => p.theme.text.small}
	color: var(--color-label);
	padding-top: var(--space-1);
	text-align: center;
	font-variant-numeric: tabular-nums;
`

const RowName = styled.th<{ invisible?: boolean; isLabel?: boolean }>`
	${(p) => p.theme.vizText.small}
	color: var(--color-label);
	text-align: right;
	padding-right: var(--space-1);
	font-variant-numeric: tabular-nums;

	overflow: hidden;

	${(p) => p.isLabel && `max-width: 0;`}

	${(p) =>
		p.invisible &&
		`
		opacity: 0; 
		white-space: nowrap;
		pointer-events: none; 
	`}
`

const TBody = styled.tbody``

const TR = styled.tr``

const TD = styled.td`
	position: relative;
	padding: var(--space-1) var(--space-0-5);
	z-index: 0;
	text-align: center;
	font-variant-numeric: tabular-nums;

	/* Ensure that the cell is always wide enough to fit 2 decimal places */
	min-width: 2.5rem;
`

const TDBackground = styled.div<{ opacity: number }>`
	${(p) => p.theme.spread};
	background-color: var(--color-heading);
	opacity: ${(p) => p.opacity};
	z-index: -1;

	transition: opacity var(--animation-fast-out);
`

const TDLabel = styled.span<{ whiteText: boolean; opacity: number }>`
	${(p) => p.theme.text.small}
	${(p) => p.whiteText && `text-shadow: var(--box-shadow-text);`}
	color: ${(p) => (p.whiteText ? 'var(--color-white)' : 'var(--color-black)')};
	text-shadow:
		${(p) => (p.whiteText ? 'var(--color-black)' : 'var(--color-white)')} 0 0 2em,
		${(p) => (p.whiteText ? 'var(--color-black)' : 'var(--color-white)')} 0 0 2em;
	opacity: ${(p) => p.opacity};
`

const GroupCaption = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-left: auto;
	margin-top: var(--space-0);
`

const GroupLabel = styled.p`
	${(p) => p.theme.text.small}
	color: var(--color-label);
`

const RowCaption = styled.div`
	display: flex;
	align-items: flex-start;
	margin: var(--space-1) var(--space-1) var(--space-3) auto;
`

const RowLabel = styled.p`
	${(p) => p.theme.text.small}
	color: var(--color-label);
	margin-right: var(--space-0);
	width: 1em;
	transform: rotate(90deg);
	white-space: nowrap;
`
