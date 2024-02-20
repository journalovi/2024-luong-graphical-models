import { ComponentProps, Fragment, Key, useCallback } from 'react'
import { AriaSelectProps, HiddenSelect, useSelect } from '@react-aria/select'
import { mergeProps } from '@react-aria/utils'
import { Item, Section } from '@react-stately/collections'
import { useSelectState } from '@react-stately/select'
import styled from 'styled-components'

import Button from '@components/button'
import Dialog from '@components/dialog'
import Field, { FieldProps } from '@components/fields/field'
import ListBox from '@components/listBox'
import Popover, { usePopover } from '@components/popover'

import { isDefined } from '@utils/functions'
import useBreakpoint from '@utils/useBreakpoint'

export { Item, Section }

export interface SelectProps<Value extends Key>
	extends FieldProps,
		Omit<
			AriaSelectProps<{ key: Value; label: string }>,
			'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange'
		> {
	value?: Value
	defaultValue?: Value
	onChange?: (value: Value) => void
	showDialogOnMobile?: boolean
	popoverProps?: Partial<ComponentProps<typeof Popover>>
	className?: string
}

const Select = <Value extends Key>({
	className,
	rowLayout,
	small = false,
	skipFieldWrapper = false,
	showDialogOnMobile = false,
	value,
	defaultValue,
	onChange,
	...props
}: SelectProps<Value>) => {
	const { label, name } = props
	const ariaProps = {
		selectedKey: value,
		defaultSelectedKey: defaultValue,
		onSelectionChange: onChange as AriaSelectProps<object>['onSelectionChange'],
		...props,
	}

	const state = useSelectState(ariaProps)

	const { refs, triggerProps, popoverProps } = usePopover<HTMLButtonElement>({
		open: state.isOpen,
		onOpenChange: (open) => state.setOpen(open),
		placement: rowLayout ? 'bottom-end' : 'bottom-start',
	})

	const {
		triggerProps: selectTriggerProps,
		valueProps,
		menuProps,
		labelProps,
	} = useSelect(ariaProps, state, refs.trigger)

	const renderTrigger = useCallback(() => {
		return (
			<StyledButton
				small={small}
				showBorder={isDefined(label)}
				showExpandIcon
				{...mergeProps(selectTriggerProps, triggerProps, valueProps)}
			>
				{state.selectedItem ? state.selectedItem.rendered : 'Select an option'}
			</StyledButton>
		)
	}, [triggerProps, selectTriggerProps, small, valueProps, label, state.selectedItem])

	const renderContent = useCallback(
		() => (
			<ListBox state={state} label={label} small={small} shouldFocusWrap {...menuProps} />
		),
		[label, menuProps, small, state],
	)

	const isXS = useBreakpoint('xs')
	return (
		<Field
			label={label}
			labelProps={labelProps}
			rowLayout={rowLayout}
			small={small}
			skipFieldWrapper={skipFieldWrapper}
			className={className}
		>
			<HiddenSelect state={state} triggerRef={refs.trigger} label={label} name={name} />
			{showDialogOnMobile && isXS ? (
				<Dialog
					isOpen={state.isOpen}
					open={() => state.open()}
					close={() => state.close()}
					trigger={renderTrigger}
					triggerRef={refs.trigger}
					title={label as string}
					content={renderContent()}
					contentProps={{ compact: true, onClose: () => state.close() }}
				/>
			) : (
				<Fragment>
					{renderTrigger()}
					<Popover {...popoverProps}>{renderContent()}</Popover>
				</Fragment>
			)}
		</Field>
	)
}

export default Select

const StyledButton = styled(Button)`
	font-weight: 400;
`
