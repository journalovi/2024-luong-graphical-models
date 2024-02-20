import { useRef } from 'react'
import { AriaTextFieldProps, useTextField } from '@react-aria/textfield'
import styled from 'styled-components'

import Field, { FieldProps } from '@components/fields/field'

interface TextFieldProps extends FieldProps, AriaTextFieldProps {
	size?: number
	small?: boolean
	inputWidth?: string
	className?: string
}

const TextInput = ({
	className,
	rowLayout,
	inputWidth,
	small = false,
	skipFieldWrapper = false,
	size,
	...props
}: TextFieldProps) => {
	const { label, description } = props
	const ref = useRef<HTMLInputElement>(null)

	const { labelProps, descriptionProps, inputProps } = useTextField(props, ref)

	return (
		<Field
			label={label}
			labelProps={labelProps}
			description={description}
			descriptionProps={descriptionProps}
			rowLayout={rowLayout}
			small={small}
			skipFieldWrapper={skipFieldWrapper}
			className={className}
		>
			<Input
				ref={ref}
				small={small}
				displayWidth={inputWidth}
				size={size}
				{...inputProps}
			/>
		</Field>
	)
}

export default TextInput

const Input = styled.input<{ small: boolean; displayWidth?: string }>`
	background: var(--color-background-recessed);
	border-radius: var(--border-radius-s);
	border: solid 1px var(--color-line);
	padding: ${(p) => (p.small ? 'var(--space-0) var(--space-1)' : 'var(--space-1)')};

	${(p) => p.displayWidth && `width: ${p.displayWidth}`}
`
