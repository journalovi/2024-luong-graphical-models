import styled from 'styled-components'

import Grid from '@components/grid'

const ReviewBanner = () => {
	return (
		<Grid>
			<Wrap>
				<strong>Under Review:</strong> This paper is{' '}
				<a
					href="https://www.journalovi.org/under-review.html"
					target="_blank"
					rel="noopener noreferrer"
				>
					under review
				</a>{' '}
				on the experimental track of the{' '}
				<a href="https://www.journalovi.org/" target="_blank" rel="noopener noreferrer">
					Journal of Visualization and Interaction
				</a>
				. See the{' '}
				<a
					href="https://github.com/journalovi/2024-luong-graphical-models/issues"
					target="_blank"
					rel="noopener noreferrer"
				>
					reviewing process
				</a>
				.
			</Wrap>
		</Grid>
	)
}

export default ReviewBanner

const Wrap = styled.p`
	position: relative;
	${(p) => p.theme.text.body2}
	${(p) => p.theme.gridColumn.text}
	column-gap: var(--space-0);

	margin-top: var(--adaptive-space-6);
	margin-bottom: var(--adaptive-space-2);

	&::before {
		content: '';
		position: absolute;
		top: calc(var(--adaptive-space-1-5) * -1);
		bottom: calc(var(--adaptive-space-1-5) * -1);
		left: calc(var(--adaptive-space-2) * -1);
		right: calc(var(--adaptive-space-2) * -1);
		background: var(--color-background-raised);
		border: solid 1px var(--color-line);
		border-radius: var(--border-radius-m);
		z-index: -1;
	}

	color: var(--color-text);

	a {
		text-decoration-line: underline;
		text-decoration-color: var(--color-link-underline);
	}
	a:hover {
		text-decoration-color: var(--color-link-underline-hover);
	}
`
