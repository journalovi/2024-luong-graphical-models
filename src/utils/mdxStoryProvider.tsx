import { ReactNode } from 'react'
import { MDXProvider } from '@mdx-js/react'
import styled from 'styled-components'

import Figure from '@components/figure'
import Grid from '@components/grid'
import { Citation, References, ReferencesProvider } from '@components/references'
import SectionDivider from '@components/sectionDivider'
import * as Story from '@components/story'

interface MDXComponentProps {
	children?: ReactNode
}

const Header = ({ children, ...props }: MDXComponentProps) => (
	<HeaderWrap as="header" {...props}>
		{children}
	</HeaderWrap>
)
const Title = ({ children, ...props }: MDXComponentProps) => (
	<Grid>
		<Story.Title gridColumn="text" {...props}>
			{children}
		</Story.Title>
	</Grid>
)
const Abstract = ({ children, ...props }: MDXComponentProps) => (
	<Grid>
		<Story.Abstract gridColumn="text" {...props}>
			{children}
		</Story.Abstract>
	</Grid>
)
const SectionHeading = ({ children, ...props }: MDXComponentProps) => (
	<Grid>
		<Story.Heading gridColumn="text" {...props}>
			{children}
		</Story.Heading>
	</Grid>
)
const SectionSubHeading = ({ children, ...props }: MDXComponentProps) => (
	<Grid>
		<Story.Subheading gridColumn="text" {...props}>
			{children}
		</Story.Subheading>
	</Grid>
)
const Body = ({ children, ...props }: MDXComponentProps) => (
	<Grid role="presentation">
		<Story.Body gridColumn="text" {...props}>
			{children}
		</Story.Body>
	</Grid>
)

interface MDXStoryProviderProps {
	children?: ReactNode
	references?: CSL.Data[]
}

const MDXStoryProvider = ({ references = [], children }: MDXStoryProviderProps) => (
	<MDXProvider
		components={{
			h1: Title,
			h2: SectionHeading,
			h3: SectionSubHeading,
			p: Body,
			a: Story.Link,
			sup: Story.Footnote,
			hr: () => <SectionDivider />,
			Header,
			Abstract,
			Figure,
			Grid,
			Citation,
			References,
		}}
	>
		<ReferencesProvider references={references}>{children}</ReferencesProvider>
	</MDXProvider>
)

export default MDXStoryProvider

const HeaderWrap = styled.header`
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	padding-top: var(--adaptive-space-6);
	padding-bottom: var(--adaptive-space-5);
`
