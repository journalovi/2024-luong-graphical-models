import styled from 'styled-components'

import { Breakpoint } from '@theme/breakpoints'

export type GridColCounts = Record<Breakpoint, number>

/** Number of grid columns at different breakpoints */
export const gridColCounts: GridColCounts = {
	xl: 12,
	l: 10,
	m: 8,
	s: 6,
	xs: 4,
}

const Grid = styled.div<{ noPaddingOnMobile?: boolean }>`
	display: grid;
	grid-template-columns:
		[start] 1fr [wide-start] repeat(2, 1fr) [text-start] repeat(3, 1fr) [mid] repeat(
			3,
			1fr
		)
		[text-end] repeat(2, 1fr) [wide-end] 1fr [end];
	column-gap: var(--grid-column-gap);
	padding-left: var(--page-margin-left);
	padding-right: var(--page-margin-right);

	${(p) => p.theme.breakpoints.xl} {
		grid-template-columns:
			[start] 1fr [wide-start] 1fr [text-start] repeat(4, 1fr) [mid] repeat(4, 1fr)
			[text-end] 1fr [wide-end] 1fr [end];
	}

	${(p) => p.theme.breakpoints.l} {
		grid-template-columns:
			[start] 1fr [wide-start] 1fr [text-start] repeat(3, 1fr) [mid] repeat(3, 1fr)
			[text-end] 1fr [wide-end] 1fr [end];
	}

	${(p) => p.theme.breakpoints.m} {
		grid-template-columns:
			[start wide-start] 1fr [text-start] repeat(3, 1fr) [mid] repeat(3, 1fr)
			[text-end] 1fr [wide-end end];
	}

	${(p) => p.theme.breakpoints.s} {
		grid-template-columns:
			[start wide-start text-start] repeat(3, 1fr) [mid] repeat(3, 1fr)
			[text-end wide-end end];

		${(p) => p.noPaddingOnMobile && `padding-left: 0; padding-right: 0;`}
	}

	${(p) => p.theme.breakpoints.xs} {
		grid-template-columns:
			[start wide-start text-start] repeat(2, 1fr) [mid] repeat(2, 1fr)
			[text-end wide-end end];
	}
`

export default Grid
