import { ReactNode } from 'react'
import styled from 'styled-components'

import BalancedText from '@components/balancedText'
import Popover, { usePopover, UsePopoverProps } from '@components/popover'

export interface TooltipProps extends Omit<UsePopoverProps, 'trigger'> {
  /**
   * Contents of the tooltip
   */
  content: ReactNode
  /**
   * Tooltip trigger. The props and ref are provided
   * (p: TriggerChildrenProps). Should return a trigger
   * element with the props and ref attached.
   */
  children: (p: Partial<ReturnType<typeof usePopover>['triggerProps']>) => JSX.Element
  delay?: NonNullable<UsePopoverProps['hoverProps']>['delay']
  /**
   * Whether to stretch (via theme.utils.spread) the
   * tooltip container to match its parent's bounds
   */
  spread?: boolean
  maxWidth?: string
  ariaHidden?: boolean
  renderWrapperAsSpan?: boolean
  renderOverlayAsSpan?: boolean
  className?: string
}

const TooltipTrigger = ({
  content,
  spread = false,
  placement = 'bottom',
  offset = 8,
  delay = 1000,
  maxWidth = '10rem',
  renderWrapperAsSpan = false,
  renderOverlayAsSpan = false,
  ariaHidden = false,
  className,
  ...props
}: TooltipProps) => {
  const { triggerProps, popoverProps } = usePopover({
    role: 'tooltip',
    trigger: ['hover', 'focus'],
    hoverProps: { move: false, delay },
    placement,
    offset,
  })

  // If no tooltip content is provided, then simply return
  // the trigger element without any tooltip associated with it
  if (!content) return props.children({})

  const TriggerWrap = renderWrapperAsSpan ? TriggerSpanWrap : TriggerDivWrap

  return (
    <TriggerWrap className={className} spread={spread} {...props}>
      {props.children(triggerProps)}
      <StyledPopover
        {...popoverProps}
        aria-hidden={ariaHidden}
        maxWidth={maxWidth}
        renderWrapperAsSpan={renderOverlayAsSpan}
        initialFocus={-1}
        returnFocus={false}
        modal={false}
        guards={false}
      >
        {typeof content === 'string' ? <BalancedText>{content}</BalancedText> : content}
      </StyledPopover>
    </TriggerWrap>
  )
}

export default TooltipTrigger

const getTextAlign = ({ placement }: { placement?: UsePopoverProps['placement'] }) => {
  switch (placement) {
    case 'top-start':
    case 'bottom-start':
    case 'right':
    case 'right-start':
    case 'right-end':
      return 'text-align: left;'
    case 'top-end':
    case 'bottom-end':
    case 'left':
    case 'left-start':
    case 'left-end':
      return 'text-align: right;'
    case 'top':
    case 'bottom':
    default:
      return 'text-align: center;'
  }
}

const StyledPopover = styled(Popover)<{ maxWidth: string }>`
  width: max-content;
  padding: var(--space-0) var(--space-1);
  border-radius: var(--border-radius-s);
  z-index: var(--z-index-tooltip);

  color: var(--color-label);
  ${(p) => p.theme.text.small};
  ${getTextAlign}

  :focus {
    outline: none;
  }
`

const TriggerDivWrap = styled.div<{ spread: boolean }>`
  ${(p) => p.spread && p.theme.spread};
`

const TriggerSpanWrap = styled.span<{ spread: boolean }>`
  ${(p) => p.spread && p.theme.spread};
`
