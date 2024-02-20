import { Fragment, useContext, useMemo } from 'react'
import styled from 'styled-components'

import Divider from '@components/divider'
import { ReferencesContext } from '@components/references/provider'
import { formatReferences } from '@components/references/utils'
import Tooltip from '@components/tooltip'

interface CitationProps {
	citeItems: {
		id: string
		referenceId: string
		referenceNumber: number
		suppressAuthor?: boolean
		prefix?: string
		suffix?: string
	}[]
}

export const Citation = ({ citeItems }: CitationProps) => {
	const references = useContext(ReferencesContext)

	const citedReferences = useMemo(
		() =>
			citeItems
				.map(({ referenceId }) =>
					references.find((reference) => reference.id === referenceId),
				)
				.filter((reference): reference is CSL.Data => !!reference),
		[references, citeItems],
	)

	const formattedReferences = formatReferences(citedReferences)

	return (
		<Tooltip
			content={formattedReferences.map((formattedText, i) => (
				<Fragment key={i}>
					<CitationText dangerouslySetInnerHTML={{ __html: formattedText }} />
					{i < formattedReferences.length - 1 && <StyledDivider asSpan />}
				</Fragment>
			))}
			maxWidth="28rem"
			renderWrapperAsSpan
			renderOverlayAsSpan
			delay={{ open: 0, close: 250 }}
			offset={6}
		>
			{(tooltipProps) => (
				<Wrap {...tooltipProps}>
					{citeItems.length > 1 ? (
						citeItems.map(({ id, referenceId, referenceNumber }, i) => (
							<CitationLink
								data-citation-group-index={i}
								key={referenceId}
								id={`citation-${referenceId}-${id}`}
								href={`#reference-${referenceId}`}
							>
								{i === 0 && '['}
								{i > 0 && i < citeItems.length ? ' ' : ''}
								{referenceNumber}
								{i < citeItems.length - 1 ? ',' : ']'}
							</CitationLink>
						))
					) : (
						<CitationLink
							data-citation-group-index={0}
							id={`citation-${citeItems[0].referenceId}-${citeItems[0].id}`}
							href={`#reference-${citeItems[0].referenceId}`}
						>
							[{citeItems[0].referenceNumber}]
						</CitationLink>
					)}
				</Wrap>
			)}
		</Tooltip>
	)
}

const Wrap = styled.sup`
	display: inline;
	vertical-align: text-bottom;
	white-space: nowrap;
`

const CitationLink = styled.a`
	font-family: inherit;
	color: var(--color-label);
	scroll-margin-top: var(--adaptive-space-0);

	&:hover,
	&:target:focus,
	&.focus-visible {
		color: var(--color-content-link-text);
		text-decoration-color: var(--color-content-link-underline);
	}

	&:target:focus,
	&.focus-visible {
		${(p) => p.theme.focusVisible};
		text-decoration: none;
	}
`

const CitationText = styled.span`
	${(p) => p.theme.text.body2};
	display: block;
	position: relative;
	text-align: left;
	margin: var(--space-0-5);
	padding-left: var(--space-0);

	b {
		font-weight: 500;
		color: var(--color-heading);
		transition: color var(--animation-medium-out);
	}
	br {
		margin-bottom: var(--space-0);
	}
	a {
		position: relative;
		color: var(--color-label);
		text-decoration: underline;
		text-decoration-color: var(--color-link-underline);

		&:hover,
		&.focus-visible {
			color: var(--color-content-link-text);
			text-decoration-color: var(--color-content-link-underline);

			::before {
				color: var(--color-label);
			}
		}

		&::before {
			content: ' —  ';
			color: var(--color-label);
			white-space: pre;
			display: inline-block;
			text-decoration: none;
			opacity: 0.5;
		}
	}
`

const StyledDivider = styled(Divider)`
	margin: var(--space-1) var(--space-0-5);
`
