import styled from 'styled-components'

import { Theme } from '@theme'

interface TextProps {
	gridColumn?: keyof Theme['gridColumn']
}

export const Title = styled.h1<TextProps>`
	${(p) => p.theme.text.h1};
	${(p) => p.gridColumn && p.theme.gridColumn[p.gridColumn]}
`

export const Abstract = styled.p<TextProps>`
	${(p) => p.theme.text.h6}
	font-family: ${(p) => p.theme.text.body1.fontFamily};
	font-weight: 500;
	color: var(--color-heading);
	letter-spacing: -0.0075em;

	margin-top: var(--adaptive-space-3);
	margin-bottom: var(--adaptive-space-5);
	${(p) => p.gridColumn && p.theme.gridColumn[p.gridColumn]}
`

export const Heading = styled.h2<TextProps>`
	${(p) => p.theme.text.h2}
	margin-top: var(--adaptive-space-2);
	margin-bottom: var(--adaptive-space-6);
	scroll-margin-top: var(--adaptive-space-6);
	${(p) => p.gridColumn && p.theme.gridColumn[p.gridColumn]}

	/* Force line breaks after each word */
	word-spacing: 100em;
	text-align: center;

	.autolinked-header.before {
		position: absolute;
		width: 100%;
		max-width: 4rem;
		height: auto;
		top: auto;
		bottom: calc(var(--space-1-5) * -1);
		left: 50%;
		padding: 0;
		transform: translate(-50%, 100%);

		${(p) => p.theme.breakpoints.xs} {
			padding-top: 0;
		}
	}
`

export const Subheading = styled.h3<TextProps>`
	${(p) => p.theme.text.h5}
	margin-top: var(--adaptive-space-2);
	margin-bottom: var(--adaptive-space-2);
	scroll-margin-top: var(--adaptive-space-3);
	${(p) => p.gridColumn && p.theme.gridColumn[p.gridColumn]}
`

export const Body = styled.p<TextProps>`
	${(p) => p.theme.text.body1};
	margin-bottom: var(--adaptive-space-2);
	${(p) => p.gridColumn && p.theme.gridColumn[p.gridColumn]}
`

export const Link = styled.a<TextProps>`
	${(p) => p.theme.text.body1};
	color: var(--color-content-link-text);
	text-decoration-color: var(--color-content-link-underline);

	&:hover:not([data-no-underline='true']) {
		text-decoration-color: var(--color-content-link-underline-hover);
	}
`

export const Footnote = styled.sup`
	font-size: 0.5em;
`
