import { useMemo } from 'react'
import { GatsbyImageProps } from 'gatsby-plugin-image'
import styled from 'styled-components'

import Card from '@components/card'
import Grid, { GridColCounts, gridColCounts } from '@components/grid'

import { Story } from '@types'
import { sum } from '@utils/functions'

interface GridColumns {
	start: number
	end: number
}

export type AdaptiveGridColumns = Record<keyof GridColCounts, GridColumns>

interface SpanRange {
	mid: number
	min: number
	max: number
}

/** Maps a size shortname (s/m/l/xl) to a full size range object */
const sizeMap: Record<Story['featuredSize'], SpanRange> = {
	s: { mid: 3, min: 3, max: 3 },
	m: { mid: 3, min: 3, max: 4 },
	l: { mid: 4, min: 3, max: 5 },
	xl: { mid: 5, min: 4, max: 6 },
}

const getGridColumns = (stories: Story[]): AdaptiveGridColumns[] => {
	const spanRanges: SpanRange[] = stories.map((card) => sizeMap[card.featuredSize])

	/**
	 * Returns CardRanges organized into rows,
	 * based on how many columns are available
	 */
	const getRows = (spanRanges: SpanRange[], nCols: number): SpanRange[][] => {
		const rows: SpanRange[][] = [...(spanRanges[0] ? [[spanRanges[0]]] : [])]
		const remainingSpanRanges: SpanRange[] = [...spanRanges.slice(1)]
		let potentialNewRowConfig: SpanRange[] = [spanRanges[0], remainingSpanRanges[0]]
		let currentRowIndex = 0

		const needToWrap = (spanRanges: SpanRange[], nCols: number): boolean => {
			return sum(spanRanges.map((sr) => sr.mid)) > nCols
		}

		const reallyNeedToWrap = (spanRanges: SpanRange[], nCols: number): boolean => {
			return sum(spanRanges.map((sr) => Math.max(sr.min, sr.mid - 1))) > nCols
		}

		while (remainingSpanRanges.length > 0) {
			// If there is more space in the row --> add next card to current row
			if (!needToWrap(potentialNewRowConfig, nCols)) {
				rows[currentRowIndex].push(remainingSpanRanges[0])
			} else if (
				rows[currentRowIndex].length === 1 &&
				!reallyNeedToWrap(potentialNewRowConfig, nCols)
			) {
				rows[currentRowIndex].push(remainingSpanRanges[0])
				// If there is no more space
				// --> add next card to a new row
			} else {
				rows.push([])
				currentRowIndex += 1
				rows[currentRowIndex].push(remainingSpanRanges[0])
			}

			remainingSpanRanges.shift()
			potentialNewRowConfig = [...rows[currentRowIndex], remainingSpanRanges[0]]
		}

		return rows
	}

	/**
	 * Make cards wider/more narrow so they all
	 * span entire rows (except for the last row)
	 */
	const calibrateRows = (rows: SpanRange[][], nCols: number): GridColumns[] =>
		rows
			.map((row, rowIndex) => {
				/**
				 * Sorted spans, from smallest to largest size
				 */
				const sortedSpans = row
					.map((spanRange, index) => ({ index, ...spanRange }))
					.sort((a, b) => a.mid - b.mid)

				/**
				 * Array of sizes of cards in the row,
				 * starting out with the 'mid' values
				 */
				const spans = row.map((spanRange) => spanRange.mid)
				/**
				 * For checking when the very upper limit is hit,
				 * i.e. when no more card can be widened
				 */
				const max = sum(row.map((spanRange) => spanRange.max))
				/**
				 * To see if we need to make cards wider
				 * or more narrow, and by how much
				 */
				let difference = nCols - sum(spans)
				const shouldAdd = difference > 0
				let nextSortedIndex = shouldAdd ? sortedSpans.length - 1 : 0
				let nextIndex = sortedSpans[nextSortedIndex].index

				// Progressively make cards wider/more narrow
				// until either the cards span the entire row or no more
				// card can be widened (usually the case in the last row)
				const isLastRow = rowIndex === rows.length - 1

				while (difference !== 0 && !(isLastRow && sum(spans) >= max)) {
					const nextSpanSize = spans[nextIndex]
					const nextSpan = row[nextIndex]

					// Adding space to spans
					if (shouldAdd) {
						spans[nextIndex] += 1
						difference -= 1

						// Move to next card in the row
						if (nextSortedIndex !== 0) {
							nextSortedIndex -= 1
						} else {
							nextSortedIndex = sortedSpans.length - 1
						}

						// Removing space from spans
					} else {
						if (nextSpanSize - 1 >= nextSpan.min) {
							spans[nextIndex] -= 1
							difference += 1
						}

						// Move to next card in the row
						if (nextSortedIndex < sortedSpans.length - 1) {
							nextSortedIndex += 1
						} else {
							nextSortedIndex = 0
						}
					}

					nextIndex = sortedSpans[nextSortedIndex].index
				}

				// Translate card spans [number] to grid-column
				// positions [start: number, end: number]
				let currentStartLocation = 1
				const gridColsCollection: GridColumns[] = spans.map((span) => {
					const gridCols: GridColumns = {
						start: currentStartLocation,
						end: currentStartLocation + span,
					}
					currentStartLocation += span

					return gridCols
				})

				return gridColsCollection
			})
			.flat(1)

	/** The final card sizes for each breakpoint */
	const results: Partial<AdaptiveGridColumns>[] = Array.from(Array(stories.length)).map(
		() => ({}),
	)
	;(Object.keys(gridColCounts) as Array<keyof GridColCounts>).forEach((key) => {
		const availableRows = gridColCounts[key]
		const uncalibratedRows = getRows(spanRanges, availableRows)
		const calibratedRows = calibrateRows(uncalibratedRows, availableRows)

		calibratedRows.forEach((span, i) => (results[i][key] = span))
	})

	return results as AdaptiveGridColumns[]
}

interface CardGroupProps {
	stories: Story[]
	imageLoading?: GatsbyImageProps['loading']
}

const CardGroup = ({ stories, imageLoading }: CardGroupProps) => {
	const gridColumns = useMemo(() => getGridColumns(stories), [stories])

	return (
		<Wrap>
			{stories.map((story, i) => (
				<Card
					key={story.slug}
					gridCols={gridColumns[i]}
					imageLoading={imageLoading}
					{...story}
				/>
			))}
		</Wrap>
	)
}

export default CardGroup

const Wrap = styled(Grid)`
	row-gap: var(--space-4);

	${(p) => p.theme.breakpoints.s} {
		row-gap: var(--space-2);
	}
`
