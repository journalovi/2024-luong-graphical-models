import { useRef } from 'react'
import { useLocale } from '@react-aria/i18n'
import { AriaNumberFieldProps, useNumberField } from '@react-aria/numberfield'
import { useNumberFieldState } from '@react-stately/numberfield'
import styled from 'styled-components'

import Button from '@components/button'
import Field, { FieldProps } from '@components/fields/field'
import IconChevronDown from '@icons/chevronDown'
import IconChevronUp from '@icons/chevronUp'

interface NumberFieldProps extends FieldProps, AriaNumberFieldProps {
	inputWidth?: string
	small?: boolean
	className?: string
}

const TextInput = ({
	className,
	rowLayout,
	inputWidth,
	small = false,
	skipFieldWrapper = false,
	...props
}: NumberFieldProps) => {
	const { label, description } = props
	const { locale } = useLocale()
	const inputRef = useRef<HTMLInputElement>(null)
	const incrRef = useRef<HTMLButtonElement>(null)
	const decRef = useRef<HTMLButtonElement>(null)

	const state = useNumberFieldState({ ...props, locale })
	const {
		labelProps,
		descriptionProps,
		groupProps,
		inputProps,
		incrementButtonProps,
		decrementButtonProps,
	} = useNumberField(props, state, inputRef)

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
			<Group {...groupProps}>
				<Input ref={inputRef} small={small} displayWidth={inputWidth} {...inputProps} />
				<IncDecWrap>
					<IncDecButton ref={incrRef} {...incrementButtonProps}>
						<IconChevronUp size="xs" />
					</IncDecButton>
					<IncDecButton ref={decRef} {...decrementButtonProps}>
						<IconChevronDown size="xs" />
					</IncDecButton>
				</IncDecWrap>
			</Group>
		</Field>
	)
}

export default TextInput

const Group = styled.div`
	position: relative;
`

const IncDecWrap = styled.div`
	position: absolute;
	right: 1px;
	top: 50%;
	transform: translateY(-50%);
	height: calc(100% - 2px);
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-left: solid 1px var(--color-line);
`

const IncDecButton = styled(Button)`
	height: 50%;
	padding: 0;
	background: var(--color-background);
	border-radius: 0;
	:not(:first-child) {
		border-top: solid 1px var(--color-line);
	}

	/* Fix Safari flicker */
	transform: translateZ(0);

	:first-child {
		border-top-right-radius: calc(var(--border-radius-s) - 1px);
	}
	:last-child {
		border-bottom-right-radius: calc(var(--border-radius-s) - 1px);
	}
`

const Input = styled.input<{ small: boolean; displayWidth?: string }>`
	appearance: none;
	background: var(--color-background-recessed);
	border-radius: var(--border-radius-s);
	border: solid 1px var(--color-line);
	padding: ${(p) => (p.small ? 'var(--space-0) var(--space-1)' : 'var(--space-1)')};
	padding-right: var(--space-3);

	${(p) => p.displayWidth && `width: ${p.displayWidth}`}
`
