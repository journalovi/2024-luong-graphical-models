import styled from 'styled-components'

import Grid from '@components/grid'

const Footer = () => {
	return (
		<Grid>
			<FooterSectionWrap>
				<FooterSectionHeader>Research Materials Statement</FooterSectionHeader>
				<FooterSectionContent>
					<strong>Article:</strong> this web article was written with React and built
					using Gatsby. It&apos;s source code is available{' '}
					<a
						href="https://github.com/vuluongj20/graphical-models-jovi"
						target="_blank"
						rel="noopener noreferrer"
					>
						on GitHub.
					</a>
				</FooterSectionContent>
				<FooterSectionContent>
					<strong>Models:</strong> Jupyter notebooks for training and validating the three
					models mentioned in this article are availabe{' '}
					<a href="https://osf.io/hvma6/" target="_blank" rel="noopener noreferrer">
						on OSF.
					</a>
				</FooterSectionContent>
				<FooterSectionContent>
					<strong>Data:</strong> all three models were trained and evaluated on the{' '}
					<a
						href="https://aclanthology.org/W03-0419.pdf"
						target="_blank"
						rel="noopener noreferrer"
					>
						CoNLL-2003 dataset.
					</a>
				</FooterSectionContent>
			</FooterSectionWrap>

			<FooterSectionWrap>
				<FooterSectionHeader>Authorship</FooterSectionHeader>
				<FooterSectionContent>
					<strong>Vu Luong (Minerva University):</strong> conceptualization, methodology,
					investigation, software, visualization, writing – original draft.
				</FooterSectionContent>
				<FooterSectionContent>
					<strong>Justin Selig (Cornell University):</strong> conceptualization, writing –
					review & editing.
				</FooterSectionContent>
			</FooterSectionWrap>

			<FooterSectionWrap>
				<FooterSectionHeader>License</FooterSectionHeader>
				<FooterSectionContent>
					This work is licensed under a{' '}
					<a
						href="http://creativecommons.org/licenses/by/4.0/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Creative Commons Attribution 4.0 International License.
					</a>
				</FooterSectionContent>
			</FooterSectionWrap>

			<FooterSectionWrap>
				<FooterSectionHeader>Conflicts of Interest</FooterSectionHeader>
				<FooterSectionContent>
					The authors declare that there are no competing interests.
				</FooterSectionContent>
			</FooterSectionWrap>
		</Grid>
	)
}

export default Footer

export const FooterSectionWrap = styled.section`
	${(p) => p.theme.gridColumn.text}
	margin-bottom: var(--adaptive-space-6);
`

export const FooterSectionHeader = styled.h2`
	${(p) => p.theme.text.h4}
	margin-bottom: var(--space-1-5);
	color: var(--color-label);
	scroll-margin-top: var(--adaptive-space-3);
`

export const FooterSectionContent = styled.p`
	${(p) => p.theme.text.body2}
	margin-bottom: var(--space-1);

	&,
	a {
		${(p) => p.theme.text.body2}
		color: var(--color-label);
	}

	strong {
		color: var(--color-label);
	}

	a {
		text-decoration-line: underline;
		text-decoration-color: var(--color-link-underline);
	}
	a:hover {
		text-decoration-color: var(--color-link-underline-hover);
	}
`
