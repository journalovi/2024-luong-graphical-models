import { ReactNode } from 'react'
import { Script } from 'gatsby'
import { OverlayProvider } from '@react-aria/overlays'
import { SSRProvider } from '@react-aria/ssr'
import styled from 'styled-components'

import { TableOfContentsItem } from '@types'
import GlobalThemeProvider from '@utils/globalThemeProvider'
import { SettingsProvider } from '@utils/settingsContext'
import useMountEffect from '@utils/useMountEffect'

import GlobalStyles from './globalStyles'
import Nav from './nav'

export const PAGE_CONTENT_ID = 'page-content'

type Props = {
	children: ReactNode
	data: unknown
	pageContext: {
		title?: string
		isStory?: boolean
		frontmatter?: { title?: string }
	}
}

const Layout = ({ children, data }: Props): JSX.Element => {
	useMountEffect(() => {
		// Disable browser scroll restoration in favor of Gatsby's
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual'
		}

		// Remove the tabIndex attribute from .gatsby-focus-wrapper, to restore
		// normal tab focus behavior
		const gatsbyFocusWrapper = document.getElementById('gatsby-focus-wrapper')
		if (gatsbyFocusWrapper) {
			gatsbyFocusWrapper.removeAttribute('style')
			gatsbyFocusWrapper.removeAttribute('tabIndex')
		}
	})

	// eslint-disable-next-line
	const tableOfContents = (data as any)?.allMdx?.nodes?.[0].tableOfContents
		.items as TableOfContentsItem[]

	return (
		<SSRProvider>
			<SettingsProvider>
				<GlobalThemeProvider>
					<OverlayProvider>
						<GlobalStyles />
						<Script src="https://unpkg.com/focus-visible@5.2.0/dist/focus-visible.min.js" />
						<Nav
							pageTitle="Learning What’s in a Name with Graphical Models"
							tableOfContents={tableOfContents}
						/>

						<PageContent id={PAGE_CONTENT_ID} isStory>
							{children}
						</PageContent>
					</OverlayProvider>
				</GlobalThemeProvider>
			</SettingsProvider>
		</SSRProvider>
	)
}

export default Layout

const PageContent = styled('main')<{ isStory?: boolean }>`
	position: relative;
	margin: 0 auto;
	max-width: var(--max-site-width);
	padding-top: var(--nav-height);
`
