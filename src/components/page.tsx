import { HTMLAttributes } from 'react'
import styled from 'styled-components'

import Footer from '@components/footer'

const Page = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<PageContent {...props}>
			{children}
			<Footer />
		</PageContent>
	)
}

export default Page

const PageContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: calc(100vh - var(--nav-height));
`
