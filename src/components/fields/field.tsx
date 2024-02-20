import { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

import { isDefined } from '@utils/functions'

export interface FieldProps {
	rowLayout?: boolean
	small?: boolean
	skipFieldWrapper?: boolean
}

interface _FieldProps extends HTMLAttributes<HTMLDivElement>, FieldProps {
	label?: ReactNode
	description?: ReactNode
	labelProps?: HTMLAttributes<HTMLLabelElement>
	descriptionProps?: HTMLAttributes<HTMLParagraphElement>
}

const Field = ({
	label,
	labelProps = {},
	description,
	descriptionProps = {},
	rowLayout = false,
	small = false,
	skipFieldWrapper = false,
	children,
	...props
}: _FieldProps) => {
	if (skipFieldWrapper) {
		return <InputWrap rowLayout={false}>{children}</InputWrap>
	}

	return (
		<Wrap rowLayout={rowLayout} small={small} {...props}>
			{isDefined(label) && (
				<Label rowLayout={rowLayout} {...labelProps}>
					{label}
				</Label>
			)}
			{isDefined(description) && (
				<Description rowLayout={rowLayout} {...descriptionProps}>
					{description}
				</Description>
			)}
			<InputWrap rowLayout={rowLayout}>{children}</InputWrap>
		</Wrap>
	)
}

export default Field

const Wrap = styled.div<{ rowLayout: boolean; small: boolean }>`
	${(p) =>
		p.rowLayout
			? `
					display: grid;
					grid-column-gap: var(--space-2);
					grid-row-gap: var(--space-0);
					grid-template-columns: 1fr max-content;
					align-items: center;
					justify-items: end;
					padding: var(--space-2) 0;

					:not(:last-child) {
						border-bottom: solid 1px var(--color-line);
					}
			`
			: `
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					padding: var(--space-1) 0;
				`}
`

const Label = styled.label<{ rowLayout: boolean }>`
	justify-self: start;
	${(p) => !p.rowLayout && p.theme.text.label}
	${(p) =>
		!p.rowLayout &&
		`
		display: block; 
		margin-bottom: var(--space-0);
	`}
`

const Description = styled.small<{ rowLayout: boolean }>`
	grid-row: 2;
	justify-self: start;

	${(p) => p.theme.text.small};
	color: var(--color-label);

	${(p) =>
		!p.rowLayout &&
		`
		display: block; 
		margin-bottom: var(--space-0);
	`}
`

const InputWrap = styled.div<{ rowLayout: boolean }>`
	${(p) =>
		p.rowLayout &&
		`
			height: 0;
			display: flex;
			align-items: center;
		`};
`
