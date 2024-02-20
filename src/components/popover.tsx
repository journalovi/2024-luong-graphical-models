import {
  ComponentProps,
  CSSProperties,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
  ReactNode,
  Ref,
  useMemo,
  useState,
} from 'react'
import { Transition } from 'react-transition-group'
import {
  arrow,
  autoUpdate,
  DetectOverflowOptions,
  flip,
  FlipOptions,
  FloatingContext,
  FloatingFocusManager,
  offset,
  OffsetOptions,
  Placement,
  shift,
  ShiftOptions,
  size,
  useClick,
  UseClickProps,
  useDismiss,
  UseDismissProps,
  useFloating,
  UseFloatingOptions,
  useFocus,
  UseFocusProps,
  useHover,
  UseHoverProps,
  useInteractions,
  useRole,
  UseRoleProps,
} from '@floating-ui/react'
import { useInteractOutside } from '@react-aria/interactions'
import styled, { css } from 'styled-components'

import BackgroundNoise from '@images/background-noise.png'

import { navHeight } from '@layouts/globalVariables'
import { Theme } from '@theme'
import LocalThemeProvider from '@utils/localThemeProvider'

type TriggerInteraction = 'click' | 'hover' | 'focus'

export interface UsePopoverProps<TriggerType extends HTMLElement = HTMLElement>
  extends Partial<Omit<UseFloatingOptions, 'middleware'>> {
  role?: UseRoleProps['role']
  trigger?: TriggerInteraction | TriggerInteraction[] | null
  dismissable?: boolean
  resize?: boolean
  detectOverflowOptions?: Partial<DetectOverflowOptions>
  shift?: ShiftOptions
  flip?: FlipOptions
  offset?: OffsetOptions
  clickProps?: UseClickProps
  hoverProps?: UseHoverProps<TriggerType>
  focusProps?: UseFocusProps
  dismissProps?: UseDismissProps
}

const roundPixels = {
  name: 'roundPixels',
  fn({ x, y }: { x: number; y: number }) {
    return {
      x: Math.round(x),
      y: Math.round(y),
    }
  },
}

export const usePopover = <TriggerType extends HTMLElement = HTMLElement>({
  role: roleProp = 'dialog',
  trigger = 'click',
  dismissable = true,
  resize = false,
  placement = 'left',
  strategy = 'absolute',
  detectOverflowOptions = {
    padding: {
      top: navHeight + 16,
      bottom: 16,
      right: 16,
      left: 16,
    },
  },
  shift: shiftOptions,
  flip: flipOptions,
  offset: offsetOptions,
  clickProps = {},
  hoverProps = {},
  focusProps = {},
  dismissProps = {},
  ...props
}: UsePopoverProps<TriggerType>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)

  const middleware = useMemo(
    () => [
      shift({ ...detectOverflowOptions, ...shiftOptions }),
      flip({ ...detectOverflowOptions, ...flipOptions }),
      offset(offsetOptions ?? 4),
      ...(arrowElement
        ? [
            arrow({
              element: arrowElement,
              padding: 20,
            }),
          ]
        : []),
      ...(resize
        ? [
            size({
              ...detectOverflowOptions,
              apply({ availableWidth, availableHeight, elements }) {
                Object.assign(elements.floating.style, {
                  maxWidth: `${availableWidth}px`,
                  maxHeight: `${availableHeight}px`,
                })
              },
            }),
          ]
        : []),
      roundPixels,
    ],
    [
      detectOverflowOptions,
      shiftOptions,
      flipOptions,
      offsetOptions,
      resize,
      arrowElement,
    ],
  )

  const {
    x,
    y,
    refs,
    placement: calculatedPlacement,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    context,
    update,
  } = useFloating<TriggerType>({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    placement,
    strategy,
    middleware,
    ...props,
  })

  const interactionEnabled = (interaction: TriggerInteraction) =>
    Array.isArray(trigger) ? trigger.includes(interaction) : trigger === interaction

  const click = useClick<TriggerType>(context, {
    enabled: interactionEnabled('click'),
    ...clickProps,
  })
  const hover = useHover<TriggerType>(context, {
    enabled: interactionEnabled('hover'),
    ...hoverProps,
  })
  const focus = useFocus<TriggerType>(context, {
    enabled: interactionEnabled('focus'),
    ...focusProps,
  })
  const role = useRole(context, { role: roleProp })
  const dismiss = useDismiss<TriggerType>(context, {
    enabled: dismissable,
    // Outside press handled using react-aria's useInteractOutside().
    // See https://github.com/adobe/react-spectrum/issues/4517
    outsidePress: false,
    referencePress: false,
    ...dismissProps,
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    focus,
    role,
    dismiss,
  ])

  // See https://github.com/adobe/react-spectrum/issues/4517
  useInteractOutside({
    ref: refs.floating,
    isDisabled: !isOpen,
    onInteractOutside: (e) => {
      // Use composedPath to account for events from inside shadow DOMs
      const target = (e as unknown as Event).composedPath?.()[0] || e.target

      if (
        target instanceof Node &&
        ((refs.reference.current instanceof HTMLElement &&
          refs.reference.current.contains(target)) ||
          (refs.floating.current instanceof HTMLElement &&
            refs.floating.current.contains(target)))
      ) {
        return
      }

      setIsOpen(false)
      props.onOpenChange?.(false)
    },
  })

  return {
    open: context.open,
    setOpen: setIsOpen,
    update,
    refs: {
      trigger: refs.reference as MutableRefObject<TriggerType | null>,
      popover: refs.floating,
    },
    triggerProps: {
      ref: refs.setReference,
      ...getReferenceProps(),
    },
    popoverProps: {
      ref: refs.setFloating,
      context,
      style: { position: strategy, top: y, left: x },
      arrowStyles: { top: arrowY, left: arrowX },
      placement: calculatedPlacement,
      ...getFloatingProps(),
    },
    arrowProps: {
      ref: setArrowElement,
      style: { top: arrowY, left: arrowX },
      placement: calculatedPlacement,
    },
  }
}

interface PopoverProps<TriggerType extends HTMLElement = HTMLElement>
  extends HTMLAttributes<HTMLDivElement>,
    Omit<ComponentProps<typeof FloatingFocusManager>, 'children' | 'context'> {
  context: FloatingContext<TriggerType>
  arrowStyles?: CSSProperties
  placement?: Placement
  maxWidth?: string
  animateScale?: boolean
  renderWrapperAsSpan?: boolean
  className?: string
  children?: ReactNode
}

const PopoverRenderFn = <TriggerType extends HTMLElement = HTMLElement>(
  {
    // Focus manager props
    context,
    order,
    initialFocus,
    guards,
    returnFocus,
    modal,
    visuallyHiddenDismiss,
    closeOnFocusOut,
    // Wrap props
    placement,
    maxWidth,
    animateScale = false,
    arrowStyles = {},
    renderWrapperAsSpan,
    children,
    className,
    ...props
  }: PopoverProps<TriggerType>,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const Wrap = renderWrapperAsSpan ? SpanWrap : DivWrap
  return (
    <Transition in={context.open} timeout={250} unmountOnExit mountOnEnter>
      {(animationState) => (
        <FloatingFocusManager
          context={context}
          order={order}
          initialFocus={initialFocus}
          guards={guards}
          returnFocus={returnFocus}
          modal={modal}
          visuallyHiddenDismiss={visuallyHiddenDismiss}
          closeOnFocusOut={closeOnFocusOut}
        >
          <LocalThemeProvider raised>
            <Wrap
              {...props}
              maxWidth={maxWidth}
              placement={placement}
              className={`${animationState} ${className ?? ''}`}
              animateScale={animateScale}
              arrowStyles={arrowStyles}
              ref={ref}
            >
              {children}
            </Wrap>
          </LocalThemeProvider>
        </FloatingFocusManager>
      )}
    </Transition>
  )
}

const Popover = forwardRef(PopoverRenderFn) as <
  TriggerType extends HTMLElement = HTMLElement,
>(
  p: PopoverProps<TriggerType> & { ref?: Ref<HTMLDivElement> },
) => ReactElement

export default Popover

interface PopoverWrapProps {
  maxWidth?: string
  placement?: Placement
  animateScale: boolean
  arrowStyles: CSSProperties
}

const getTransform = ({ animateScale, placement, arrowStyles }: PopoverWrapProps) => {
  const scaleTerm = animateScale ? 'scale(0.95)' : ''
  const [mainAxis, altAxis] = placement?.split('-') ?? []

  switch (mainAxis) {
    case 'top':
      return css`
        transform-origin: ${arrowStyles.left
            ? `${arrowStyles.left}px`
            : altAxis === 'end'
            ? '100%'
            : '0%'}
          100%;
        transform: translate3d(0, var(--space-2), 0) ${scaleTerm};
      `
    case 'bottom':
      return css`
        transform-origin: ${arrowStyles.left
            ? `${arrowStyles.left}px`
            : altAxis === 'end'
            ? '100%'
            : '0%'}
          0%;
        transform: translate3d(0, calc(var(--space-2) * -1), 0) ${scaleTerm};
      `
    case 'left':
      return css`
        transform-origin: 100%
          ${arrowStyles.top ? `${arrowStyles.top}px` : altAxis === 'end' ? '100%' : '0%'};
        transform: translate3d(var(--space-2), 0, 0) ${scaleTerm};
      `
    case 'right':
      return css`
        transform-origin: 0%
          ${arrowStyles.top ? `${arrowStyles.top}px` : altAxis === 'end' ? '100%' : '0%'};
        transform: translate3d(calc(var(--space-2) * -1), 0, 0) ${scaleTerm};
      `
    default:
      return ''
  }
}

const getStyles = (p: PopoverWrapProps & { theme: Theme }) => css`
  position: absolute;
  max-width: ${p.maxWidth
    ? `min(${p.maxWidth}, calc(100vw - 32px))`
    : `calc(100vw - 32px)`};
  border-radius: var(--border-radius-m);
  padding: var(--space-0);
  background: var(--color-background-raised);
  box-shadow: 0 0 0 1px var(--color-line), var(--box-shadow-l);
  transition: transform var(--animation-fast-out), opacity var(--animation-fast-out);
  opacity: 0;
  z-index: var(--z-index-popover);
  pointer-events: none;
  contain: layout;

  &::before {
    content: '';
    ${(p) => p.theme.spread};
    background-image: url(${BackgroundNoise});
    background-size: 25px;
    background-repeat: repeat;
    opacity: 0.5;
    pointer-events: none;
  }

  ${getTransform(p)}

  &.entering,
  &.entered {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  &.entered {
    pointer-events: auto;
  }

  &.exiting {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(1);
    pointer-events: none;
  }

  @media (prefers-reduced-motion) {
    transition: opacity var(--animation-fast-out);
  }
`

const DivWrap = styled.div<PopoverWrapProps>`
  ${getStyles}
`

const SpanWrap = styled.span`
  display: block;
  ${getStyles}
`
