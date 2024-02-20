import { Fragment } from 'react'
import { AriaListBoxSectionProps, useListBoxSection } from '@react-aria/listbox'
import { useSeparator } from '@react-aria/separator'
import { ListState } from '@react-stately/list'
import { Node } from '@react-types/shared'
import styled from 'styled-components'

import Option from '@components/listBox/option'

interface ListBoxSectionProps extends AriaListBoxSectionProps {
	section: Node<unknown>
	state: ListState<unknown>
	small: boolean
}

const Section = ({ section, state, small }: ListBoxSectionProps) => {
	const { itemProps, headingProps, groupProps } = useListBoxSection({
		heading: section.rendered,
		'aria-label': section['aria-label'],
	})

	const { separatorProps } = useSeparator({ elementType: 'li' })

	return (
		<Fragment>
			{section.key !== state.collection.getFirstKey() && (
				<Separator {...separatorProps} />
			)}
			<Wrap {...itemProps}>
				{section.rendered && <Title {...headingProps}>{section.rendered}</Title>}
				<Group {...groupProps}>
					{[...section.childNodes].map((node) => (
						<Option key={node.key} item={node} state={state} small={small} />
					))}
				</Group>
			</Wrap>
		</Fragment>
	)
}

export default Section

const Separator = styled.li`
	border-bottom: solid 1px var(--color-line);
	margin: var(--space-0) var(--space-1);
`
const Wrap = styled.li`
	padding: var(--space-0) 0;
`

const Title = styled.p`
	&& {
		${(p) => p.theme.text.label}
	}
	color: var(--color-label);
	margin-left: var(--space-1);
	margin-bottom: var(--space-0);
`

const Group = styled.ul``
