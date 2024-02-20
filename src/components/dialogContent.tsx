import { ButtonHTMLAttributes, ReactNode, useRef } from 'react'
import { useDialog } from '@react-aria/dialog'
import { FocusScope } from '@react-aria/focus'
import { useModal, useOverlay, usePreventScroll } from '@react-aria/overlays'
import { mergeProps } from '@react-aria/utils'
import { AriaDialogProps } from '@react-types/dialog'
import styled from 'styled-components'

import IconClose from '@icons/close'

import { Breakpoint } from '@theme/breakpoints'

export interface DialogContentProps extends AriaDialogProps {
	title?: string
	isOpen: boolean
	onClose: () => void
	animationState?: string
	renderContent?: () => ReactNode
	isDismissable?: boolean
	showCloseButton: boolean
	closeButtonProps: ButtonHTMLAttributes<HTMLButtonElement>
	compact?: boolean
	size?: Breakpoint
}

const DialogContent = ({
	animationState,
	isDismissable = true,
	showCloseButton,
	closeButtonProps,
	renderContent,
	compact = false,
	size = 's',
	...props
}: DialogContentProps) => {
	const { title } = props
	const ref = useRef(null)
	const { overlayProps, underlayProps } = useOverlay({ ...props, isDismissable }, ref)
	const { dialogProps, titleProps } = useDialog(props, ref)

	usePreventScroll()
	const { modalProps } = useModal()

	return (
		<OuterWrap className={animationState}>
			<Backdrop {...underlayProps}>
				<FocusScope contain restoreFocus autoFocus>
					<Wrap
						ref={ref}
						{...mergeProps(overlayProps, dialogProps, modalProps)}
						compact={compact}
						size={size}
					>
						<TitleWrap compact={compact}>
							<Title compact={compact} {...titleProps}>
								{title}
							</Title>
							{showCloseButton && (
								<CloseButton compact={compact} aria-label="Dismiss" {...closeButtonProps}>
									<StyledIconClose useAlt />
								</CloseButton>
							)}
						</TitleWrap>
						{renderContent?.()}
					</Wrap>
				</FocusScope>
			</Backdrop>
		</OuterWrap>
	)
}

export default DialogContent

const OuterWrap = styled.div`
	position: fixed;
	inset: 0;
	transition: opacity var(--animation-fast-out);
	transform: translateZ(0);
	opacity: 0;
	will-change: opacity;
	z-index: var(--z-index-dialog);
	contain: layout;

	&.entering,
	&.entered {
		opacity: 1;
	}

	&.exiting {
		opacity: 0;
	}
`

const Backdrop = styled.div`
	${(p) => p.theme.spread};
	${(p) => p.theme.flexCenter};

	padding-left: var(--page-margin-left);
	padding-right: var(--page-margin-right);
	background: var(--color-line);
`

const Wrap = styled.div<{ compact: boolean; size: Breakpoint }>`
	/* stylelint-disable-next-line custom-property-pattern */
	width: var(--size-${(p) => p.size});
	max-width: 100%;
	background: var(--color-background-raised);
	border-radius: var(--border-radius-l);
	box-shadow: 0 0 0 1px var(--color-line), var(--box-shadow-l);
	transform: translate3d(0, 4rem, 0);
	transition: transform var(--animation-medium-out);
	will-change: transform;
	text-align: left;
	align-items: flex-start;
	padding: ${(p) =>
		p.compact ? `var(--space-0) var(--space-0)` : `var(--space-3) var(--space-4)`};

	${/* sc-selector */ OuterWrap}.entering &,
		${/* sc-selector */ OuterWrap}.entered & {
		transform: translate3d(0, 0, 0);
	}

	${/* sc-selector */ OuterWrap}.exiting & {
		transform: translate3d(0, 0, 0);
	}

	${(p) => p.theme.breakpoints.xs} {
		padding: ${(p) =>
			p.compact ? `var(--space-0) var(--space-0)` : `var(--space-2) var(--space-3)`};
	}

	@media (prefers-reduced-motion) {
		transition: none;
	}
`

const TitleWrap = styled.div<{ compact: boolean }>`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: var(--space-2);
	padding-bottom: var(--space-1);
	border-bottom: solid 1px var(--color-line);

	${(p) =>
		p.compact &&
		`
		padding: var(--space-1) 0; 
		margin: 0 var(--space-1) var(--space-0) var(--space-2);
		gap: var(--space-2);
	`};
`

const CloseButton = styled.button<{ compact: boolean }>`
	display: flex;
	padding: var(--space-1);
	margin: calc(var(--space-1) * -1);
	color: var(--color-label);

	${(p) => (p.compact ? p.theme.text.label : p.theme.text.h4)};

	&:hover {
		color: var(--color-heading);
	}
`

const StyledIconClose = styled(IconClose)`
	width: 1em;
	height: 1em;

	min-width: 1.25rem;
	min-height: 1.25rem;
`

const Title = styled.h2<{ compact: boolean }>`
	${(p) => (p.compact ? p.theme.text.label : p.theme.text.h5)};
`
