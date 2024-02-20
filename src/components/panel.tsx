import {
	ComponentProps,
	ForwardedRef,
	forwardRef,
	ForwardRefRenderFunction,
	HTMLAttributes,
} from 'react'
import styled, { useTheme } from 'styled-components'

import { Theme } from '@theme'
import LocalThemeProvider from '@utils/localThemeProvider'

interface PanelWrapProps
	extends HTMLAttributes<HTMLDivElement>,
		ComponentProps<typeof LocalThemeProvider> {
	size?: 's' | 'm' | 'l'
	gridColumn?: keyof Theme['gridColumn']
	forwardedRef?: ForwardedRef<HTMLDivElement>
	className?: string
}

const PanelWrap = ({ children, className, forwardedRef, ...props }: PanelWrapProps) => {
	const { elevation } = useTheme()

	return (
		<Wrap
			ref={forwardedRef}
			{...props}
			className={`surface-${elevation} ${className ?? ''}`}
		>
			{children}
		</Wrap>
	)
}

export interface PanelProps
	extends ComponentProps<typeof LocalThemeProvider>,
		PanelWrapProps {}

const BasePanel: ForwardRefRenderFunction<HTMLDivElement, PanelProps> = (
	{ size, gridColumn, className, children, ...themeProviderProps },
	forwardedRef,
) => (
	<LocalThemeProvider {...themeProviderProps}>
		<PanelWrap
			forwardedRef={forwardedRef}
			className={className}
			size={size}
			gridColumn={gridColumn}
		>
			{children}
		</PanelWrap>
	</LocalThemeProvider>
)

const Panel = forwardRef(BasePanel)

export default Panel

const getPadding = (p: { size?: PanelProps['size']; theme: Theme }) => {
	switch (p.size) {
		case 's':
			return `
				padding: var(--space-3);
				${p.theme.breakpoints.s} {padding: var(--space-2)}
			`
		case 'm':
			return `
					padding: var(--space-4);
					${p.theme.breakpoints.s} {padding: var(--space-3)}
				`
		case 'l':
			return `
				padding: var(--space-5);
				${p.theme.breakpoints.s} {padding: var(--space-4)}
			`
		default:
			return null
	}
}

const Wrap = styled.div<{
	size?: PanelProps['size']
	mt?: number
	mb?: number
	gridColumn?: PanelProps['gridColumn']
}>`
	background-color: var(--color-background);
	border-radius: var(--border-radius-l);
	border: solid 1px var(--color-surface-border);

	${getPadding}

	${(p) => p.gridColumn && p.theme.gridColumn[p.gridColumn]}
	${(p) =>
		p.gridColumn === 'wide' &&
		`
		${p.theme.breakpoints.mobile} {
			padding-left: var(--page-margin-left);
			padding-right: var(--page-margin-right);
		}
	`}

	${(p) =>
		p.gridColumn === 'wide' &&
		`
			${p.theme.breakpoints.s} {
				border-radius: 0;
				border-left-width: 0;
				border-right-width: 0;
			}
		`}
`
