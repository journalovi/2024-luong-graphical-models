import {
	Dispatch,
	Key,
	SetStateAction,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useRadio, useRadioGroup } from '@react-aria/radio'
import { useCollection } from '@react-stately/collections'
import { ListCollection } from '@react-stately/list'
import { RadioGroupState, useRadioGroupState } from '@react-stately/radio'
import { AriaRadioGroupProps, AriaRadioProps } from '@react-types/radio'
import { CollectionBase, Node } from '@react-types/shared'
import styled from 'styled-components'

import { isDefined } from '@utils/functions'
import useSize from '@utils/useSize'

export { Item } from '@react-stately/collections'

type Position = { left: number; width: number }
type PositionMap = Record<string, Position>

const factory = (nodes: Iterable<Node<object>>) => new ListCollection(nodes)

interface SegmentedControlProps<Value>
	extends CollectionBase<object>,
		Omit<AriaRadioGroupProps, 'value' | 'defaultValue' | 'onChange'> {
	value?: Value
	defaultValue?: Value
	onChange?: (value: Value) => void
	moveLeft?: boolean
}

const SegmentedControl = <Value extends string>({
	moveLeft,
	...props
}: SegmentedControlProps<Value>) => {
	const ref = useRef<HTMLDivElement>(null)

	const collection = useCollection(props, factory)
	const collectionList = useMemo(() => [...collection], [collection])
	const lastKey = useMemo(() => collection.getLastKey(), [collection])

	const ariaProps = useMemo(
		() => ({
			...props,
			onChange: props.onChange as AriaRadioGroupProps['onChange'],
		}),
		[props],
	)
	const state = useRadioGroupState(ariaProps)
	const { radioGroupProps } = useRadioGroup(
		{ ...ariaProps, orientation: 'horizontal' },
		state,
	)

	// Initialize lookup table that describes the position
	// of each render radio element, useful for animating <Handle />
	const [positionMap, setPositionMap] = useState<PositionMap>({})
	const indicatorPosition = useMemo(
		() =>
			positionMap[state.selectedValue as keyof PositionMap] ?? {
				width: 0,
				height: 0,
			},
		[positionMap, state.selectedValue],
	)

	return (
		<SegmentedControlWrap moveLeft={moveLeft} {...radioGroupProps} ref={ref}>
			{[...collectionList].map((option, i) => (
				<SegmentedControlItem
					{...option}
					key={option.key}
					value={String(option.key)}
					state={state}
					nextKey={collectionList[i + 1]?.key}
					lastKey={lastKey}
					setPositionMap={setPositionMap}
				>
					{option.rendered}
				</SegmentedControlItem>
			))}
			<Indicator {...indicatorPosition} />
		</SegmentedControlWrap>
	)
}

export default SegmentedControl

interface SegmentedControlItemProps extends Omit<Node<object>, 'value'>, AriaRadioProps {
	state: RadioGroupState
	lastKey: Key
	nextKey?: Key
	setPositionMap: Dispatch<SetStateAction<PositionMap>>
}

const SegmentedControlItem = ({
	lastKey,
	nextKey,
	state,
	setPositionMap,
	...props
}: SegmentedControlItemProps) => {
	const wrapRef = useRef<HTMLLabelElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const { inputProps } = useRadio(props, state, inputRef)

	const isSelected = useMemo(
		() => state.selectedValue === props.value,
		[state.selectedValue, props.value],
	)
	const isLastOption = useMemo(() => props.value === lastKey, [lastKey, props.value])
	const nextOptionIsSelected = useMemo(
		() => state.selectedValue === nextKey,
		[state.selectedValue, nextKey],
	)

	const { width } = useSize(wrapRef)
	useLayoutEffect(() => {
		if (!wrapRef.current || !width) return
		const parentLeft = wrapRef.current.offsetParent?.getBoundingClientRect().left ?? 0
		const left = wrapRef.current.getBoundingClientRect().left ?? 0

		setPositionMap((cur) => ({
			...cur,
			[props.value]: {
				left: Math.round((left - parentLeft) * 100) / 100,
				width: Math.round(width * 100) / 100,
			},
		}))
	}, [width, props.value, setPositionMap])

	return (
		<SegmentedControlItemWrap isSelected={isSelected} ref={wrapRef}>
			<SegmentedControlItemInput {...inputProps} ref={inputRef} />
			{props.children}
			<Divider
				visible={!isSelected && !nextOptionIsSelected && !isLastOption}
				role="presentation"
			/>
		</SegmentedControlItemWrap>
	)
}

const SegmentedControlWrap = styled.div<{ moveLeft?: boolean }>`
	position: relative;
	display: inline-flex;
	background: var(--color-background-recessed-lower);
	box-shadow: inset var(--box-shadow-s);
	border-radius: var(--border-radius-m);
	white-space: nowrap;
	contain: content;

	${(p) => p.moveLeft && `transform: translateX(-var(--space-0))`}
`

const Indicator = styled.div<{ left?: number; width?: number }>`
	position: absolute;
	top: 2px;
	left: 2px;
	height: calc(100% - 4px);
	background: var(--color-background-raised-higher);
	border-radius: calc(var(--border-radius-m) - 2px);
	box-shadow: var(--box-shadow-m);
	opacity: 0;
	transition: transform var(--animation-fast-out), width var(--animation-fast-out),
		opacity var(--animation-fast-out);

	${(p) =>
		isDefined(p.left) &&
		isDefined(p.width) &&
		`
		opacity: 1;
		transform: translateX(${p.left}px);
		width: ${p.width - 4}px;
	`}

	@media (prefers-reduced-motion) {
		display: none;
	}
`

const SegmentedControlItemWrap = styled.label<{ isSelected: boolean }>`
	position: relative;
	display: block;
	padding: var(--space-0-5) var(--space-2);
	cursor: pointer;
	user-select: none;

	&:hover {
		color: var(--color-heading);
	}

	@media (prefers-reduced-motion) {
		&::after {
			content: '';
			position: absolute;
			top: 2px;
			left: 2px;
			width: calc(100% - 4px);
			height: calc(100% - 4px);
			border-radius: calc(var(--border-radius-m) - 2px);
			background: var(--color-background-raised-higher);
			box-shadow: var(--box-shadow-m);
			z-index: -1;
			opacity: 0;
			transition: opacity var(--animation-medium-out);
		}
	}

	${(p) =>
		p.isSelected &&
		`
		color: var(--color-heading);
		text-shadow: var(--box-shadow-text);
		z-index: 1;

		@media (prefers-reduced-motion) {
			&::after {
				opacity: 1;
			}
		}
	`}
`

const SegmentedControlItemInput = styled.input`
	appearance: none;
	position: absolute;
	inset: 0;
	padding: 0;
	margin: 0 1px;
	border-radius: var(--border-radius-m);
	transition: box-shadow var(--animation-fast-out);
	cursor: pointer;
	z-index: -1;

	&.focus-visible {
		box-shadow: inset 0 0 0 2px var(--color-focus), 0 0 0 1px var(--color-focus);
	}
`

const Divider = styled.div<{ visible: boolean }>`
	position: absolute;
	top: 50%;
	right: 0;
	width: 0;
	height: 50%;
	transform: translateY(-50%);
	border-right: solid 1px var(--color-line);
	transition: opacity var(--animation-medium-out);

	${(p) => !p.visible && `opacity: 0;`}
`
