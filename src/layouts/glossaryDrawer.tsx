import { Fragment } from 'react'
import styled from 'styled-components'

import Button from '@components/button'
import Popover, { usePopover } from '@components/popover'
import ScrollDivider from '@components/scrollDivider'
import ShadowRoot from '@components/shadowRoot'
import IconDictionary from '@icons/dictionary'
import BackgroundNoise from '@images/background-noise.png'

interface GlossaryEntry {
	term: string
	description: string
}

interface GlossarySection {
	title: string
	entries: GlossaryEntry[]
}

const glossary: GlossarySection[] = [
	{
		title: 'Terms',
		entries: [
			{
				term: 'clique',
				description:
					'(in graphs) a fully connected group of nodes, i.e. a complete subgraph',
			},
			{
				term: 'graphical model',
				description:
					'probabilistic model in which the conditional (in)dependencies between random variables can be represented with a graph',
			},
			{
				term: 'local normalization',
				description:
					'probability normalization applied to subsets of the graph (e.g. two consecutive hidden states) as opposed to the full graph',
			},
			{
				term: 'named entity',
				description:
					'a word or phrase that contains the name of a person, location, organization, or other miscellaneous entity',
			},
			{
				term: 'OOV',
				description: 'out-of-vocabulary, having not appeared in the training set',
			},
			{
				term: 'OOV rate',
				description:
					'(of a named entity) the number of out-of-vocabulary words divided by the total number of words in the named entity',
			},
			{
				term: 'unary',
				description:
					'(describing Conditional Random Fields) structured so that the prediction for the current hidden state relies on only one observation, usually the current one',
			},
		],
	},
	{
		title: 'Name tags',
		entries: [
			{ term: 'O', description: 'not a name' },
			{ term: 'ORG', description: 'organization name' },
			{ term: 'PER', description: 'person name' },
			{ term: 'LOC', description: 'location name' },
			{ term: 'MISC', description: 'miscellaneous entity name' },
			{
				term: 'B-[tag]',
				description:
					'first word of [tag] name, e.g. B-ORG means first word in an organization name',
			},
			{
				term: 'I-[tag]',
				description:
					'word inside [tag] name, e.g. I-ORG means a word inside an organization name',
			},
		],
	},
]

const GlossaryDrawer = () => {
	const { triggerProps, popoverProps } = usePopover({
		placement: 'bottom-end',
		offset: 4,
		resize: true,
	})

	return (
		<GlossaryControlOuterWrap role="presentation">
			<GlossaryTriggerButton
				{...triggerProps}
				id="nav-toc-trigger"
				aria-label={'Table of Contents'}
				extraSmall
			>
				<IconDictionary size="l" useAlt />
			</GlossaryTriggerButton>
			<GlossaryContainer {...popoverProps} initialFocus={-1} animateScale>
				<GlossaryBackgroundNoise aria-hidden />
				<GlossaryTitle>Glossary</GlossaryTitle>
				<GlossaryScrollWrapper paddingLeft="var(--space-3)" paddingRight="var(--space-3)">
					<GlossaryList aria-label="Glossary" tabIndex={-1}>
						{glossary.map((section, sectionIndex) => (
							<Fragment key={sectionIndex}>
								<GlossarySection key={sectionIndex}>
									<GlossarySectionTitle>{section.title}</GlossarySectionTitle>
									{section.entries.map((entry, entryIndex) => (
										<GlossaryEntry key={entryIndex}>
											<GlossaryTerm>{entry.term}</GlossaryTerm>
											<GlossaryDescription>{entry.description}</GlossaryDescription>
										</GlossaryEntry>
									))}
								</GlossarySection>
							</Fragment>
						))}
					</GlossaryList>
				</GlossaryScrollWrapper>
			</GlossaryContainer>
		</GlossaryControlOuterWrap>
	)
}

export default GlossaryDrawer

const GlossaryControlOuterWrap = styled(ShadowRoot)`
	contain: layout;
`

const GlossaryTriggerButton = styled(Button)`
	display: flex;
	gap: var(--space-0-5);
`

const GlossaryBackgroundNoise = styled.div`
	${(p) => p.theme.spread};
	background-image: url(${BackgroundNoise});
	background-size: 25px;
	background-repeat: repeat;
	opacity: 0.5;
`

const GlossaryContainer = styled(Popover)`
	display: flex;
	flex-direction: column;
	padding: 0;
	z-index: var(--z-index-toc);
	contain: content;
	transition-delay: 25ms;

	${(p) => p.theme.breakpoints.xs} {
		&.exiting {
			transition: none;
		}
	}

	background: var(--color-background);

	@supports (backdrop-filter: blur(1px)) {
		background: var(--color-background-raised-alpha-backdrop);
		backdrop-filter: saturate(200%) blur(20px);
	}
`

const GlossaryTitle = styled.p`
	${(p) => p.theme.text.h5}
	padding: var(--space-2) var(--space-3) 0;
`

const GlossaryScrollWrapper = styled(ScrollDivider)``

const GlossaryList = styled.dl`
	display: flex;
	flex-direction: column;
	padding: var(--space-1) var(--space-3) var(--space-2);
	margin: 0;
`

const GlossarySection = styled.div`
	padding: var(--space-1) 0;
`

const GlossarySectionTitle = styled.p`
	${(p) => p.theme.text.h6}
	margin-bottom: var(--space-1);
`

const GlossaryEntry = styled.div`
	display: flex;
	width: 28em;
	max-width: 100%;
	gap: var(--space-1);
	padding: var(--space-1) 0;

	&:not(:last-child) {
		border-bottom: 1px solid var(--color-line-subtle);
	}
`

const GlossaryTerm = styled.dt`
	display: flex;
	color: currentcolor;
	min-width: 8em;
`

const GlossaryDescription = styled.dd`
	display: flex;
	color: var(--color-label);
	margin: 0;
`
