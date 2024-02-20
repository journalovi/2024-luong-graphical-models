import { ComponentType, ReactNode } from 'react'
import styled from 'styled-components'

import useIsInViewport, { UseIsInViewportProps } from '@utils/useIsInViewport'

const RenderWhenInViewportContainer = ({
	Container,
	children,
	options,
}: {
	Container: ComponentType | null
	children: ReactNode
	options: UseIsInViewportProps
}) => {
	const { containerRef, isInViewport } = useIsInViewport<HTMLDivElement>(options)

	const ContainerWrap = Container ?? DefaultContainer
	return <ContainerWrap ref={containerRef}>{isInViewport && children}</ContainerWrap>
}

/**
 * HOC to render contents only when it is in viewport.
 */
const renderWhenInViewport = <ContentProps extends object>(
	Content: ComponentType<ContentProps>,
	Container: ComponentType | null,
	options: UseIsInViewportProps = {},
) => {
	const Wrapper = (props: ContentProps) => (
		<RenderWhenInViewportContainer Container={Container} options={options}>
			<Content {...props} />
		</RenderWhenInViewportContainer>
	)

	Wrapper.displayName = 'RenderWhenInViewportWrapper'
	return Wrapper
}

export default renderWhenInViewport

const DefaultContainer = styled.div`
	display: block;
`
