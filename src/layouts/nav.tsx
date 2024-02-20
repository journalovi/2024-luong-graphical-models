import { Fragment } from 'react'
import { Link } from 'gatsby'
import { useLocation } from '@reach/router'
import styled, { css } from 'styled-components'

import Grid from '@components/grid'

import { TableOfContentsItem } from '@types'

import TOCDrawer from './tocDrawer'

interface NavProps {
	pageTitle?: string
	tableOfContents?: TableOfContentsItem[]
}

const Nav = ({ pageTitle, tableOfContents }: NavProps) => {
	const location = useLocation()

	return (
		<Fragment>
			<Wrap aria-label="Navigation">
				<InnerGrid>
					<Fragment>
						<PageTitleWrap>
							<PageTitle to={location.pathname} tabIndex={-1}>
								{pageTitle}
							</PageTitle>
						</PageTitleWrap>

						{tableOfContents ? (
							<TOCDrawer items={tableOfContents} />
						) : (
							<TrailingWrap>
								<NavLink to="/projects" current={location.pathname === '/projects/'}>
									Projects
								</NavLink>
								<NavLink to="/about" current={location.pathname === '/about/'}>
									About
								</NavLink>
							</TrailingWrap>
						)}
					</Fragment>
				</InnerGrid>
			</Wrap>
		</Fragment>
	)
}

export default Nav

const Wrap = styled.nav`
	--nav-vertical-offset: -2rem;

	position: fixed;
	top: var(--nav-vertical-offset);
	left: 0;

	width: var(--nav-width);
	height: calc(var(--nav-height) - var(--nav-vertical-offset));
	z-index: var(--z-index-nav);
	padding: 2rem var(--page-margin-right) 0 var(--page-margin-left);

	&::before {
		content: '';
		${(p) => p.theme.spread};
		transition: opacity var(--animation-v-fast-out);
		background: var(--color-background);

		@supports (backdrop-filter: blur(1px)) {
			background: var(--color-background-alpha-backdrop);
			backdrop-filter: saturate(200%) blur(20px);
		}
	}

	@media print {
		display: none;
	}
`

const InnerGrid = styled(Grid)`
	align-items: center;
	position: relative;
	padding-left: 0;
	padding-right: 0;

	width: 100%;
	height: 100%;
	margin-left: auto;
	margin-right: auto;
	max-width: calc(
		var(--max-site-width) - var(--page-margin-left) - var(--page-margin-right)
	);

	&::before {
		${(p) => p.theme.spread};
		content: '';
		pointer-events: none;
		box-shadow: 0 1px 0 0 var(--color-line);

		${(p) => p.theme.breakpoints.xs} {
			left: calc(var(--page-margin-left) * -1);
			right: calc(var(--page-margin-right) * -1);
			width: calc(100% + var(--page-margin-left) + var(--page-margin-right));
		}
	}

	${(p) => p.theme.breakpoints.xs} {
		display: flex;
		gap: var(--space-2);
	}
`

const PageTitleWrap = styled.div`
	${(p) => p.theme.gridColumn.text};

	${(p) => p.theme.breakpoints.m} {
		grid-column-end: -2;
	}
	${(p) => p.theme.breakpoints.s} {
		grid-column-start: 1;
	}

	${(p) => p.theme.breakpoints.xs} {
		display: flex;
		align-items: center;
		min-width: 0;
	}
`

const PageTitle = styled(Link).withConfig({
	shouldForwardProp: (prop, defaultValidatorFn) => defaultValidatorFn(prop),
})`
	display: block;
	width: max-content;
	max-width: calc(100% + var(--space-1));

	/* Expand click area */
	padding: var(--space-1);
	margin: calc(var(--space-1) * -1);

	${(p) => p.theme.text.label};
	color: var(--color-heading);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	&:hover {
		text-decoration: none;
	}

	${(p) => p.theme.breakpoints.xs} {
		padding: var(--space-1) 0;
		margin: calc(var(--space-1) * -1) 0;
	}
`

const TrailingWrap = styled.div`
	display: contents;

	${(p) => p.theme.breakpoints.xs} {
		width: 100%;
		display: flex;
		justify-content: end;
		gap: var(--space-0-5);
		min-width: 0;
	}
`

const NavLink = styled(Link).withConfig({
	shouldForwardProp: (prop, defaultValidatorFn) => defaultValidatorFn(prop),
})<{ disabled?: boolean; current: boolean }>`
	display: block;
	white-space: nowrap;
	padding: var(--space-1);
	transform: translateX(var(--space-1));
	${(p) => p.theme.text.label};
	${(p) => p.disabled && `&& {color: inherit}`}

	&:active {
		color: var(--color-label);
	}

	${(p) =>
		p.current &&
		css`
			color: var(--color-label);
			&:hover {
				text-decoration: none;
			}
		`}

	justify-self: end;
	&:last-of-type {
		grid-column: -2;
	}
	&:nth-last-of-type(2) {
		grid-column: -3;
	}
`
