import {
	Dispatch,
	Fragment,
	ReactNode,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
} from 'react'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import Popover, { usePopover } from '@components/popover'
import PopoverArrow, { getArrowHeight } from '@components/popoverArrow'

import useMountEffect from '@utils/useMountEffect'
import usePrevious from '@utils/usePrevious'
import useSize from '@utils/useSize'

import BaseNode from '../model/node'

interface NodePanelProps<Node extends BaseNode> {
	node: Node
	setSimulationPlayState: Dispatch<SetStateAction<boolean>>
	renderNodePanel: (node: Node) => ReactNode
	onNodePanelOpenChange?: (open: boolean) => void
	wrapRef: RefObject<HTMLDivElement>
}

const NodePanel = observer(
	<Node extends BaseNode>({
		node,
		renderNodePanel,
		onNodePanelOpenChange,
		setSimulationPlayState,
		wrapRef,
	}: NodePanelProps<Node>) => {
		const svgNodeRef = useRef<HTMLButtonElement | null>(
			wrapRef.current?.querySelector(`g#node-${node.id}`) ?? null,
		)

		const { open, setOpen, triggerProps, popoverProps, arrowProps } = usePopover({
			offset: getArrowHeight('l') + 2,
			placement: 'top',
		})

		useEffect(() => {
			onNodePanelOpenChange?.(open)

			if (open) {
				setSimulationPlayState(false)
				if (svgNodeRef.current) {
					svgNodeRef.current.classList.add('pressed')
					svgNodeRef.current.style.pointerEvents = 'none'
				}
				return
			}

			setSimulationPlayState(true)
			if (svgNodeRef.current) {
				svgNodeRef.current.classList.remove('pressed')
				svgNodeRef.current.style.pointerEvents = 'initial'
			}
		}, [open, setSimulationPlayState, onNodePanelOpenChange])

		useMountEffect(() => {
			triggerProps.ref(svgNodeRef.current)
		})

		// Close node panel on resize
		const { width: wrapWidth } = useSize(wrapRef)
		const prevWrapWidth = usePrevious(wrapWidth)
		useEffect(() => {
			if (wrapWidth === prevWrapWidth || !open) return
			setOpen(false)
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [wrapWidth, prevWrapWidth])

		return (
			<Fragment>
				<VisuallyHidden>
					<button
						{...triggerProps}
						id={`node-panel-trigger-${node.id}`}
						onFocus={() => svgNodeRef.current?.classList.add('focused')}
						onBlur={() => svgNodeRef.current?.classList.remove('focused')}
					>
						{`Node ${node.label}`}
					</button>
				</VisuallyHidden>
				<StyledPopover animateScale {...popoverProps}>
					<PopoverArrow size="l" {...arrowProps} />
					{renderNodePanel(node)}
				</StyledPopover>
			</Fragment>
		)
	},
)

const StyledPopover = styled(Popover)`
	padding: var(--space-1) var(--space-2);
`

export default NodePanel
