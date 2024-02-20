import styled from 'styled-components'

export const Table = styled.table`
	width: 100%;
	border-spacing: 0;
`

export const TableHead = styled.thead`
	th {
		color: var(--color-label);
		border-bottom: solid 1px var(--color-line);
		white-space: nowrap;
	}
`

export const TableBody = styled.tbody`
	& > tr:first-of-type > th,
	& > tr:first-of-type > td {
		padding-top: var(--space-1);
	}
`

export const TableFoot = styled.tfoot``

export const TR = styled.tr`
	& > th:first-child,
	& > td:first-child {
		padding-left: 0;
	}

	& > th:last-child,
	& > td:last-child {
		padding-right: 0;
	}

	/* Row background */
	&:nth-of-type(2n) > th,
	&:nth-of-type(2n) > td {
		position: relative;
		z-index: 1;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background-color: var(--color-background-recessed-lower);
			z-index: -1;
		}

		&:first-child::before {
			left: calc(var(--space-1-5) * -1);
			border-top-left-radius: var(--border-radius-s);
			border-bottom-left-radius: var(--border-radius-s);
		}
		&:last-child::before {
			right: calc(var(--space-1-5) * -1);
			border-top-right-radius: var(--border-radius-s);
			border-bottom-right-radius: var(--border-radius-s);
		}
	}
`

export type Alignment = 'left' | 'right'

export const TH = styled.th<{ align?: Alignment }>`
	font-weight: 400;
	padding: var(--space-0) var(--space-1-5);
	${(p) => p.align && `text-align: ${p.align};`}

	& > span {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	${(p) => p.theme.breakpoints.xs} {
		padding: var(--space-0) var(--space-1);
	}
`

export const TD = styled.td<{ align?: Alignment }>`
	font-weight: 400;
	padding: var(--space-0) var(--space-1-5);
	${(p) => p.align && `text-align: ${p.align};`}

	${(p) => p.theme.breakpoints.xs} {
		padding: var(--space-0) var(--space-1);
	}
`
