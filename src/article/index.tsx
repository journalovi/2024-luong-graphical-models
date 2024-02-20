import { PageProps } from 'gatsby'

import Page from '@components/page'
import SEO from '@components/seo'

import MDXStoryProvider from '@utils/mdxStoryProvider'

import Content from './content.mdx'
import references from './references.csl.json'

const Component = () => {
	return (
		<Page>
			<MDXStoryProvider references={references}>
				<Content />
			</MDXStoryProvider>
		</Page>
	)
}

export default Component

export const Head = ({ pageContext }: PageProps) => (
	<SEO {...pageContext}>
		<link
			rel="preload"
			href="/fonts/domaine-display-condensed/DomaineDisplayCondensed-Semibold.woff2"
			as="font"
			type="font/woff2"
			crossOrigin="anonymous"
		/>
		<link
			rel="preload"
			href="/fonts/domaine-display-condensed/DomaineDisplayCondensed-Semibold.woff"
			as="font"
			type="font/woff"
			crossOrigin="anonymous"
		/>
		<link
			rel="preload"
			href="/fonts/domaine-display-condensed/DomaineDisplayCondensed-Bold.woff2"
			as="font"
			type="font/woff2"
			crossOrigin="anonymous"
		/>
		<link
			rel="preload"
			href="/fonts/domaine-display-condensed/DomaineDisplayCondensed-Bold.woff"
			as="font"
			type="font/woff"
			crossOrigin="anonymous"
		/>
		<link
			rel="preload"
			href="/fonts/domaine-text/DomaineText-Regular.woff2"
			as="font"
			type="font/woff2"
			crossOrigin="anonymous"
		/>
		<link
			rel="preload"
			href="/fonts/domaine-text/DomaineText-Regular.woff"
			as="font"
			type="font/woff"
			crossOrigin="anonymous"
		/>
		<link
			rel="preload"
			href="/fonts/domaine-text/DomaineText-RegularItalic.woff2"
			as="font"
			type="font/woff2"
			crossOrigin="anonymous"
		/>
		<link
			rel="preload"
			href="/fonts/domaine-text/DomaineText-RegularItalic.woff"
			as="font"
			type="font/woff"
			crossOrigin="anonymous"
		/>
	</SEO>
)
