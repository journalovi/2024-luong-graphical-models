import {
	forwardRef,
	ForwardRefRenderFunction,
	HTMLAttributes,
	ReactNode,
	RefObject,
	useRef,
} from 'react'
import { useButton } from '@react-aria/button'
import { mergeProps } from '@react-aria/utils'
import { AriaButtonProps } from '@react-types/button'
import styled from 'styled-components'

import StateLayer from '@components/stateLayer'
import IconChevronDown from '@icons/chevronDown'

export interface ButtonProps extends AriaButtonProps {
	children: ReactNode
	onClick?: AriaButtonProps['onPress']
	title?: string
	primary?: boolean
	filled?: boolean
	small?: boolean
	extraSmall?: boolean
	showBorder?: boolean
	showExpandIcon?: boolean
	hideStateLayer?: boolean
	/**
	 * Props to pass directly to the button element, bypassing `useButton()`.
	 */
	directProps?: Partial<HTMLAttributes<HTMLButtonElement>>
	className?: string
}

const BaseButton: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
	{
		children,
		onPress,
		onClick,
		title,
		className,
		primary = false,
		filled = false,
		small = false,
		extraSmall = false,
		showBorder = false,
		showExpandIcon = false,
		hideStateLayer = false,
		directProps = {},
		...props
	},
	forwardedRef,
) => {
	const innerRef = useRef<HTMLButtonElement>(null)
	const ref = (forwardedRef ?? innerRef) as RefObject<HTMLButtonElement>

	const { buttonProps, isPressed } = useButton(
		{ ...props, onPress: onPress ?? onClick },
		ref,
	)

	return (
		<Wrap
			ref={ref}
			primary={primary}
			filled={filled}
			small={small}
			extraSmall={extraSmall}
			showBorder={showBorder}
			showExpandIcon={showExpandIcon}
			className={className}
			title={title}
			{...mergeProps(buttonProps, directProps)}
		>
			{!hideStateLayer && (
				<StateLayer borderWidth={showBorder ? 1 : 0} isPressed={isPressed} />
			)}
			{children}
			{showExpandIcon && <IconChevronDown aria-hidden="true" />}
		</Wrap>
	)
}

export default forwardRef(BaseButton)

const Wrap = styled.button<{
	primary: boolean
	filled: boolean
	small: boolean
	extraSmall: boolean
	showBorder: boolean
	showExpandIcon: boolean
}>`
	display: flex;
	align-items: center;
	position: relative;

	appearance: none;
	border: none;
	cursor: pointer;
	border-radius: var(--border-radius-s);
	padding: ${(p) =>
		p.extraSmall
			? `var(--space-0) var(--space-0-5)`
			: p.small
			? `var(--space-0-5) var(--space-1)`
			: `var(--space-1) var(--space-1-5)`};
	background-color: ${(p) =>
		p.filled
			? p.primary
				? 'var(--color-primary-opaque-background)'
				: 'var(--color-line)'
			: 'transparent'};
	transition: color, box-shadow var(--animation-v-fast-out);

	${(p) => p.theme.text.label};
	white-space: nowrap;
	color: ${(p) =>
		p.primary ? 'var(--color-primary-text)' : 'var(--color-button-label)'};

	&:hover {
		color: ${(p) => (p.primary ? 'var(--color-primary-text)' : 'var(--color-heading)')};
	}

	&:focus {
		outline: none;
	}
	&.focus-visible {
		${(p) => p.theme.focusVisible};
	}

	${(p) => p.showExpandIcon && `padding-right: var(--space-0-5);`}
	${(p) => p.showBorder && `border: solid 1px var(--color-line)`};
`
